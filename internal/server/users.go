package server

import (
	"crypto/rand"
	"fmt"
	"log/slog"
	"math/big"
	"net/http"
	"strings"

	"school_management_system/cmd/web"
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

// renderDashboardComponent renders a component either as a full dashboard page
// (when not an HTMX request) or just the component (when it's an HTMX request).
func (s *Server) renderComponent(w http.ResponseWriter, r *http.Request, children templ.Component) {
	if r.Header.Get("HX-Request") == "true" {
		if err := children.Render(r.Context(), w); err != nil {
			writeError(w, http.StatusBadRequest, err.Error())
			slog.Error("Failed to render dashboard component", "error", err)
		}
	} else {
		userRole, ok := r.Context().Value(userContextKey).(User)
		if !ok {
			writeError(w, http.StatusUnauthorized, "unauthorised")
			return
		}
		user := dashboard.DashboardUserRole{
			Role: userRole.Role,
		}
		ctx := templ.WithChildren(r.Context(), children)
		if err := web.Dashboard(user).Render(ctx, w); err != nil {
			writeError(w, http.StatusBadRequest, err.Error())
			slog.Error("Failed to render dashboard layout", "error", err)
		}
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

	component := components.SucessModal("Registration Successful", components.User{
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
	user, ok := r.Context().Value(userContextKey).(User)
	if !ok {
		writeError(w, http.StatusUnauthorized, "user not authenticated")
	}

	userInfo, err := s.queries.GetUserDetails(r.Context(), user.UserID)
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
func (s *Server) userProfile(w http.ResponseWriter, r *http.Request) {
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

// Dashboard is the index handler for the dashboard.
func (s *Server) Dashboard(w http.ResponseWriter, r *http.Request) {
	user, ok := r.Context().Value(userContextKey).(User)
	if !ok {
		writeError(w, http.StatusUnauthorized, "unauthorized")
	}

	userRole := dashboard.DashboardUserRole{
		Role: user.Role,
	}
	contents := dashboard.DashboardCards(userRole)
	s.renderComponent(w, r, contents)
}

// ListUsers handler retrieves all users from the database.
func (s *Server) ListUsers(w http.ResponseWriter, r *http.Request) {
	userList, err := s.queries.ListUsers(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Internal Server Error")
		return
	}
	contents := dashboard.UsersList(userList)
	s.renderComponent(w, r, contents)
}

// ShowEditUserForm fetches the user by id and renders the edit modal.
func (s *Server) ShowEditUserForm(w http.ResponseWriter, r *http.Request) {
	userID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "invalid user id")
	}

	user, err := s.queries.GetUserDetails(r.Context(), userID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "user not found")
		return
	}

	s.renderComponent(w, r, dashboard.EditUserModal(user))
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

	if r.Header.Get("HX-Request") != "" {
		w.Header().Set("HX-Redirect", "/dashboard/userlist")
		w.WriteHeader(http.StatusOK)
		return
	}

	http.Redirect(w, r, "/dashboard/userlist", http.StatusFound)
}

// ShowDeleteConfirmation renders the delete confirmation modal, passing the user id.
func (s *Server) ShowDeleteConfirmation(w http.ResponseWriter, r *http.Request) {
	userID := r.PathValue("id")
	s.renderComponent(w, r, dashboard.DeleteConfirmationModal(userID))
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

	if r.Header.Get("HX-Request") != "" {
		w.Header().Set("HX-Redirect", "/dashboard/userlist")
		w.WriteHeader(http.StatusOK)
		return
	}

	http.Redirect(w, r, "/dashboard/userlist", http.StatusFound)
}
