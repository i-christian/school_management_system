package server

import (
	"log/slog"
	"net/http"

	"school_management_system/internal/cookies"
	"school_management_system/internal/database"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"golang.org/x/crypto/bcrypt"
)

// login handler to authenticate user and create session
func (s *Server) LoginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}

	if err := r.ParseForm(); err != nil {
		writeError(w, http.StatusBadRequest, "bad request")
		return
	}

	phoneNumber := r.FormValue("phone_number")
	password := r.FormValue("password")

	credentials := pgtype.Text{String: phoneNumber, Valid: true}

	user, err := s.queries.GetUserByPhone(r.Context(), credentials)
	if err != nil {
		writeError(w, http.StatusUnauthorized, "invalid credentials")
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		writeError(w, http.StatusUnauthorized, "invalid credentials")
		return
	}

	sessionID := uuid.New()
	sessionParams := database.CreateSessionParams{
		SessionID: sessionID,
		UserID:    user.UserID,
	}

	err = s.queries.CreateSession(r.Context(), sessionParams)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("Failed to create session", "message:", err.Error())
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
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}

	// If the request is from HTMX, send an HX-Redirect header.
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

func (s *Server) LogoutCancelHandler(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "/dashboard", http.StatusFound)
}
