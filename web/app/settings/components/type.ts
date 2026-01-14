export type User = {
  _id: string;
  email: string;
  role: string;
  status: "active" | "pending" | "inactive";
  isSuperAdmin?: boolean;
  requestedAt?: string;
};

export type GetAllUsersResponse = {
  users: User[];
};


export type Role = {
  _id: string;
  name: string;
};

export type GetAllRolesResponse = {
  roles: Role[];
};

export type MenuItem = {
  id: string;
  label: string;
  href: string;
};

export type  MenuRes = {
  menus: MenuItem[]
}