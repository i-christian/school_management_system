package server

import (
	"log/slog"
	"net/http"

	"school_management_system/cmd/web/dashboard/students"
)

// ShowCreateStudent renders the create student form
func (s *Server) ShowCreateStudent(w http.ResponseWriter, r *http.Request) {
	academicYear, err := s.queries.GetCurrentAcademicYear(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("internal server error", "message:", err.Error())
		return
	}
	component := students.CreateStudentForm(academicYear)
	s.renderComponent(w, r, component)
}

// CreateStudent handler method accepts a form of values
// creates a student and guardian.
func (s *Server) CreateStudent(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseForm(); err != nil {
		writeError(w, http.StatusUnprocessableEntity, "failed to parse form")
		return
	}
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
