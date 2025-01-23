package server

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"time"

	"school_management_system/cmd/web"
	"school_management_system/internal/database"
	"school_management_system/internal/server/cookies"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"golang.org/x/crypto/bcrypt"
)

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
		fmt.Println(err)
		return
	}

	w.Header().Set("Content-Type", "text/html")

	component := web.SucessModal(web.User{
		FirstName: firstName,
		LastName:  lastName,
		Role:      name,
	})
	err = component.Render(r.Context(), w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		slog.Error("Error rendering in HelloWebHandler\n", "Error Message", err.Error())
	}
}

// login handler to authenticate user and create session
func (s *Server) LoginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if err := r.ParseForm(); err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	phoneNumber := r.FormValue("phone_number")
	password := r.FormValue("password")

	credentials := pgtype.Text{String: phoneNumber, Valid: true}

	user, err := s.queries.GetUserByPhone(r.Context(), credentials)
	if err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	sessionID := uuid.New()
	sessionParams := database.CreateSessionParams{
		SessionID: sessionID,
		UserID:    user.UserID,
	}

	_, err = s.queries.CreateSession(r.Context(), sessionParams)
	if err != nil {
		http.Error(w, "Failed to create session", http.StatusInternalServerError)
		return
	}

	cookie := http.Cookie{
		Name:     "sessionid",
		Value:    sessionID.String(),
		Path:     "/",
		MaxAge:   3600 * 24 * 7 * 2, // 2 weeks
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
	}

	if err := cookies.WriteEncrypted(w, cookie, s.SecretKey); err != nil {
		http.Error(w, "server error", http.StatusInternalServerError)
		return
	}

	http.Redirect(w, r, "/dashboard", http.StatusFound)
}

// AuthMiddleware ensures the user is authenticated for private routes
func (s *Server) AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		sessionID, err := cookies.ReadEncrypted(r, "sessionid", s.SecretKey)
		if err != nil {
			if errors.Is(err, http.ErrNoCookie) || errors.Is(err, cookies.ErrInvalidValue) {
				http.Redirect(w, r, "/login", http.StatusFound)
				return
			}
			http.Error(w, "server error", http.StatusInternalServerError)
			return
		}

		parsedSessionID, err := uuid.Parse(sessionID)
		if err != nil {
			http.Error(w, "invalid session ID", http.StatusBadRequest)
			return
		}

		session, err := s.queries.GetSession(r.Context(), parsedSessionID)
		fmt.Println("Fetched session:", session, "Error:", err)
		if err != nil {
			http.Redirect(w, r, "/login", http.StatusFound)
			return
		}

		if session.Expires.Valid && session.Expires.Time.Before(time.Now()) {
			http.Redirect(w, r, "/login", http.StatusFound)
			return
		}

		timeLeft := time.Until(session.Expires.Time)
		if timeLeft < 24*time.Hour {
			newExpiry := pgtype.Timestamptz{Time: time.Now().Add(2 * 7 * 24 * time.Hour), Valid: true}
			newSessionID := uuid.New()

			refreshParams := database.RefreshSessionParams{
				UserID:    parsedSessionID,
				Expires:   newExpiry,
				SessionID: newSessionID,
			}

			if err := s.queries.RefreshSession(r.Context(), refreshParams); err != nil {
				http.Error(w, "server error", http.StatusInternalServerError)
				return
			}

			cookie := http.Cookie{
				Name:     "sessionid",
				Value:    newSessionID.String(),
				Path:     "/",
				MaxAge:   3600 * 24 * 7 * 2, // 2 weeks
				HttpOnly: true,
				Secure:   true,
				SameSite: http.SameSiteStrictMode,
			}

			if err := cookies.WriteEncrypted(w, cookie, s.SecretKey); err != nil {
				http.Error(w, "server error", http.StatusInternalServerError)
				return
			}
		}

		r = r.WithContext(context.WithValue(r.Context(), "session_id", session.SessionID))

		next.ServeHTTP(w, r)
	})
}

// Admin middleware to restrict access to admin-only routes
func (s *Server) AdminMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		sessionID, err := cookies.ReadEncrypted(r, "sessionid", s.SecretKey)
		if err != nil {
			http.Redirect(w, r, "/login", http.StatusFound)
			return
		}

		parsedSessionID, err := uuid.Parse(sessionID)
		if err != nil {
			http.Error(w, "invalid session ID", http.StatusBadRequest)
			return
		}

		role, err := s.queries.GetUserRole(r.Context(), parsedSessionID)
		if err != nil {
			http.Redirect(w, r, "/login", http.StatusFound)
			return
		}

		if role.Role != "admin" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// LogoutHandler to log users out
func (s *Server) LogoutHandler(w http.ResponseWriter, r *http.Request) {
	sessionID, err := cookies.ReadEncrypted(r, "sessionid", s.SecretKey)
	if err != nil {
		http.Error(w, "invalid session", http.StatusBadRequest)
		return
	}

	parsedSessionID, err := uuid.Parse(sessionID)
	if err != nil {
		http.Error(w, "invalid session ID", http.StatusBadRequest)
		return
	}

	if err := s.queries.DeleteSession(r.Context(), parsedSessionID); err != nil {
		http.Error(w, "server error", http.StatusInternalServerError)
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
