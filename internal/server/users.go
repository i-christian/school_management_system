package server

import (
	"crypto/rand"
	"fmt"
	"log/slog"
	"math/big"
	"net/http"
	"strings"

	"school_management_system/cmd/web/components"
	"school_management_system/cmd/web/dashboard"
	"school_management_system/internal/database"

	"github.com/a-h/templ"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

// common handler logic for rendering components
func (s *Server) renderComponent(w http.ResponseWriter, r *http.Request, component templ.Component) {
	err := component.Render(r.Context(), w)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		slog.Error("Failed to render component", "Message:", err)
	}
}

// Generate a random 6-digit numeric password
func generateNumericPassword() (string, error) {
	const passwordLength = 6
	password := ""

	for i := 0; i < passwordLength; i++ {
		num, err := rand.Int(rand.Reader, big.NewInt(10))
		if err != nil {
			return "", err
		}
		password += fmt.Sprintf("%d", num.Int64())
	}

	return password, nil
}

// An endpoint to create a new user account
func (s *Server) Register(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}

	if err := r.ParseForm(); err != nil {
		writeError(w, http.StatusUnprocessableEntity, "failed to parse form")
		return
	}

	firstName := r.FormValue("first_name")
	lastName := r.FormValue("last_name")
	phoneNumber := r.FormValue("phone_number")
	email := r.FormValue("email")
	gender := r.FormValue("gender")
	role := r.FormValue("role") // Role name

	if firstName == "" || lastName == "" || phoneNumber == "" || gender == "" || role == "" {
		writeError(w, http.StatusBadRequest, "all fields except email are required")
		return
	}

	// Generate a 6-digit numeric password
	password, err := generateNumericPassword()
	if err != nil {
		slog.Error("Failed to generate password")
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}

	var emailValue pgtype.Text
	if email != "" {
		emailValue = pgtype.Text{String: email, Valid: true}
	} else {
		emailValue = pgtype.Text{Valid: false}
	}

	caser := cases.Title(language.English)
	user := database.CreateUserParams{
		FirstName:   caser.String(firstName),
		LastName:    caser.String(lastName),
		PhoneNumber: pgtype.Text{String: phoneNumber, Valid: true},
		Email:       emailValue,
		Gender:      gender,
		Password:    string(hashedPassword),
		Name:        role,
	}

	newUser, err := s.queries.CreateUser(r.Context(), user)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Info("Failed to create user", "message:", err.Error())
		return
	}

	w.Header().Set("Content-Type", "text/html")

	component := components.SucessModal(components.User{
		UserNo:    newUser.UserNo,
		FirstName: firstName,
		LastName:  lastName,
		Role:      role,
		Password:  password,
	})

	s.renderComponent(w, r, component)
}

// extract common user details retrieval logic
func (s *Server) getUserDetails(w http.ResponseWriter, r *http.Request) (components.User, error) {
	UserID, ok := r.Context().Value(userIDKey).(uuid.UUID)
	if !ok {
		writeError(w, http.StatusUnauthorized, "user not authenticated")
	}

	userInfo, err := s.queries.GetUserDetails(r.Context(), UserID)
	if err != nil {
		return components.User{}, fmt.Errorf("internal server error")
	}

	return components.User{
		UserID:      userInfo.UserID,
		UserNo:      userInfo.UserNo,
		FirstName:   userInfo.FirstName,
		LastName:    userInfo.LastName,
		Gender:      userInfo.Gender,
		Email:       userInfo.Email.String,
		PhoneNumber: userInfo.PhoneNumber.String,
		Role:        userInfo.Role,
	}, nil
}

// userDetails handler function
func (s *Server) userDetails(w http.ResponseWriter, r *http.Request) {
	user, err := s.getUserDetails(w, r)
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
		return
	}
}

// DeleteUser handler
// Accepts an id parameter
// deletes a user from the database
func (s *Server) DeleteUser(w http.ResponseWriter, r *http.Request) {
	userID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "failed to parse user id")
		return
	}

	err = s.queries.DeleteUser(r.Context(), userID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}
}
