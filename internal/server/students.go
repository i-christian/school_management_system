package server

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"strings"
	"time"

	"school_management_system/cmd/web/dashboard/students"
	"school_management_system/internal/database"

	"github.com/go-pdf/fpdf"
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
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to create student class", "message", err.Error())
		return
	}

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
}

// EditStudent handler method recieves form data and update student
func (s *Server) EditStudent(w http.ResponseWriter, r *http.Request) {
	studentID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid student id")
		return
	}

	classID := r.FormValue("class_id")
	firstName := r.FormValue("first_name")
	lastName := r.FormValue("last_name")
	middleName := r.FormValue("middle_name")
	gender := r.FormValue("gender")
	dateOfBirth := r.FormValue("date_of_birth")

	if classID == "" || firstName == "" || lastName == "" || gender == "" || dateOfBirth == "" {
		writeError(w, http.StatusBadRequest, "missing some fields")
		return
	}

	parsedClassID, err := uuid.Parse(classID)
	if err != nil {
		writeError(w, http.StatusBadRequest, "wrong form values")
		slog.Error("failed to parsed classID", "message", err.Error())
		return
	}

	caser := cases.Title(language.English)
	var middleNameValue pgtype.Text
	if middleName != "" {
		middleNameValue = pgtype.Text{String: caser.String(middleName), Valid: true}
	} else {
		middleNameValue = pgtype.Text{Valid: false}
	}

	// Start transaction
	tx, err := s.conn.Begin(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}

	defer tx.Rollback(r.Context())
	qtx := s.queries.WithTx(tx)
	params := database.EditStudentParams{
		StudentID:  studentID,
		LastName:   caser.String(lastName),
		FirstName:  caser.String(firstName),
		MiddleName: middleNameValue,
		Gender:     gender,
	}
	err = qtx.EditStudent(r.Context(), params)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to update student", "message", err.Error())
		return
	}

	classParams := database.EditStudentClassesParams{
		StudentID: studentID,
		ClassID:   parsedClassID,
	}
	err = qtx.EditStudentClasses(r.Context(), classParams)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to change student class", "message", err.Error())
		return
	}

	tx.Commit(r.Context())
	// end transaction

	if r.Header.Get("HX-Request") != "" {
		w.Header().Set("HX-Redirect", "/students")
		w.WriteHeader(http.StatusOK)
		return
	}
	http.Redirect(w, r, "/students", http.StatusFound)
}

// ShowDeleteStudent handler parse the `DeleteStudentModal`
func (s *Server) ShowDeleteStudent(w http.ResponseWriter, r *http.Request) {
	studentID := r.PathValue("id")
	s.renderComponent(w, r, students.DeleteStudentModal(studentID))
}

// DeleteStudent handler method removes a student from the database
func (s *Server) DeleteStudent(w http.ResponseWriter, r *http.Request) {
	studentID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "wrong student id")
		return
	}

	tx, err := s.conn.Begin(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}

	defer tx.Rollback(r.Context())
	qtx := s.queries.WithTx(tx)
	guardian, err := qtx.GetStudentGuardianCount(r.Context(), studentID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to get guardian,", "message", err.Error())
		return
	}

	err = qtx.DeleteStudent(r.Context(), studentID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to delete student", "message", err.Error())
		return
	}

	if guardian.Count <= 1 {
		err = qtx.DeleteGuardian(r.Context(), guardian.GuardianID)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "internal server error")
			slog.Error("failed to delete guardian", ":", err.Error())
			return
		}
	}

	tx.Commit(r.Context())

	if r.Header.Get("HX-Request") != "" {
		w.Header().Set("HX-Redirect", "/students")
		w.WriteHeader(http.StatusOK)
		return
	}
	http.Redirect(w, r, "/students", http.StatusFound)
}

// createStudentsPdf helper function creates a pdf file a list of all available students
func createStudentsPdf(students []database.ListStudentsRow) (string, *fpdf.Fpdf) {
	pdf := fpdf.New(fpdf.OrientationPortrait, "mm", "A4", "")
	studentList := os.Getenv("PROJECT_NAME")

	pdf.SetFooterFunc(func() {
		pdf.SetY(-15)
		pdf.SetFont("Arial", "I", 8)
		pdf.CellFormat(0, 10, fmt.Sprintf("Page %d/{nb}", pdf.PageNo()), "", 0, "C", false, 0, "")
	})
	pdf.AliasNbPages("")
	pdf.AddPage()

	pdf.SetMargins(10, 10, 10)
	pdf.SetFont("Arial", "B", 18)
	pdf.CellFormat(190, 10, fmt.Sprintf("%s Students List", studentList), "", 0, "C", false, 0, "")
	pdf.Ln(15)

	// Table Headers
	pdf.SetFont("Arial", "B", 12)
	pdf.SetFillColor(200, 200, 200)

	headerWidths := map[string]float64{
		"No.":         40,
		"Last Name":   35,
		"First Name":  35,
		"Middle Name": 35,
		"G":           10,
		"Class":       35,
	}

	headers := []string{"No.", "Last Name", "First Name", "Middle Name", "G", "Class"}

	for _, header := range headers {
		pdf.CellFormat(headerWidths[header], 10, header, "1", 0, "C", true, 0, "")
	}
	pdf.Ln(-1)

	// Table Content
	pdf.SetFont("Arial", "", 12)
	for _, student := range students {
		pdf.CellFormat(headerWidths["No."], 10, student.StudentNo, "1", 0, "L", false, 0, "")
		pdf.CellFormat(headerWidths["Last Name"], 10, student.LastName, "1", 0, "L", false, 0, "")
		pdf.CellFormat(headerWidths["First Name"], 10, student.FirstName, "1", 0, "L", false, 0, "")
		pdf.CellFormat(headerWidths["Middle Name"], 10, student.MiddleName.String, "1", 0, "L", false, 0, "")
		pdf.CellFormat(headerWidths["G"], 10, student.Gender, "1", 0, "C", false, 0, "")
		pdf.CellFormat(headerWidths["Class"], 10, student.Classname.String, "1", 0, "L", false, 0, "")
		pdf.Ln(-1)
	}

	fileName := "students_list"

	return fileName, pdf
}

// studentsDownload method is used to download available students into a pdf format
func (s *Server) studentsDownload(w http.ResponseWriter, r *http.Request) {
	students, err := s.queries.ListStudents(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get students")
		slog.Error("internal server error, failed to get students list", "error", err.Error())
		return
	}

	fileName, studentsPDF := createStudentsPdf(students)

	// Serve PDF as response
	w.Header().Set("Content-Type", "application/pdf")
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=%s.pdf", fileName))
	err = studentsPDF.Output(w)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Failed to generate PDF")
		slog.Error("PDF Generation Error:", "error", err.Error())
	}
}
