package server

import (
	"net/http"
	"time"

	"school_management_system/internal/database"

	"github.com/jackc/pgx/v5/pgtype"
)

// CreateAcademicYear handler method creates an academic year or school calender.
func (s *Server) CreateAcademicYear(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
	}

	if err := r.ParseForm(); err != nil {
		writeError(w, http.StatusUnprocessableEntity, "failed to parse form")
		return
	}

	name := r.FormValue("name")
	start := r.FormValue("start")
	end := r.FormValue("end")

	// validate form
	if name == "" || start == "" || end == "" {
		writeError(w, http.StatusBadRequest, "all fields are required")
	}
	startDate, err := time.Parse(time.DateOnly, start)
	if err != nil {
		writeError(w, http.StatusBadGateway, "failed to parse start date")
		return
	}

	endDate, err := time.Parse(time.DateOnly, end)
	if err != nil {
		writeError(w, http.StatusBadRequest, "failed to parse end date")
	}

	params := database.CreateAcademicYearParams{
		Name:      name,
		StartDate: pgtype.Date{Time: startDate, Valid: true},
		EndDate:   pgtype.Date{Time: endDate, Valid: true},
	}

	_, err = s.queries.CreateAcademicYear(r.Context(), params)
}

func (s *Server) ListAcademicYears(w http.ResponseWriter, r *http.Request) {
}
