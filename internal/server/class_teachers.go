package server

import (
	"log/slog"
	"net/http"

	"school_management_system/cmd/web/dashboard/classteachers"
)

// showCreateClassTeacher method links a classteacher to a class
func (s *Server) showCreateClassTeacher(w http.ResponseWriter, r *http.Request) {
	teachers, err := s.queries.GetAllDBClassTeachers(r.Context())
	if err != nil {
		slog.Warn("no user with the role of classteacher found in the system", "error", err.Error())
	}

	s.renderComponent(w, r, classteachers.ClassTeacherForm(teachers))
}
