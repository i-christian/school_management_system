package server

import (
	"crypto/rand"
	"errors"
	"fmt"
	"log/slog"
	"math/big"
	"net/http"

	"school_management_system/cmd/web"
	"school_management_system/cmd/web/dashboard"

	"github.com/a-h/templ"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

type CachedTerm struct {
	TermID         uuid.UUID
	PreviousTermID pgtype.UUID
	AcademicTerm   string
	OpeningDate    pgtype.Date
	ClosingDate    pgtype.Date
	Active         bool
}

type CachedAcademicYear struct {
	AcademicYearID  uuid.UUID
	GraduateClassID pgtype.UUID
	Name            string
	StartDate       pgtype.Date
	EndDate         pgtype.Date
	Active          bool
}

// getCachedYear returns the cached academic year
func (s *Server) getCachedYear() (CachedAcademicYear, error) {
	cachedAY, ok := s.cache.Get(string(academicYearKey))
	if !ok {
		return CachedAcademicYear{}, errors.New("active year not found in cache")
	}

	currentAcademicYear, ok := cachedAY.(CachedAcademicYear)
	if !ok {
		return CachedAcademicYear{}, errors.New("active year not available")
	}

	return currentAcademicYear, nil
}

// getCachedTerm returns the cached academic term
func (s *Server) getCachedTerm() (CachedTerm, error) {
	cachedTerm, ok := s.cache.Get(string(academicTermKey))
	if !ok {
		return CachedTerm{}, errors.New("active term not found in cache")
	}

	currentTerm, ok := cachedTerm.(CachedTerm)
	if !ok {
		return CachedTerm{}, errors.New("active term not available")
	}

	return currentTerm, nil
}

// renderDashboardComponent renders a component either as a full dashboard page
// (when not an HTMX request) or just the component (when it's an HTMX request).
func (s *Server) renderComponent(w http.ResponseWriter, r *http.Request, children templ.Component) {
	if r.Header.Get("HX-Request") == "true" {
		if err := children.Render(r.Context(), w); err != nil {
			writeError(w, http.StatusBadRequest, err.Error())
			slog.Error("Failed to render dashboard component", "error", err)
		}
	} else {
		userRole, ok := r.Context().Value(userContextKey).(User)
		if !ok {
			writeError(w, http.StatusUnauthorized, "unauthorised")
			return
		}
		user := dashboard.DashboardUserRole{
			Role: userRole.Role,
		}

		term, _ := s.getCachedTerm()

		termArg := dashboard.DashboardTerm{
			TermID: term.TermID,
		}

		ctx := templ.WithChildren(r.Context(), children)
		if err := web.Dashboard(user, termArg).Render(ctx, w); err != nil {
			writeError(w, http.StatusBadRequest, err.Error())
			slog.Error("Failed to render dashboard layout", "error", err)
		}
	}
}

// Generate a random 6-digit numeric password
func generateNumericPassword() (string, error) {
	const passwordLength = 6
	password := ""

	for i := 0; i < passwordLength; i++ {
		num, err := rand.Int(rand.Reader, big.NewInt(10))
		if err != nil {
			return "", err
		}
		password += fmt.Sprintf("%d", num.Int64())
	}

	return password, nil
}

// convertStringToUUID helper function accepts a string and returns a UUID
func convertStringToUUID(id string) (uuid.UUID, error) {
	if id == "" {
		return uuid.Nil, errors.New("an empty string cannot be converted to a UUID")
	}
	result, err := uuid.Parse(id)
	if err != nil {
		return uuid.Nil, err
	}

	return result, nil
}
