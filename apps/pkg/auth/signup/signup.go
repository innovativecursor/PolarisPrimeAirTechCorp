package signup

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/auth/config"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/models"
	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

func SignUp(c *gin.Context, db *mongo.Database) {
	var signUpData config.SignupRequest
	if err := c.ShouldBindJSON(&signUpData); err != nil {
		logrus.WithError(err).Error("Failed to bind signup data")
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	collection := db.Collection("pendinguser")

	// Check if user already exists in user or pending collections
	var existingUser models.User
	var pendingUser models.PendingUser

	userCol := db.Collection("user")
	_ = userCol.FindOne(c, bson.M{"email": signUpData.Email}).Decode(&existingUser)
	_ = collection.FindOne(c, bson.M{"email": signUpData.Email}).Decode(&pendingUser)

	if existingUser.Email != "" || pendingUser.Email != "" {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already registered or pending approval"})
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(signUpData.Password), bcrypt.DefaultCost)
	if err != nil {
		logrus.WithError(err).Error("Failed to hash password")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process signup"})
		return
	}

	// Save pending user
	newPendingUser := models.PendingUser{
		Email:       signUpData.Email,
		Password:    string(hashedPassword),
		RequestedAt: time.Now(),
		Status:      "pending",
	}

	_, err = collection.InsertOne(c, newPendingUser)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create pending signup request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Signup request submitted. Waiting for admin approval.",
	})

}

// View all pending users
func GetAllUsers(c *gin.Context, db *mongo.Database) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	currentUser, ok := user.(*models.User)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	// Only SuperAdmins can view all users
	if !currentUser.IsSuperAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	userCol := db.Collection("user")
	pendingCol := db.Collection("pendinguser")
	roleCol := db.Collection("role")

	var allUsers []bson.M

	// Helper function to convert role ID → role name
	getRoleName := func(roleID interface{}) string {
		if roleID == nil {
			return "N/A"
		}

		var role bson.M
		var err error

		switch v := roleID.(type) {
		case primitive.ObjectID:
			err = roleCol.FindOne(c, bson.M{"_id": v}).Decode(&role)
		case string:
			oid, errConv := primitive.ObjectIDFromHex(v)
			if errConv == nil {
				err = roleCol.FindOne(c, bson.M{"_id": oid}).Decode(&role)
			}
		default:
			return "N/A"
		}

		if err == nil {
			if name, ok := role["name"].(string); ok {
				return name
			}
		}
		return "N/A"
	}

	processUsers := func(users []bson.M) {
		for _, u := range users {
			delete(u, "password") // Remove password for security

			// Replace role ObjectID with role name
			roleName := getRoleName(u["roles"])
			u["role"] = roleName
			delete(u, "roles")

			allUsers = append(allUsers, u)
		}
	}

	// Fetch approved users
	userCursor, err := userCol.Find(c, bson.M{})
	if err == nil {
		defer userCursor.Close(c)
		var approvedUsers []bson.M
		if err := userCursor.All(c, &approvedUsers); err == nil {
			processUsers(approvedUsers)
		}
	}

	// Fetch pending users (exclude already approved ones)
	pendingCursor, err := pendingCol.Find(c, bson.M{"status": bson.M{"$ne": "approved"}})
	if err == nil {
		defer pendingCursor.Close(c)
		var pendingUsers []bson.M
		if err := pendingCursor.All(c, &pendingUsers); err == nil {
			processUsers(pendingUsers)
		}
	}

	c.JSON(http.StatusOK, gin.H{"users": allUsers})
}

func ApproveOrUpdateUser(c *gin.Context, db *mongo.Database) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	currentUser, ok := user.(*models.User)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	// SuperAdmin only
	if !currentUser.IsSuperAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	var payload config.ApprovePayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	objID, _ := primitive.ObjectIDFromHex(payload.UserID)
	roleID, _ := primitive.ObjectIDFromHex(payload.RoleID)

	// Prevent self-update
	if currentUser.ID == objID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You cannot modify your own account"})
		return
	}

	userCol := db.Collection("user")
	pendingCol := db.Collection("pendinguser")

	var existingUser models.User
	err := userCol.FindOne(c, bson.M{"_id": objID}).Decode(&existingUser)
	if err == nil {
		if payload.Action == "deactivate" {
			_, err = userCol.UpdateOne(c,
				bson.M{"_id": objID},
				bson.M{"$set": bson.M{"status": "suspended"}},
			)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to deactivate user"})
				return
			}
			c.JSON(http.StatusOK, gin.H{"message": "User account deactivated"})
			return
		}

		_, err = userCol.UpdateOne(c,
			bson.M{"_id": objID},
			bson.M{"$set": bson.M{"roles": roleID, "status": "active"}},
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user role"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "User role updated successfully"})
		return
	}

	var pendingUser models.PendingUser
	err = pendingCol.FindOne(c, bson.M{"_id": objID}).Decode(&pendingUser)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if payload.Action == "reject" {
		_, err = pendingCol.UpdateOne(c,
			bson.M{"_id": objID},
			bson.M{"$set": bson.M{"status": "rejected", "processedAt": time.Now()}})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reject user"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "User rejected successfully"})
		return
	}

	newUser := models.User{
		Email:        pendingUser.Email,
		Password:     pendingUser.Password,
		Roles:        roleID,
		IsSuperAdmin: false,
		Status:       "active",
	}
	_, err = userCol.InsertOne(c, newUser)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to approve user"})
		return
	}

	_, _ = pendingCol.UpdateOne(c,
		bson.M{"_id": objID},
		bson.M{"$set": bson.M{"status": "approved", "processedAt": time.Now()}})

	c.JSON(http.StatusOK, gin.H{"message": "User approved successfully"})
}

