package server

import (
	"log/slog"
	"net/http"

	"school_management_system/cmd/web/dashboard/grades"
	"school_management_system/internal/database"
)

// ListGrades handles HTTP requests and renders an HTML table displaying student grades.
func (s *Server) ListGrades(w http.ResponseWriter, r *http.Request) {
	classSubjects, err := s.queries.ListAllSubjects(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to fetch classes", ":", err.Error())
		return
	}

	students, err := s.queries.ListGrades(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to fetch grades", "error", err.Error())
		return
	}

	classSubjectMap := make(map[string][]database.ListAllSubjectsRow)
	for _, subj := range classSubjects {
		classSubjectMap[subj.Classname] = append(classSubjectMap[subj.Classname], subj)
	}

	classStudentMap := make(map[string][]database.StudentGradesView)
	for _, student := range students {
		classStudentMap[student.ClassName] = append(classStudentMap[student.ClassName], student)
	}

	var classData []grades.ClassGradesData
	for className, stuList := range classStudentMap {
		classData = append(classData, grades.ClassGradesData{
			ClassName: className,
			Subjects:  classSubjectMap[className],
			Students:  stuList,
		})
	}

	s.renderComponent(w, r, grades.GradesList(classData))
}

// EnterGrades handler method displays a form for entering grades
func (s *Server) EnterGrades(w http.ResponseWriter, r *http.Request) {
	students, err := s.queries.ListStudents(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to retriev students", "message", err.Error())
		return
	}

	subjects, err := s.queries.ListAllSubjects(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to load subjects", "message", err.Error())
		return
	}

	currentTerm, err := s.queries.GetCurrentTerm(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to get current academic year and term", "message", err.Error())
		return
	}

	s.renderComponent(w, r, grades.EnterGradesForm(students, subjects, currentTerm))
}
