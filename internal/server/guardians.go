package server

import (
	"log/slog"
	"net/http"

	"school_management_system/cmd/web/dashboard/students"
	"school_management_system/internal/database"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

// ListGuardians handler method list all student linked guardian.
// It renders the GuardiansList templ component
func (s *Server) ListGuardians(w http.ResponseWriter, r *http.Request) {
	guardians, err := s.queries.GetAllStudentGuardianLinks(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to retrieve guardians list", ":", err.Error())
		return
	}

	s.renderComponent(w, r, students.GuardiansList(guardians))
}

// SearchGuardian handler method recievies a form value to be searched and retrieves results from the database
// matching the search pattern
func (s *Server) SearchGuardian(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseForm(); err != nil {
		writeError(w, http.StatusUnprocessableEntity, "failed to parse form")
		return
	}

	search := r.FormValue("search")
	parsedSearch := "%" + search + "%"

	searchedStudents, err := s.queries.SearchStudentGuardian(r.Context(), parsedSearch)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to retrieve students", ":", err.Error())
		return
	}

	s.renderComponent(w, r, students.GuardianSearch(searchedStudents))
}

// ShowEditGuardian modal is used to render guardian information to be edited
func (s *Server) ShowEditGuardian(w http.ResponseWriter, r *http.Request) {
	guardianID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "wrong params")
		return
	}

	guardian, err := s.queries.GetGuardianByID(r.Context(), guardianID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to get guardian", ":", err.Error())
		return
	}

	s.renderComponent(w, r, students.EditGuardianForm(guardian))
}

// EditGuardian handler method recieves form data
// Then validates that data and uses it to call the updateGuardian query to edit a guardian using their ID
func (s *Server) EditGuardian(w http.ResponseWriter, r *http.Request) {
	guardianID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "wrong parameters")
		return
	}

	guardianName := r.FormValue("guardian_name")
	phoneOne := r.FormValue("phone_number_1")
	phoneTwo := r.FormValue("phone_number_2")
	guardianGender := r.FormValue("guardian_gender")
	profession := r.FormValue("profession")

	if guardianName == "" || phoneOne == "" || guardianGender == "" {
		writeError(w, http.StatusBadRequest, "missing some fields")
		return
	}

	caser := cases.Title(language.English)
	var optionalPhone pgtype.Text
	if phoneTwo != "" {
		optionalPhone = pgtype.Text{String: caser.String(phoneTwo), Valid: true}
	} else {
		optionalPhone = pgtype.Text{Valid: false}
	}

	var validProfession pgtype.Text
	if profession != "" {
		validProfession = pgtype.Text{String: caser.String(profession), Valid: true}
	} else {
		validProfession = pgtype.Text{Valid: false}
	}

	params := database.UpdateGuardianParams{
		GuardianID:   guardianID,
		GuardianName: caser.String(guardianName),
		PhoneNumber1: pgtype.Text{String: phoneOne, Valid: true},
		PhoneNumber2: optionalPhone,
		Gender:       guardianGender,
		Profession:   validProfession,
	}

	err = s.queries.UpdateGuardian(r.Context(), params)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to update guardian", ":", err.Error())
		return
	}

	if r.Header.Get("HX-Request") != "" {
		w.Header().Set("HX-Redirect", "/students/guardians")
		w.WriteHeader(http.StatusOK)
		return
	}
	http.Redirect(w, r, "/students/guardians", http.StatusFound)
}
