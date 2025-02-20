package server

import (
	"log/slog"
	"net/http"

	"school_management_system/cmd/web/dashboard/students"

	"github.com/google/uuid"
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
