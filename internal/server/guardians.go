package server

import (
	"log/slog"
	"net/http"

	"school_management_system/cmd/web/dashboard/students"
)

func (s *Server) ListGuardians(w http.ResponseWriter, r *http.Request) {
	guardians, err := s.queries.GetAllStudentGuardianLinks(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to retrieve guardians list", ":", err.Error())
		return
	}

	s.renderComponent(w, r, students.GuardiansList(guardians))
}