func CreateRole(c *gin.Context, db *mongo.Database) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	currentUser, ok := user.(*models.User)
	if !ok || !currentUser.IsSuperAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	var payload config.RoleData
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var menuIDs []primitive.ObjectID
	for _, id := range payload.Menus {
		oid, err := primitive.ObjectIDFromHex(id)
		if err == nil {
			menuIDs = append(menuIDs, oid)
		}
	}

	col := db.Collection("role")
	err := col.FindOne(c, bson.M{"name": payload.Name}).Err()
	if err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Role already exists"})
		return
	}
	_, err = col.InsertOne(c, models.Role{
		Name:  payload.Name,
		Menus: menuIDs,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create role"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Role created successfully"})
}

type RoleUpdatePayload struct {
	RoleID string   `json:"role_id" binding:"required"`
	Menus  []string `json:"menus"`
}

func UpdateRoleMenus(c *gin.Context, db *mongo.Database) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	currentUser, ok := user.(*models.User)
	if !ok || !currentUser.IsSuperAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	var payload RoleUpdatePayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	roleID, err := primitive.ObjectIDFromHex(payload.RoleID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid role ID"})
		return
	}

	var menuIDs []primitive.ObjectID
	for _, id := range payload.Menus {
		oid, err := primitive.ObjectIDFromHex(id)
		if err == nil {
			menuIDs = append(menuIDs, oid)
		}
	}

	roleCol := db.Collection("role")
	_, err = roleCol.UpdateOne(c,
		bson.M{"_id": roleID},
		bson.M{"$set": bson.M{"menus": menuIDs}},
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update role menus"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Role menus updated successfully"})
}

func GetAllRoles(c *gin.Context, db *mongo.Database) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	_, ok := user.(*models.User)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}
	col := db.Collection("role")

	cursor, err := col.Find(c, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch roles"})
		return
	}
	defer cursor.Close(c)

	var roles []bson.M
	if err := cursor.All(c, &roles); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse roles"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"roles": roles,
	})
}

func GetRoleWithMenus(c *gin.Context, db *mongo.Database) {
	// Auth
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	currentUser, ok := user.(*models.User)
	if !ok || !currentUser.IsSuperAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	// Payload
	var payload config.GetRolePayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	roleID, err := primitive.ObjectIDFromHex(payload.RoleID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid role ID"})
		return
	}

	// Fetch role
	roleCol := db.Collection("role")
	var role models.Role
	err = roleCol.FindOne(c, bson.M{"_id": roleID}).Decode(&role)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Role not found"})
		return
	}

	// Fetch menus for role
	menuCol := db.Collection("menu")
	cursor, err := menuCol.Find(c, bson.M{
		"_id": bson.M{"$in": role.Menus},
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch menus"})
		return
	}
	defer cursor.Close(c)

	var menus []models.Menu
	if err := cursor.All(c, &menus); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse menus"})
		return
	}

	// Response
	c.JSON(http.StatusOK, gin.H{
		"role_id": role.ID,
		"name":    role.Name,
		"menus":   menus,
	})
}

func GetAllMenus(c *gin.Context, db *mongo.Database) {
	menuCol := db.Collection("menu")

	cursor, err := menuCol.Find(c, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch menus"})
		return
	}
	defer cursor.Close(c)

	var menus []models.Menu
	if err := cursor.All(c, &menus); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse menus"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"menus": menus})
}

func GetUserMenus(user models.User, db *mongo.Database) ([]models.Menu, error) {
	menuCol := db.Collection("menu")
	roleCol := db.Collection("role")

	if user.IsSuperAdmin {
		// Super admin sees ALL menus automatically
		cursor, err := menuCol.Find(context.TODO(), bson.M{})
		if err != nil {
			return nil, err
		}
		defer cursor.Close(context.TODO())

		var menus []models.Menu
		if err := cursor.All(context.TODO(), &menus); err != nil {
			return nil, err
		}
		return menus, nil
	}

	// Normal user: get menus from role
	var role models.Role
	err := roleCol.FindOne(context.TODO(), bson.M{"_id": user.Roles}).Decode(&role)
	if err != nil {
		return nil, err
	}

	cursor, err := menuCol.Find(context.TODO(), bson.M{"_id": bson.M{"$in": role.Menus}})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.TODO())

	var menus []models.Menu
	if err := cursor.All(context.TODO(), &menus); err != nil {
		return nil, err
	}
	return menus, nil
}
