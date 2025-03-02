package server

import (
	"log/slog"
	"net/http"

	"school_management_system/cmd/web/dashboard/graduates"
)

// ShowGraduateClasses renders the grades list templ component
func (s *Server) ShowGraduateClasses(w http.ResponseWriter, r *http.Request) {
	current, err := s.queries.GetCurrentAcademicYear(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to find that academic year")
		slog.Error("failed to find current academic year", "error", err.Error())
		return
	}

	academicYears, err := s.queries.ListAcademicYear(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to retrieve academic years")
		slog.Error("failed to retrieve academic year records", "message", err.Error())
		return
	}

	s.renderComponent(w, r, graduates.GraduatesPage(academicYears, current.AcademicYearID.String()))
}
