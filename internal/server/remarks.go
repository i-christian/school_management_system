package server

import (
	"log/slog"
	"net/http"

	"school_management_system/cmd/web/dashboard/remarks"
)

// StudentsRemarks handler method renders RemarksPage component
func (s *Server) StudentsRemarks(w http.ResponseWriter, r *http.Request) {
	remarksData, err := s.queries.ListRemarksByClass(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get remarks")
		slog.Error("failed to get remarks data", "error", err.Error())
		return
	}

	s.renderComponent(w, r, remarks.RemarksPage(remarksData))
}

// StudentsDisciplinary handler method renders StudentsDisciplinary component
func (s *Server) StudentsDisciplinary(w http.ResponseWriter, r *http.Request) {
	disciplineData, err := s.queries.ListDisciplinaryRecords(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get disciplinary data")
		slog.Error("failed to get disciplinary data", "error", err.Error())
		return
	}

	s.renderComponent(w, r, remarks.DisciplinePage(disciplineData))
}
