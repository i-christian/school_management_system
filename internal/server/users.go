package server

import (
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"strings"

	"school_management_system/cmd/web/components"
	"school_management_system/cmd/web/dashboard/userlist"
	"school_management_system/internal/database"

	"github.com/go-pdf/fpdf"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

// showCreateUserPage renders the create user page
func (s *Server) showCreateUserPage(w http.ResponseWriter, r *http.Request) {
	s.renderComponent(w, r, userlist.CreateUserForm())
}

// hashPassword accepts a string and returns a hashed password
func hashPassword(password string) ([]byte, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	return hashedPassword, nil
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

	hashedPassword, err := hashPassword(password)
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
func (s *Server) getUserDetails(r *http.Request) (components.User, error) {
	user, ok := r.Context().Value(userContextKey).(User)
	if !ok {
		return components.User{}, errors.New("unauthorized")
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

// userProfile handler method returns user current logged in user details
func (s *Server) userProfile(w http.ResponseWriter, r *http.Request) {
	user, err := s.getUserDetails(r)
	if err != nil {
		var status int
		var errorMessage string
		if strings.Contains(err.Error(), "unauthorized") {
			status = http.StatusUnauthorized
			errorMessage = "user not authorised"
		} else {
			status = http.StatusInternalServerError
			errorMessage = "internal server error"
		}
		writeError(w, status, errorMessage)
		return
	}

	w.Header().Set("Content-Type", "text/html")
	component := components.UserDetails(user)
	s.renderComponent(w, r, component)
}

// ListUsers handler retrieves all users from the database.
func (s *Server) ListUsers(w http.ResponseWriter, r *http.Request) {
	userList, err := s.queries.ListUsers(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Internal Server Error")
		return
	}
	contents := userlist.UsersList(userList)
	s.renderComponent(w, r, contents)
}

// ShowEditUserForm fetches the user by id and renders the edit modal.
func (s *Server) ShowEditUserForm(w http.ResponseWriter, r *http.Request) {
	userID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "invalid user id")
		return
	}

	user, err := s.queries.GetUserDetails(r.Context(), userID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("User not found", "message:", err.Error())
		return
	}

	s.renderComponent(w, r, userlist.EditUserModal(user))
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
	role := r.FormValue("role")

	var emailValue pgtype.Text
	if email != "" {
		emailValue = pgtype.Text{String: email, Valid: true}
	} else {
		emailValue = pgtype.Text{Valid: false}
	}

	tx, err := s.conn.Begin(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}

	defer tx.Rollback(r.Context())
	qtx := s.queries.WithTx(tx)

	updateInfo := database.EditUserParams{
		UserID:      userID,
		FirstName:   firstName,
		LastName:    lastName,
		Gender:      gender,
		PhoneNumber: pgtype.Text{String: phoneNumber, Valid: true},
		Email:       emailValue,
		Name:        role,
	}

	editedUserID, err := qtx.EditUser(r.Context(), updateInfo)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	} else {
		err = qtx.RemoveClassTeacher(r.Context(), editedUserID)
		if err != nil {
			slog.Warn("failed to remove classteacher assignment", "error", err.Error())
		}
	}

	if len(strings.TrimSpace(password)) > 0 {
		hashedPassword, err := hashPassword(password)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "internal server error")
			return
		}

		changePasswdParams := database.EditPasswordParams{
			UserID:   userID,
			Password: string(hashedPassword),
		}

		err = qtx.EditPassword(r.Context(), changePasswdParams)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "internal server error")
			slog.Error("failed to change password", ":", err.Error())
			return
		}
	}

	tx.Commit(r.Context())

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
	s.renderComponent(w, r, userlist.DeleteConfirmationModal(userID))
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

// createUsersPdf helper function creates a pdf file a list of all available users
func createUsersPdf(users []database.ListUsersRow) (string, *fpdf.Fpdf) {
	pdf := fpdf.New(fpdf.OrientationPortrait, "mm", "A4", "")
	userList := os.Getenv("PROJECT_NAME")

	pdf.SetFooterFunc(func() {
		pdf.SetY(-15)
		pdf.SetFont("Arial", "I", 8)
		pdf.CellFormat(0, 10, fmt.Sprintf("Page %d/{nb}", pdf.PageNo()), "", 0, "C", false, 0, "")
	})
	pdf.AliasNbPages("")
	pdf.AddPage()

	pdf.SetMargins(10, 10, 10)
	pdf.SetFont("Arial", "B", 18)
	pdf.CellFormat(190, 10, fmt.Sprintf("%s User List", userList), "", 0, "C", false, 0, "")
	pdf.Ln(15)

	// Table Headers
	pdf.SetFont("Arial", "B", 12)
	pdf.SetFillColor(200, 200, 200)

	headerWidths := map[string]float64{
		"No.":   40,
		"Name":  60,
		"G":     10,
		"Phone": 40,
		"Role":  40,
	}

	headers := []string{"No.", "Name", "G", "Phone", "Role"}

	for _, header := range headers {
		pdf.CellFormat(headerWidths[header], 10, header, "1", 0, "C", true, 0, "")
	}
	pdf.Ln(-1)

	// Table Content
	pdf.SetFont("Arial", "", 12)
	for _, user := range users {
		pdf.CellFormat(headerWidths["No."], 10, user.UserNo, "1", 0, "L", false, 0, "")
		pdf.CellFormat(headerWidths["Name"], 10, fmt.Sprintf("%s %s", user.LastName, user.FirstName), "1", 0, "L", false, 0, "")
		pdf.CellFormat(headerWidths["G"], 10, user.Gender, "1", 0, "C", false, 0, "")
		pdf.CellFormat(headerWidths["Phone"], 10, user.PhoneNumber.String, "1", 0, "L", false, 0, "")
		pdf.CellFormat(headerWidths["Role"], 10, user.Role, "1", 0, "L", false, 0, "")
		pdf.Ln(-1)
	}

	fileName := "user_list"

	return fileName, pdf
}

// userDownload method is used to download available students into a pdf format
func (s *Server) userDownload(w http.ResponseWriter, r *http.Request) {
	users, err := s.queries.ListUsers(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get users")
		slog.Error("internal server error, failed to get user list", "error", err.Error())
		return
	}

	fileName, usersPDF := createUsersPdf(users)

	// Serve PDF as response
	w.Header().Set("Content-Type", "application/pdf")
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=%s.pdf", fileName))
	err = usersPDF.Output(w)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Failed to generate PDF")
		slog.Error("PDF Generation Error:", "error", err.Error())
	}
}
