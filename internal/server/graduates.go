package server

import (
	"log/slog"
	"net/http"

	"school_management_system/cmd/web/dashboard/graduates"

	"github.com/google/uuid"
)

// ShowGraduatePage renders the graduates list templ component
func (s *Server) ShowGraduatePage(w http.ResponseWriter, r *http.Request) {
	academicYears, err := s.queries.ListAcademicYear(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to retrieve academic years")
		slog.Error("failed to retrieve academic year records", "message", err.Error())
		return
	}

	s.renderComponent(w, r, graduates.GraduatesPage(academicYears))
}

// ShowGraduatesList renders the graduates list templ component
func (s *Server) ShowGraduatesList(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		writeError(w, http.StatusBadRequest, "failed to parse form data")
		slog.Error("failed to parse academic year", "error", err.Error())
		return
	}

	academicYearID := r.FormValue("academic_year_id")
	parsedAcademicID, err := uuid.Parse(academicYearID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to parse ", "academic year ID", academicYearID, "error", err.Error())
		return
	}

	graduatesList, err := s.queries.ListGraduatesByAcademicYear(r.Context(), parsedAcademicID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to retrieve academic years")
		slog.Error("failed to retrieve academic year records", "message", err.Error())
	}

	s.renderComponent(w, r, graduates.GraduatesList(graduatesList))
}
