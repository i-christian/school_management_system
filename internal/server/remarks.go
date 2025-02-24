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
