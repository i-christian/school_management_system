package server

import (
	"net/http"
	"time"

	"school_management_system/cmd/web/dashboard/academics"
	"school_management_system/internal/database"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

// CreateAcademicYear handler method creates an academic year or school calender.
func (s *Server) CreateAcademicYear(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
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
		return
	}
	startDate, err := time.Parse(time.DateOnly, start)
	if err != nil {
		writeError(w, http.StatusBadGateway, "failed to parse start date")
		return
	}

	endDate, err := time.Parse(time.DateOnly, end)
	if err != nil {
		writeError(w, http.StatusBadRequest, "failed to parse end date")
		return
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
	AcademicYears, err := s.queries.ListAcademicYear(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "could not fetch academic year list")
		return
	}

	component := academics.AcademicYearsTermsList(AcademicYears)
	s.renderComponent(w, r, component)
}

// EditAcademicYear handler updates academic year
func (s *Server) EditAcademicYear(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}

	academic_year_id, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "failed to parse id")
		return
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
		return
	}
	startDate, err := time.Parse(time.DateOnly, start)
	if err != nil {
		writeError(w, http.StatusBadGateway, "failed to parse start date")
		return
	}

	endDate, err := time.Parse(time.DateOnly, end)
	if err != nil {
		writeError(w, http.StatusBadRequest, "failed to parse end date")
		return
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
		return
	}
}

// DeleteAcademicYear
func (s *Server) DeleteAcademicYear(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "invalid request data")
		return
	}

	err = s.queries.DeleteAcademicYear(r.Context(), id)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to delete academic year")
		return
	}
}

// CreateTerm handler function
func (s *Server) CreateTerm(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
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
		return
	}
	startDate, err := time.Parse(time.DateOnly, start)
	if err != nil {
		writeError(w, http.StatusBadGateway, "failed to parse start date")
		return
	}

	endDate, err := time.Parse(time.DateOnly, end)
	if err != nil {
		writeError(w, http.StatusBadRequest, "failed to parse end date")
		return
	}

	academic_year, err := s.queries.GetAcademicYear(r.Context(), academicYear)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to find academic year")
		return
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
	academicYear := r.PathValue("academic_year")

	_, err := s.queries.ListTerms(r.Context(), academicYear)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to retrieve terms")
		return
	}
}

// GetTerm handler method retrives all data for a specific term
func (s *Server) GetTerm(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	term_id, err := uuid.Parse(id)
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "wrong parameters")
		return
	}

	// add termInfo struct data to later
	_, err = s.queries.GetTerm(r.Context(), term_id)
}

// EditTerms handler method
func (s *Server) EditTerm(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	term_id, err := uuid.Parse(id)
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "wrong parameters")
		return
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
		return
	}
	startDate, err := time.Parse(time.DateOnly, start)
	if err != nil {
		writeError(w, http.StatusBadGateway, "failed to parse start date")
		return
	}

	endDate, err := time.Parse(time.DateOnly, end)
	if err != nil {
		writeError(w, http.StatusBadRequest, "failed to parse end date")
		return
	}

	params := database.EditTermParams{
		TermID:    term_id,
		Name:      name,
		StartDate: pgtype.Date{Time: startDate, Valid: true},
		EndDate:   pgtype.Date{Time: endDate, Valid: true},
	}

	err = s.queries.EditTerm(r.Context(), params)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}
}

// DeleteTerm handler method deletes a term
func (s *Server) DeleteTerm(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	term_id, err := uuid.Parse(id)
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "wrong parameters")
		return
	}

	err = s.queries.DeleteTerm(r.Context(), term_id)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}
}
