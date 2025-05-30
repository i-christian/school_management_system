package server

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"time"

	"school_management_system/cmd/web/components"
	"school_management_system/cmd/web/dashboard/academics"
	"school_management_system/internal/database"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

// ShowCreateAcademicYear page renders academic year creating form
func (s *Server) ShowCreateAcademicYear(w http.ResponseWriter, r *http.Request) {
	s.renderComponent(w, r, academics.AcademicYearForm())
}

// CreateAcademicYear handler method creates an academic year or school calender.
func (s *Server) CreateAcademicYear(w http.ResponseWriter, r *http.Request) {
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
		writeError(w, http.StatusBadRequest, "failed to parse start date")
		return
	}

	endDate, err := time.Parse(time.DateOnly, end)
	if err != nil {
		writeError(w, http.StatusBadRequest, "failed to parse end date")
		return
	}

	// Restrict creating academic year in the past
	if endDate.Before(time.Now()) {
		if r.Header.Get("HX-Request") != "" {
			w.Header().Set("Content-Type", "text/html")
			_, _ = w.Write([]byte(`
					<div id="popover" class="custom-popover show" style="background-color: #dc2626;">
						<span>❌ Can not create an academic year in the past</span>
					</div>
					<script>
						setTimeout(() => {
							document.getElementById('popover').classList.add('hide');
							setTimeout(() => document.getElementById('popover').remove(), 500);
						}, 3000);
					</script>
				`))
			return
		}
		slog.Error("academic year can not be in the past")
		return
	}

	ctx := r.Context()
	tx, err := s.conn.Begin(ctx)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to start transaction")
		return
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)

	graduateClassName := fmt.Sprintf("Graduates - %d", endDate.Year())

	graduateClass, err := qtx.CreateGraduateClass(ctx, graduateClassName)
	if err != nil {
		if r.Header.Get("HX-Request") != "" {
			w.Header().Set("Content-Type", "text/html")
			_, _ = w.Write([]byte(`
					<div id="popover" class="custom-popover show" style="background-color: #dc2626;">
						<span>
							❌ Can not create academic year graduate's class.
							Please Check that the end year of the academic year does not overlap with any available academic year.
							</span>
					</div>
					<script>
						setTimeout(() => {
							document.getElementById('popover').classList.add('hide');
							setTimeout(() => document.getElementById('popover').remove(), 500);
						}, 3000);
					</script>
				`))
			return
		}
		slog.Error("failed to create graduate class", "error", err.Error())
		return
	}

	graduateClassBytes, err := graduateClass.ClassID.MarshalBinary()
	if err != nil {
		slog.Error("failed to marshal graduate class bytes", "error", err.Error())
		return
	}

	params := database.CreateAcademicYearParams{
		Name:            name,
		StartDate:       pgtype.Date{Time: startDate, Valid: true},
		EndDate:         pgtype.Date{Time: endDate, Valid: true},
		GraduateClassID: pgtype.UUID{Bytes: [16]byte(graduateClassBytes), Valid: true},
	}

	_, err = qtx.CreateAcademicYear(ctx, params)
	if err != nil {
		if r.Header.Get("HX-Request") != "" {
			w.Header().Set("Content-Type", "text/html")
			_, _ = w.Write([]byte(`
					<div id="popover" class="custom-popover show" style="background-color: #dc2626;">
						<p> ❌ Failed to create a new academic year. 
						</p>
						<p> HINT: Make sure the Start and End period of an academic year does not overlap with any other</p>
					</div>
					<script>
						setTimeout(() => {
							document.getElementById('popover').classList.add('hide');
							setTimeout(() => document.getElementById('popover').remove(), 500);
						}, 3000);
					</script>
				`))
			return
		}
	}

	err = tx.Commit(ctx)
	if err != nil {
		slog.Error("failed to commit transaction", "error", err.Error())
		return
	}

	if r.Header.Get("HX-Request") != "" {
		w.Header().Set("Content-Type", "text/html")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`
			<div id="popover" class="custom-popover show" style="background-color: #16a34a;">
				<span>✅ Academic year created successfully</span>
			</div>
			<script>
				setTimeout(() => {
					document.getElementById('popover').classList.add('hide');
					setTimeout(() => document.getElementById('popover').remove(), 500);
				}, 3000);
				window.location.reload()
			</script>
		`))
		return
	}

	http.Redirect(w, r, "/academics/years", http.StatusFound)
}

