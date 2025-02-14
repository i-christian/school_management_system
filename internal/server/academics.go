package server

import (
	"log/slog"
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
	if r.Header.Get("HX-Request") != "" {
		w.Header().Set("HX-Redirect", "/academics/years")
		w.WriteHeader(http.StatusOK)
		return
	}

	http.Redirect(w, r, "/academics/years", http.StatusFound)
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

// ShowEditAcademicYear handler method renders the EditYearModal form
func (s *Server) ShowEditAcademicYear(w http.ResponseWriter, r *http.Request) {
	academicYearID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "invalid academic year")
		return
	}

	academicYear, err := s.queries.GetAcademicYear(r.Context(), academicYearID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("academic year not found", "message", err.Error())
		return
	}

	s.renderComponent(w, r, academics.EditYearModal(academicYear))
}

// EditAcademicYear handler updates academic year
func (s *Server) EditAcademicYear(w http.ResponseWriter, r *http.Request) {
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

	if r.Header.Get("HX-Request") != "" {
		w.Header().Set("HX-Redirect", "/academics/years")
		w.WriteHeader(http.StatusOK)
		return
	}

	http.Redirect(w, r, "/academics/years", http.StatusFound)
}

// CreateTermForm handler method renders the CreateTermForm form
func (s *Server) CreateTermForm(w http.ResponseWriter, r *http.Request) {
	academicYearID := r.PathValue("id")

	s.renderComponent(w, r, academics.CreateTermForm(academicYearID))
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

	academicYearID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "invalid user id")
		return
	}

	academicYear, err := s.queries.GetAcademicYear(r.Context(), academicYearID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
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

	// validate academic year dates with terms dates
	if startDate.Format(time.DateOnly) > academicYear.EndDate.Time.Format(time.DateOnly) || startDate.Format(time.DateOnly) < academicYear.StartDate.Time.Format(time.DateOnly) || endDate.Format(time.DateOnly) > academicYear.EndDate.Time.Format(time.DateOnly) {
		writeError(w, http.StatusBadRequest, "bad request")
		slog.Error("invalid term starting date")
		return
	}

	params := database.CreateTermParams{
		AcademicYearID: academicYearID,
		Name:           name,
		StartDate:      pgtype.Date{Time: startDate, Valid: true},
		EndDate:        pgtype.Date{Time: endDate, Valid: true},
	}

	_, err = s.queries.CreateTerm(r.Context(), params)

	if r.Header.Get("HX-Request") != "" {
		w.Header().Set("HX-Redirect", "/academics/years")
		w.WriteHeader(http.StatusOK)
		return
	}

	http.Redirect(w, r, "/academics/years", http.StatusFound)
}

// ListTerms handler method retrieves terms per academic year
func (s *Server) ListTerms(w http.ResponseWriter, r *http.Request) {
	academicYear, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "bad request")
		slog.Error("failed to parse academic year id")
	}

	terms, err := s.queries.ListTerms(r.Context(), academicYear)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to retrieve terms")
		return
	}

	component := academics.TermsList(terms)
	s.renderComponent(w, r, component)
}

// ShowEditAcademicTerm handler method renders EditTermForm
func (s *Server) ShowEditAcademicTerm(w http.ResponseWriter, r *http.Request) {
	termID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "invalid academic term")
		slog.Error("failed to parse term id", "message:", err.Error())
		return
	}

	academicTerm, err := s.queries.GetTerm(r.Context(), termID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("academic term not found", "message:", err.Error())
		return
	}

	s.renderComponent(w, r, academics.EditTermForm(academicTerm))
}

// EditTerms handler method handles editing an academic year
func (s *Server) EditTerm(w http.ResponseWriter, r *http.Request) {
	termID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "wrong parameters")
		return
	}

	academicTerm, err := s.queries.GetTerm(r.Context(), termID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}

	academicYear, err := s.queries.GetAcademicYear(r.Context(), academicTerm.AcademicYearID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
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

	// validate academic year dates with terms dates
	if startDate.Format(time.DateOnly) > academicYear.EndDate.Time.Format(time.DateOnly) || startDate.Format(time.DateOnly) < academicYear.StartDate.Time.Format(time.DateOnly) || endDate.Format(time.DateOnly) > academicYear.EndDate.Time.Format(time.DateOnly) {
		writeError(w, http.StatusBadRequest, "bad request")
		slog.Error("invalid term starting date")
		return
	}

	params := database.EditTermParams{
		TermID:    termID,
		Name:      name,
		StartDate: pgtype.Date{Time: startDate, Valid: true},
		EndDate:   pgtype.Date{Time: endDate, Valid: true},
	}

	err = s.queries.EditTerm(r.Context(), params)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}

	if r.Header.Get("HX-Request") != "" {
		w.Header().Set("HX-Redirect", "/academics/years")
		w.WriteHeader(http.StatusOK)
		return
	}

	http.Redirect(w, r, "/academics/years", http.StatusFound)
}
