package config

import (
	"io/ioutil"
	"os"
	"path/filepath"

	yaml "gopkg.in/yaml.v2"
)

type Config struct {
	Env string `yaml:"env"`

	Mongo struct {
		ConnectionString string `yaml:"connectionString"`
		Database         string `yaml:"database"`
	} `yaml:"mongo"`
	JWT struct {
		Secret string `yaml:"secret"`
	} `yaml:"jwt"`
	Seed struct {
		SuperAdmins []struct {
			Email    string `yaml:"email"`
			Password string `yaml:"password"`
		} `yaml:"superAdmins"`
	} `yaml:"seed"`
}

func Env() (Config, error) {
	var config Config

	// Get user home dire
	home := os.Getenv("ENV_PATH")
	filePath := filepath.Join(home, "env.yaml")

	envData, err := ioutil.ReadFile(filePath)
	if err != nil {
		return config, err
	}

	// Parse YAML data
	err = yaml.Unmarshal(envData, &config)
	if err != nil {
		return config, err
	}
	// Return config
	return config, nil
}
