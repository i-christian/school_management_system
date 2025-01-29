package server

import (
	"net/http"
	"time"

	"school_management_system/internal/database"

	"github.com/google/uuid"
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

// ListAcademicYears handler lists academic years
func (s *Server) ListAcademicYears(w http.ResponseWriter, r *http.Request) {
	_, err := s.queries.ListAcademicYear(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "could not fetch academic year list")
	}
}

// EditAcademicYear handler updates academic year
func (s *Server) EditAcademicYear(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
	}

	academic_year_id, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "failed to parse id")
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

	params := database.EditAcademicYearParams{
		Name:           name,
		StartDate:      pgtype.Date{Time: startDate, Valid: true},
		EndDate:        pgtype.Date{Time: endDate, Valid: true},
		AcademicYearID: academic_year_id,
	}

	err = s.queries.EditAcademicYear(r.Context(), params)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
	}
}

// DeleteAcademicYear
func (s *Server) DeleteAcademicYear(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "invalid request data")
	}

	err = s.queries.DeleteAcademicYear(r.Context(), id)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to delete academic year")
	}
}

// CreateTerm handler function
func (s *Server) CreateTerm(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
	}

	if err := r.ParseForm(); err != nil {
		writeError(w, http.StatusUnprocessableEntity, "failed to parse form")
		return
	}

	academicYear := r.FormValue("academic_year")
	name := r.FormValue("name")
	start := r.FormValue("start")
	end := r.FormValue("end")

	// validate form
	if academicYear == "" || name == "" || start == "" || end == "" {
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

	academic_year, err := s.queries.GetAcademicYear(r.Context(), academicYear)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to find academic year")
	}

	params := database.CreateTermParams{
		AcademicYearID: academic_year.AcademicYearID,
		Name:           name,
		StartDate:      pgtype.Date{Time: startDate, Valid: true},
		EndDate:        pgtype.Date{Time: endDate, Valid: true},
	}

	_, err = s.queries.CreateTerm(r.Context(), params)
}

// ListTerms handler method retrieves terms per academic year
func (s *Server) ListTerms(w http.ResponseWriter, r *http.Request) {
	academicYear := r.PathValue("year")

	_, err := s.queries.ListTerms(r.Context(), academicYear)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to retrieve terms")
	}
}
