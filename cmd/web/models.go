package web

import (
	"embed"
	"os"
)

//go:embed "assets"
var Files embed.FS

// Define the project name
func SchoolName() string {
	return os.Getenv("PROJECT_NAME")
}

type User struct {
	FirstName   string
	LastName    string
	Gender      string
	Email       string
	PhoneNumber string
	Password    string
	Role        string
}
