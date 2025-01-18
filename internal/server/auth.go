package server

import (
	"errors"
	"fmt"
	"log/slog"
	"net/http"

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

func (s *Server) SetCookieHandler(w http.ResponseWriter, r *http.Request) {
	// Create a session_id which will also be inserted into the database together with user_id

	session_id := uuid.New()
	cookie := http.Cookie{
		Name:     "sessionid",
		Value:    session_id.String(),
		Path:     "/",
		MaxAge:   3600,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
	}

	err := cookies.WriteEncrypted(w, cookie, s.SecretKey)
	if err != nil {
		slog.Error(err.Error())
		http.Error(w, "server error", http.StatusInternalServerError)
		return
	}

	w.Write([]byte("cookie set!"))
}

func (s *Server) GetCookieHandler(w http.ResponseWriter, r *http.Request) {
	value, err := cookies.ReadEncrypted(r, "sessionid", s.SecretKey)
	if err != nil {
		switch {
		case errors.Is(err, http.ErrNoCookie):
			http.Error(w, "cookie not found", http.StatusBadRequest)
		case errors.Is(err, cookies.ErrInvalidValue):
			http.Error(w, "invalid cookie", http.StatusBadRequest)
		default:
			slog.Error(err.Error())
			http.Error(w, "server error", http.StatusInternalServerError)
		}
		return
	}

	w.Write([]byte(value))
}
