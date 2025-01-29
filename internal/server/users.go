package server

import (
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"strings"

	"school_management_system/cmd/web/components"
	"school_management_system/cmd/web/dashboard"
	"school_management_system/internal/cookies"
	"school_management_system/internal/database"

	"github.com/a-h/templ"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"golang.org/x/crypto/bcrypt"
)

// common handler logic for rendering components
func (s *Server) renderComponent(w http.ResponseWriter, r *http.Request, component templ.Component) {
	err := component.Render(r.Context(), w)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		slog.Error("Failed to render component", "Message:", err)
	}
}

// An endpoint to create a new user account
func (s *Server) Register(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if err := r.ParseForm(); err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	firstName := r.FormValue("first_name")
	lastName := r.FormValue("last_name")
	phoneNumber := r.FormValue("phone_number")
	email := r.FormValue("email")
	gender := r.FormValue("gender")
	password := r.FormValue("password")
	confirmPassword := r.FormValue("confirm_password")
	name := r.FormValue("role") // Role name

	if firstName == "" || lastName == "" || phoneNumber == "" || gender == "" || password == "" || confirmPassword == "" || name == "" {
		http.Error(w, "All fields except email are required", http.StatusBadRequest)
		return
	}

	if password != confirmPassword {
		http.Error(w, "Passwords do not match", http.StatusBadRequest)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Failed to hash password: "+err.Error(), http.StatusInternalServerError)
		return
	}

	var emailValue pgtype.Text
	if email != "" {
		emailValue = pgtype.Text{String: email, Valid: true}
	} else {
		emailValue = pgtype.Text{Valid: false}
	}

	user := database.CreateUserParams{
		FirstName:   firstName,
		LastName:    lastName,
		PhoneNumber: pgtype.Text{String: phoneNumber, Valid: true},
		Email:       emailValue,
		Gender:      gender,
		Password:    string(hashedPassword),
		Name:        name,
	}

	if _, err = s.queries.CreateUser(r.Context(), user); err != nil {
		http.Error(w, "Failed to create user: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "text/html")

	component := components.SucessModal(components.User{
		FirstName: firstName,
		LastName:  lastName,
		Role:      name,
	})

	s.renderComponent(w, r, component)
}

// extract common session and user details retrieval logic
func (s *Server) getSessionAndUserDetails(r *http.Request) (components.User, error) {
	sessionID, err := cookies.ReadEncrypted(r, "sessionid", s.SecretKey)
	if err != nil {
		if errors.Is(err, http.ErrNoCookie) || errors.Is(err, cookies.ErrInvalidValue) {
			return components.User{}, fmt.Errorf("unauthorized: %w", err)
		}
		return components.User{}, fmt.Errorf("server error: %w", err)
	}

	parsedSessionID, err := uuid.Parse(sessionID)
	if err != nil {
		return components.User{}, fmt.Errorf("bad request: invalid session ID")
	}

	user, err := s.queries.GetSession(r.Context(), parsedSessionID)
	if err != nil {
		return components.User{}, fmt.Errorf("server error: %w", err)
	}

	userInfo, err := s.queries.GetUserDetails(r.Context(), user.UserID)
	if err != nil {
		return components.User{}, fmt.Errorf("server error: %w", err)
	}

	return components.User{
		UserID:      userInfo.UserID,
		FirstName:   userInfo.FirstName,
		LastName:    userInfo.LastName,
		Gender:      userInfo.Gender,
		Email:       userInfo.Email.String,
		PhoneNumber: userInfo.PhoneNumber.String,
		Password:    userInfo.Password,
		Role:        userInfo.Role,
	}, nil
}

// userDetails handler function
func (s *Server) userDetails(w http.ResponseWriter, r *http.Request) {
	user, err := s.getSessionAndUserDetails(r)
	if err != nil {
		var status int
		if strings.Contains(err.Error(), "unauthorized") {
			status = http.StatusUnauthorized
		} else if strings.Contains(err.Error(), "bad request") {
			status = http.StatusBadRequest
		} else {
			status = http.StatusInternalServerError
		}
		writeError(w, status, err.Error())
		return
	}

	w.Header().Set("Content-Type", "text/html")
	component := components.UserDetails(user)
	s.renderComponent(w, r, component)
}

// userRole handler function
func (s *Server) userRole(w http.ResponseWriter, r *http.Request) {
	user, err := s.getSessionAndUserDetails(r)
	if err != nil {
		var status int
		if strings.Contains(err.Error(), "unauthorized") {
			status = http.StatusUnauthorized
		} else if strings.Contains(err.Error(), "bad request") {
			status = http.StatusBadRequest
		} else {
			status = http.StatusInternalServerError
		}
		writeError(w, status, err.Error())
		return
	}

	w.Header().Set("Content-Type", "text/html")
	component := components.UserRole(user)
	s.renderComponent(w, r, component)
}

// ListUsers handler retrieves all users from the database
// This handler can only be accessed by someone with admin priviledges
func (s *Server) ListUsers(w http.ResponseWriter, r *http.Request) {
	userList, err := s.queries.ListUsers(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Internal Server Error")
		return
	}

	component := dashboard.UsersList(userList)
	s.renderComponent(w, r, component)
}

// EditUser handler
// Update user information
// expects form data with user information from
func (s *Server) EditUser(w http.ResponseWriter, r *http.Request) {
	userID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "invalid user id")
	}

	if err := r.ParseForm(); err != nil {
		writeError(w, http.StatusBadRequest, "Bad Request")
		return
	}

	firstName := r.FormValue("first_name")
	lastName := r.FormValue("last_name")
	phoneNumber := r.FormValue("phone_number")
	email := r.FormValue("email")
	gender := r.FormValue("gender")
	password := r.FormValue("password")
	name := r.FormValue("role")

	var emailValue pgtype.Text
	if email != "" {
		emailValue = pgtype.Text{String: email, Valid: true}
	} else {
		emailValue = pgtype.Text{Valid: false}
	}

	updateInfo := database.EditUserParams{
		UserID:      userID,
		FirstName:   firstName,
		LastName:    lastName,
		Gender:      gender,
		PhoneNumber: pgtype.Text{String: phoneNumber, Valid: true},
		Email:       emailValue,
		Password:    password,
		Name:        name,
	}

	err = s.queries.EditUser(r.Context(), updateInfo)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
	}
}

// DeleteUser handler
// Accepts an id parameter
// deletes a user from the database
func (s *Server) DeleteUser(w http.ResponseWriter, r *http.Request) {
	userID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "failed to parse user id")
	}

	err = s.queries.DeleteUser(r.Context(), userID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
	}
}
