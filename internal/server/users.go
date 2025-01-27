package server

import (
	"errors"
	"log/slog"
	"net/http"

	"school_management_system/cmd/web"
	"school_management_system/internal/cookies"
	"school_management_system/internal/database"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

// userDetails handler function retrieves a users detailed information
func (s *Server) userDetails(w http.ResponseWriter, r *http.Request) {
	sessionID, err := cookies.ReadEncrypted(r, "sessionid", s.SecretKey)
	if err != nil {
		if errors.Is(err, http.ErrNoCookie) || errors.Is(err, cookies.ErrInvalidValue) {
			writeError(w, http.StatusUnauthorized, "User not authenticated")
			return
		}
		writeError(w, http.StatusInternalServerError, "server error")
		return
	}

	parsedSessionID, err := uuid.Parse(sessionID)
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid session ID")
		return
	}

	user, err := s.queries.GetSession(r.Context(), parsedSessionID)

	userInfo, err := s.queries.GetUserDetails(r.Context(), user.UserID)

	w.Header().Set("Content-Type", "text/html")

	component := web.UserRole(web.User{
		FirstName:   userInfo.FirstName,
		LastName:    userInfo.LastName,
		Gender:      userInfo.Gender,
		Email:       userInfo.Email.String,
		PhoneNumber: userInfo.PhoneNumber.String,
		Password:    userInfo.Password,
		Role:        userInfo.Role,
	})

	err = component.Render(r.Context(), w)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		slog.Error("Failed to render")
	}
}

// ListUsers handler retrieves all users from the database
// This handler can only be accessed by someone with admin priviledges
func (s *Server) ListUsers(w http.ResponseWriter, r *http.Request) {
	_, err := s.queries.ListUsers(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Internal Server Error")
		return
	}
}

// EditUser handler
// Update user information
// expects form data with user information from
func (s *Server) EditUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}
	userID, ok := r.Context().Value(userIDKey).(uuid.UUID)
	if !ok {
		writeError(w, http.StatusUnauthorized, "User not authorised")
		return
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

	err := s.queries.EditUser(r.Context(), updateInfo)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Internal Server Error")
	}
}
