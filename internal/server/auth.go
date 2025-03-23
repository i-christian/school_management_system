package server

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"regexp"

	"school_management_system/cmd/web"
	"school_management_system/internal/cookies"
	"school_management_system/internal/database"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"golang.org/x/crypto/bcrypt"
)

type LoginUser struct {
	Password string
	UserID   uuid.UUID
}

// getUserByIdentifier returns the LoginUser corresponding to the provided identifier.
// It checks whether the identifier is a 12-digit phone number or a username formatted as "USR-yyyy-xxxxx".
func (s *Server) getUserByIdentifier(ctx context.Context, identifier string) (LoginUser, error) {
	phonePattern := regexp.MustCompile(`^[0-9]{12}$`)
	usernamePattern := regexp.MustCompile(`^USR-\d{4}-\d{5}$`)

	var loginUser LoginUser

	switch {
	case phonePattern.MatchString(identifier):
		credentials := pgtype.Text{String: identifier, Valid: true}
		returnedUser, err := s.queries.GetUserByPhone(ctx, credentials)
		if err != nil {
			return loginUser, err
		}
		loginUser = LoginUser{
			Password: returnedUser.Password,
			UserID:   returnedUser.UserID,
		}
	case usernamePattern.MatchString(identifier):
		returnedUser, err := s.queries.GetUserByUsername(ctx, identifier)
		if err != nil {
			return loginUser, err
		}
		loginUser = LoginUser{
			Password: returnedUser.Password,
			UserID:   returnedUser.UserID,
		}
	default:
		return loginUser, errors.New("invalid identifier")
	}

	return loginUser, nil
}

// LoginHandler authenticates the user and creates a session.
func (s *Server) LoginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}

	if err := r.ParseForm(); err != nil {
		writeError(w, http.StatusBadRequest, "bad request")
		return
	}

	identifier := r.FormValue("identifier")
	password := r.FormValue("password")

	user, err := s.getUserByIdentifier(r.Context(), identifier)
	if err != nil {
		slog.Error("login request denied", "message:", err.Error())
		writeError(w, http.StatusUnauthorized, "invalid credentials")
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		writeError(w, http.StatusUnauthorized, "invalid credentials")
		return
	}

	// Create a new session.
	sessionID := uuid.New()
	sessionParams := database.CreateSessionParams{
		SessionID: sessionID,
		UserID:    user.UserID,
	}

	if err := s.queries.CreateSession(r.Context(), sessionParams); err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("Failed to create session", "message", err.Error())
		return
	}

	// Determine the 'Secure' flag based on the environment.
	secureFlag := os.Getenv("ENV") == "production"
	cookie := http.Cookie{
		Name:     "sessionid",
		Value:    sessionID.String(),
		Path:     "/",
		MaxAge:   3600 * 24 * 7 * 2, // 2 weeks
		HttpOnly: true,
		Secure:   secureFlag,
		SameSite: http.SameSiteStrictMode,
	}

	if err := cookies.WriteEncrypted(w, cookie, s.SecretKey); err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}

	if r.Header.Get("HX-Request") != "" {
		w.Header().Set("HX-Redirect", "/dashboard")
		w.WriteHeader(http.StatusOK)
		return
	}

	http.Redirect(w, r, "/dashboard", http.StatusFound)
}

// LogoutHandler to log users out
func (s *Server) LogoutHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}

	user, ok := r.Context().Value(userContextKey).(User)
	if !ok {
		writeError(w, http.StatusUnauthorized, "User not authenticated")
	}

	if err := s.queries.DeleteSession(r.Context(), user.UserID); err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "sessionid",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
	})

	http.Redirect(w, r, "/", http.StatusFound)
}

func (s *Server) LogoutConfirmHandler(w http.ResponseWriter, r *http.Request) {
	s.renderComponent(w, r, web.LogoutConfirmHandler())
}

func (s *Server) LogoutCancelHandler(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "/dashboard", http.StatusFound)
}
