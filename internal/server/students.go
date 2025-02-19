package server

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"strings"
	"time"

	"school_management_system/cmd/web/dashboard/students"
	"school_management_system/internal/database"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

// ShowCreateStudent renders the create student form
func (s *Server) ShowCreateStudent(w http.ResponseWriter, r *http.Request) {
	academicYear, err := s.queries.GetCurrentAcademicYearAndTerm(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("internal server error", "message:", err.Error())
		return
	}

	classes, err := s.queries.ListClasses(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("internal server error", "message", err.Error())
		return
	}

	component := students.CreateStudentForm(academicYear, classes)
	s.renderComponent(w, r, component)
}

// insertStudent helper function
func insertStudent(ctx context.Context, qtx *database.Queries, academicYearID, firstName, lastName, middleName, gender, dateOfBirth string) (uuid.UUID, error) {
	academicYear, err := convertStringToUUID(academicYearID)
	if err != nil {
		return uuid.Nil, err
	}

	caser := cases.Title(language.English)
	var middleNameValue pgtype.Text
	if middleName != "" {
		middleNameValue = pgtype.Text{String: caser.String(middleName), Valid: true}
	} else {
		middleNameValue = pgtype.Text{Valid: false}
	}

	parsedDate, err := time.Parse("2006-01-02", dateOfBirth)
	if err != nil {
		return uuid.Nil, err
	}

	var birthDay pgtype.Date
	if dateOfBirth != "" {
		birthDay = pgtype.Date{Time: parsedDate, Valid: true}
	} else {
		birthDay = pgtype.Date{Valid: false}
	}

	params := database.InsertStudentParams{
		AcademicYearID: academicYear,
		LastName:       caser.String(lastName),
		FirstName:      caser.String(firstName),
		MiddleName:     middleNameValue,
		Gender:         gender,
		DateOfBirth:    birthDay,
	}
	studentID, err := qtx.InsertStudent(ctx, params)
	if err != nil {
		return uuid.Nil, err
	}

	return studentID, nil
}

// insertStudent helper function
func insertGuardian(ctx context.Context, qtx *database.Queries, guardianName, phoneOne, phoneTwo, guardianGender, profession string) (uuid.UUID, error) {
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

	guardian, _ := qtx.GetGuardianByPhone(ctx, pgtype.Text{String: phoneOne, Valid: true})
	if guardian.GuardianID != uuid.Nil {
		return guardian.GuardianID, nil
	}

	params := database.UpsertGuardianParams{
		GuardianName: caser.String(guardianName),
		Profession:   validProfession,
		PhoneNumber1: pgtype.Text{String: phoneOne, Valid: true},
		PhoneNumber2: optionalPhone,
		Gender:       guardianGender,
	}

	guardianID, err := qtx.UpsertGuardian(ctx, params)
	if err != nil {
		return uuid.Nil, err
	}

	return guardianID, nil
}

// createStudentClass function adds a student to a particular
func createStudentClass(ctx context.Context, qtx *database.Queries, classID, academicTermID string, studentID uuid.UUID) error {
	parsedClassID, err := uuid.Parse(classID)
	if err != nil {
		return errors.New("failed to parse class ID")
	}

	parsedTermID, err := uuid.Parse(academicTermID)
	if err != nil {
		return errors.New("failed to parse term ID")
	}

	classParams := database.CreateStudentClassesParams{
		StudentID: studentID,
		ClassID:   parsedClassID,
		TermID:    parsedTermID,
	}

	_, err = qtx.CreateStudentClasses(ctx, classParams)
	if err != nil {
		return err
	}

	return nil
}

// CreateStudent handler method accepts a form of values
// creates a student and guardian.
func (s *Server) CreateStudent(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseForm(); err != nil {
		writeError(w, http.StatusUnprocessableEntity, "failed to parse form")
		return
	}

	yearPlusTerm := r.FormValue("year_term_id")
	classID := r.FormValue("class_id")
	firstName := r.FormValue("first_name")
	lastName := r.FormValue("last_name")
	middleName := r.FormValue("middle_name")
	gender := r.FormValue("gender")
	dateOfBirth := r.FormValue("date_of_birth")
	guardianName := r.FormValue("guardian_name")
	phoneOne := r.FormValue("phone_number_1")
	phoneTwo := r.FormValue("phone_number_2")
	guardianGender := r.FormValue("guardian_gender")
	profession := r.FormValue("profession")

	if yearPlusTerm == "" || classID == "" || firstName == "" || lastName == "" || gender == "" || dateOfBirth == "" || guardianName == "" || phoneOne == "" || guardianGender == "" {
		writeError(w, http.StatusBadRequest, "missing some fields")
		return
	}

	parts := strings.Split(yearPlusTerm, "=")
	if len(parts) != 2 {
		writeError(w, http.StatusBadRequest, "invalid subject and class selection")
		return
	}

	academicYearID := parts[0]
	academicTermID := parts[1]

	// Start of transaction
	tx, err := s.conn.Begin(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}
	defer tx.Rollback(r.Context())
	qtx := s.queries.WithTx(tx)
	studentID, err := insertStudent(r.Context(), qtx, academicYearID, firstName, lastName, middleName, gender, dateOfBirth)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("internal server error", "message", err.Error())
		return
	}
	guardianID, err := insertGuardian(r.Context(), qtx, guardianName, phoneOne, phoneTwo, guardianGender, profession)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("internal server error", "message", err.Error())
		return
	}

	params := database.LinkStudentGuardianParams{
		StudentID:  studentID,
		GuardianID: guardianID,
	}

	err = qtx.LinkStudentGuardian(r.Context(), params)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("internal server error", "message", err.Error())
		return
	}

	err = createStudentClass(r.Context(), qtx, classID, academicTermID, studentID)

	tx.Commit(r.Context())
	// end of transaction

	if r.Header.Get("HX-Request") != "" {
		w.Header().Set("HX-Redirect", "/students")
		w.WriteHeader(http.StatusOK)
		return
	}
	http.Redirect(w, r, "/students", http.StatusFound)
}

// ListStudents handler method lists students available in the system
func (s *Server) ListStudents(w http.ResponseWriter, r *http.Request) {
	studentsList, err := s.queries.ListStudents(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("Failed to retrieve students list", "msg", err.Error())
		return
	}

	component := students.StudentsList(studentsList)
	s.renderComponent(w, r, component)
}

// ShowEditStudent handler method renders the EditStudentModal templ component
func (s *Server) ShowEditStudent(w http.ResponseWriter, r *http.Request) {
	studentID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid student id")
		return
	}

	student, err := s.queries.GetStudent(r.Context(), studentID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}

	classes, err := s.queries.ListClasses(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}
	s.renderComponent(w, r, students.EditStudentModal(student, classes))

	if r.Header.Get("HX-Request") != "" {
		w.Header().Set("HX-Redirect", "/students")
		w.WriteHeader(http.StatusOK)
		return
	}
	http.Redirect(w, r, "/students", http.StatusFound)
}

// EditStudent handler method recieves form data and update student
func (s *Server) EditStudent(w http.ResponseWriter, r *http.Request) {
	_, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid student id")
		return
	}
}