// ListAcademicYears handler lists academic years
func (s *Server) ListAcademicYears(w http.ResponseWriter, r *http.Request) {
	AcademicYears, err := s.queries.ListAcademicYear(r.Context())
	if err != nil {
		slog.Warn("no academic year record found")
	}

	studentsTerm, err := s.queries.GetStudentsTerm(r.Context())
	if err != nil {
		slog.Warn("no student's term record available")
	}

	term, err := s.getCachedTerm()
	if err != nil {
		slog.Error("Failed to retrive current academic term", "error", err.Error())
	}

	component := academics.AcademicYearsTermsList(AcademicYears, studentsTerm.Term, studentsTerm.AcademicYear, term.AcademicTerm)
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
	if err := r.ParseForm(); err != nil {
		writeError(w, http.StatusUnprocessableEntity, "failed to parse form")
		return
	}

	academicYearID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "invalid academic year id")
		return
	}

	academicYear, err := s.queries.GetAcademicYear(r.Context(), academicYearID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}

	if !academicYear.Active {
		slog.Error("failed to create term, academic year is marked as inactive")
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

// toggleAcademicYear method sets the current academic year
func (s *Server) toggleAcademicYear(ctx context.Context, academicID uuid.UUID) error {
	tx, err := s.conn.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)
	qtx := s.queries.WithTx(tx)

	// first deactive the active term before deactivating its academic year.
	if _, err = qtx.DeactivateTerm(ctx); err != nil {
		if err.Error() != "no rows in result set" {
			return err
		} else {
			s.cache.Remove(string(academicTermKey))
		}
	}

	err = qtx.DeactivateAcademicYear(ctx)
	if err != nil {
		return err
	}

	activeYear, err := qtx.SetCurrentAcademicYear(ctx, academicID)
	if err != nil {
		return err
	} else {
		s.cache.Set(string(academicYearKey), CachedAcademicYear{
			AcademicYearID:  activeYear.AcademicYearID,
			GraduateClassID: activeYear.GraduateClassID,
			Name:            activeYear.Name,
			StartDate:       activeYear.StartDate,
			EndDate:         activeYear.EndDate,
			Active:          activeYear.Active,
		})
	}

	return tx.Commit(ctx)
}

// setActiveYear handler method is used to switch
// current active academic year
func (s *Server) setActiveYear(w http.ResponseWriter, r *http.Request) {
	yearID, err := convertStringToUUID(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "wrong academic year")
		slog.Error("Failed to parse academic year", "details:", err.Error())
		return
	}

	err = s.toggleAcademicYear(r.Context(), yearID)
	if err != nil {
		if r.Header.Get("HX-Request") != "" {
			w.Header().Set("Content-Type", "text/html")
			_, _ = w.Write([]byte(`
					<div id="popover" class="custom-popover show" style="background-color: #dc2626;">
						<p> ❌ Failed to activate academic year. 
						</p>
					</div>
					<script>
						setTimeout(() => {
							document.getElementById('popover').classList.add('hide');
							setTimeout(() => document.getElementById('popover').remove(), 500);
						}, 3000);
					</script>
			`))
		}

		slog.Error("failed to change current academic year", "error", err.Error())
	}

	if r.Header.Get("HX-Request") != "" {
		w.Header().Set("HX-Redirect", "/academics/years")
		w.WriteHeader(http.StatusOK)
		return
	}

	http.Redirect(w, r, "/academics/years", http.StatusFound)
}

// toggleTerm method sets the current academic year
func (s *Server) toggleTerm(ctx context.Context, termID uuid.UUID) error {
	var params database.SetCurrentTermParams
	var previousTermID uuid.UUID

	// begin transaction
	tx, err := s.conn.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)
	qtx := s.queries.WithTx(tx)

	if previousTermID, err = qtx.DeactivateTerm(ctx); err != nil {
		if err.Error() != "no rows in result set" {
			return err
		}
	}

	if previousTermID == uuid.Nil {
		params = database.SetCurrentTermParams{
			TermID: termID,
		}
	} else {
		params = database.SetCurrentTermParams{
			TermID:         termID,
			PreviousTermID: pgtype.UUID{Bytes: previousTermID, Valid: true},
		}
	}

	active, err := qtx.SetCurrentTerm(ctx, params)
	if err != nil {
		return err
	} else {
		s.cache.Set(string(academicTermKey), CachedTerm{
			TermID:         active.TermID,
			PreviousTermID: active.PreviousTermID,
			AcademicTerm:   active.AcademicTerm,
			OpeningDate:    active.OpeningDate,
			ClosingDate:    active.ClosingDate,
			Active:         active.Active,
		})
	}

	return tx.Commit(ctx)
}

// setActiveTerm handler method is used to switch
// current active academic year
func (s *Server) setActiveTerm(w http.ResponseWriter, r *http.Request) {
	termID, err := convertStringToUUID(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "wrong academic year")
		slog.Error("Failed to parse academic year", "details:", err.Error())
		return
	}

	academicYearStatus := r.PathValue("academicYearStatus")
	if academicYearStatus != "true" {
		slog.Warn("Can not activate a term on an inactive academic year")
		return
	}

	err = s.toggleTerm(r.Context(), termID)

	if r.Header.Get("HX-Request") != "" {
		w.Header().Set("HX-Redirect", "/academics/years")
		w.WriteHeader(http.StatusOK)
		return
	}

	http.Redirect(w, r, "/academics/years", http.StatusFound)
}

// GetAcademicsDetails method handler gets the current
// academic year and academic term
func (s *Server) GetAcademicsDetails(w http.ResponseWriter, r *http.Request) {
	term, err := s.getCachedTerm()
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("Failed to retrive current academic term", "error", err.Error())
		return
	}

	academicYear, err := s.getCachedYear()
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("Failed to retrive current academic year", "error", err.Error())
		return
	}

	component := components.AcademicsDetails(term.AcademicTerm, academicYear.Name)
	s.renderComponent(w, r, component)
}
