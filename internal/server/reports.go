package server

import (
	"fmt"
	"log/slog"
	"net/http"
	"sort"

	"school_management_system/cmd/web/dashboard/reports"
	"school_management_system/internal/database"

	"github.com/go-pdf/fpdf"
	"github.com/google/uuid"
)

// getClassroomData groups students by class and returns structured data.
func getClassroomData(students []database.ListStudentsRow) []reports.ClassRoomData {
	classMap := make(map[string]*reports.ClassRoomData)

	for _, student := range students {
		className := student.Classname.String

		if _, ok := classMap[className]; !ok {
			classID, err := uuid.FromBytes(student.ClassID.Bytes[:])
			if err != nil {
				slog.Error("failed to parse class ID while getting classRoomData", "error", err.Error())
				continue
			}
			classMap[className] = &reports.ClassRoomData{
				ClassID:   classID,
				ClassName: className,
				Students:  []database.ListStudentsRow{},
			}
		}

		classMap[className].Students = append(classMap[className].Students, student)
	}

	classRooms := make([]reports.ClassRoomData, 0, len(classMap))
	for _, classData := range classMap {
		classRooms = append(classRooms, *classData)
	}

	sort.Slice(classRooms, func(i, j int) bool {
		return classRooms[i].ClassName < classRooms[j].ClassName
	})

	return classRooms
}

// ShowClassReports renders a report for a specific class.
func (s *Server) ShowClassReports(w http.ResponseWriter, r *http.Request) {
	classID, err := uuid.Parse(r.PathValue("classID"))
	if err != nil {
		http.Error(w, "Invalid class ID", http.StatusBadRequest)
		return
	}

	students, err := s.queries.ListStudents(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to retrieve students")
		slog.Error("failed to retrieve students", "error", err.Error())
		return
	}

	classRooms := getClassroomData(students)

	for _, classData := range classRooms {
		if classData.ClassID == classID {
			classReports, err := s.queries.ListStudentReportCards(r.Context(), classData.ClassID)
			if err != nil {
				writeError(w, http.StatusNotFound, "grades for this class not found")
			}
			s.renderComponent(w, r, reports.ClassReportTable(classData, classReports))
			return
		}
	}

	writeError(w, http.StatusNotFound, "class not found or has no students")
}

// ShowStudentsReports renders all students grouped by class.
func (s *Server) ShowStudentsReports(w http.ResponseWriter, r *http.Request) {
	students, err := s.queries.ListStudents(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to retrieve students")
		slog.Error("failed to retrieve students", "error", err.Error())
		return
	}

	classRooms := getClassroomData(students)
	s.renderComponent(w, r, reports.ReportsList(classRooms))
}

// createStudentReportPdf helper function creates a pdf file with student results, and teachers remarks
func createStudentReportPdf(term CachedTerm, student database.GetStudentReportCardRow, studentSubjects []database.ListSubjectsRow) (string, *fpdf.Fpdf) {
	pdf := fpdf.New(fpdf.OrientationPortrait, "mm", "A4", "")

	pdf.AddPage()
	pdf.SetFont("Arial", "B", 18)
	pdf.CellFormat(190, 10, "Student Report Card", "", 0, "C", false, 0, "")
	pdf.Ln(15)

	// Student details
	pdf.SetFont("Arial", "", 14)
	pdf.Cell(190, 10, fmt.Sprintf("Student No: %s", student.StudentNo))
	pdf.Ln(8)
	pdf.Cell(190, 10, fmt.Sprintf("Name: %s %s %s", student.FirstName, student.MiddleName.String, student.LastName))
	pdf.Ln(8)
	pdf.Cell(190, 10, fmt.Sprintf("Class: %s (%s)", student.ClassName, term.AcademicTerm))
	pdf.Ln(12)

	// Table Headers
	pdf.SetFont("Arial", "B", 12)
	pdf.SetFillColor(200, 200, 200)
	pdf.CellFormat(60, 10, "Subject", "1", 0, "C", true, 0, "")
	pdf.CellFormat(40, 10, "Grade", "1", 0, "C", true, 0, "")
	pdf.CellFormat(60, 10, "Remarks", "1", 0, "C", true, 0, "")
	pdf.Ln(-1)

	// Table Content
	pdf.SetFont("Arial", "", 12)
	for subject, grade := range student.Grades {
		for _, studentSubj := range studentSubjects {
			if studentSubj.SubjectID == subject {
				pdf.CellFormat(60, 10, studentSubj.Subjectname, "1", 0, "L", false, 0, "")
				pdf.CellFormat(40, 10, fmt.Sprintf("%.2f", grade.Score), "1", 0, "R", false, 0, "")
				pdf.CellFormat(60, 10, fmt.Sprintf("%s", grade.Remark), "1", 0, "C", false, 0, "")
				pdf.Ln(-1)
			}
		}
	}

	// Add remarks section
	pdf.Ln(10)
	pdf.SetFont("Arial", "B", 12)
	pdf.Cell(190, 10, "Class Teacher's Remarks:")
	pdf.Ln(8)
	pdf.SetFont("Arial", "", 12)
	pdf.MultiCell(190, 8, student.ClassTeacherRemark.String, "", "L", false)
	pdf.Ln(6)

	pdf.SetFont("Arial", "B", 12)
	pdf.Cell(190, 10, "Head Teacher's Remarks:")
	pdf.Ln(8)
	pdf.SetFont("Arial", "", 12)
	pdf.MultiCell(190, 8, student.HeadTeacherRemark.String, "", "L", false)

	// Footer with space for signature
	pdf.Ln(15)
	pdf.SetFont("Arial", "B", 12)
	pdf.Cell(80, 10, "Class Teacher Signature: ______________")
	pdf.Ln(10)
	pdf.Cell(80, 10, "Head Teacher Signature: ______________")

	fileName := student.StudentNo

	return fileName, pdf
}

// GenerateStudentReportCard generates a PDF report card for a student
func (s *Server) GenerateStudentReportCard(w http.ResponseWriter, r *http.Request) {
	studentID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "Invalid student ID")
		return
	}

	// Fetch student report data
	student, err := s.queries.GetStudentReportCard(r.Context(), studentID)
	if err != nil {
		writeError(w, http.StatusNotFound, "Student not found")
		slog.Error("Student not found", "error", err.Error())
		return
	}

	studentSubjects, err := s.queries.ListSubjects(r.Context(), student.ClassID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Failed to retrieve student's subjects")
		slog.Error("Failed to get student's subjects", "error", err.Error())
		return
	}

	term, err := s.getCachedTerm()
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("Failed to retrive current academic term", "error", err.Error())
		return
	}

	fileName, reportCard := createStudentReportPdf(term, student, studentSubjects)

	// Serve PDF as response
	w.Header().Set("Content-Type", "application/pdf")
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=%s.pdf", fileName))
	err = reportCard.Output(w)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Failed to generate PDF")
		slog.Error("PDF Generation Error:", "error", err.Error())
	}
}
