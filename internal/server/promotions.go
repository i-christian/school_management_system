package server

import (
	"log/slog"
	"net/http"

	"school_management_system/cmd/web/dashboard/promotions"
	"school_management_system/internal/database"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

// ShowSetupPromotionPage renders student's class promotion setup templ component
func (s *Server) ShowSetupPromotionPage(w http.ResponseWriter, r *http.Request) {
	currentTerm, err := s.queries.GetCurrentTerm(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to find the current term")
		slog.Error("failed to find current academic term", "error", err.Error())
		return
	}

	schoolClasses, err := s.queries.ListClasses(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get classes")
		slog.Error("failed to retrieve classes", "error", err.Error())
		return
	}

	graduatingClass, err := s.queries.GetCurrentGraduateClass(r.Context(), currentTerm.AcademicYearID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get graduating class")
		slog.Error("failed to retrieve class", "error", err.Error())
		return
	}

	s.renderComponent(w, r, promotions.CreatePromotionForm(schoolClasses, graduatingClass))
}

// SubmitPromotion processes the form submission from the remarks page.
// It expects form fields: class_id, and next_class_id.
func (s *Server) SubmitPromotions(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseForm(); err != nil {
		writeError(w, http.StatusBadRequest, "invalid form submission")
		return
	}

	classID := r.FormValue("class_id")
	nextClassID := r.FormValue("next_class_id")

	if classID == "" || nextClassID == "" {
		writeError(w, http.StatusBadRequest, "invalid form data")
		return
	}

	parsedClassID, err := uuid.Parse(classID)
	if err != nil {
		writeError(w, http.StatusBadRequest, "failed to parse class ID")
		slog.Error("failed to parse class ID", "error", err.Error())
		return
	}

	parsedNextClassID, err := uuid.Parse(nextClassID)
	if err != nil {
		writeError(w, http.StatusBadRequest, "failed to parse class ID")
		slog.Error("failed to parse class ID", "error", err.Error())
		return
	}

	currentPromotions, err := s.queries.ListClassPromotions(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("internal server error", "error", err.Error())
		return
	}

	// validations
	for _, existing := range currentPromotions {
		if parsedClassID == existing.NextClassID.Bytes && parsedNextClassID == existing.ClassID {
			w.Header().Set("Content-Type", "text/html")
			_, _ = w.Write([]byte(`
					<div id="popover" class="custom-popover show" style="background-color: #dc2626;">
						<span>❌ A reverse of an available promotion rule not is not allowed</span>
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

	if parsedClassID == parsedNextClassID {
		if r.Header.Get("HX-Request") != "" {
			w.Header().Set("Content-Type", "text/html")
			_, _ = w.Write([]byte(`
					<div id="popover" class="custom-popover show" style="background-color: #dc2626;">
						<span>❌ Invalid promotion rule selection</span>
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

	bytesNextClassID, err := parsedNextClassID.MarshalBinary()
	if err != nil {
		slog.Error("failed to marshalbinary uuid", "error", err.Error())
		return
	}

	params := database.CreateClassPromotionsParams{
		ClassID:     parsedClassID,
		NextClassID: pgtype.UUID{Bytes: [16]byte(bytesNextClassID), Valid: true},
	}

	_, err = s.queries.CreateClassPromotions(r.Context(), params)
	if err != nil {
		slog.Error("failed to create a class promotion rule", "classID", parsedClassID, "nextClassID", parsedNextClassID, "error", err.Error())
		if r.Header.Get("HX-Request") != "" {
			w.Header().Set("Content-Type", "text/html")
			_, _ = w.Write([]byte(`
					<div id="popover" class="custom-popover show" style="background-color: #dc2626;">
						<span>❌ Failed to save a promotion rule</span>
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

	if r.Header.Get("HX-Request") != "" {
		w.Header().Set("HX-Redirect", "/promotions")
		w.WriteHeader(http.StatusOK)
		return
	}

	http.Redirect(w, r, "/promotions", http.StatusSeeOther)
}

// ShowPromotionPage renders students promotion templ component
func (s *Server) ShowPromotionPage(w http.ResponseWriter, r *http.Request) {
	currentTerm, err := s.queries.GetCurrentTerm(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to find the current term")
		slog.Error("failed to find current academic term", "error", err.Error())
		return
	}

	promotionClasses, err := s.queries.ListClassPromotions(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to retrieve class promotions")
		slog.Error("failed to retrieve class promotions", "error", err.Error())
	}

	schoolClasses, err := s.queries.ListClasses(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get classes")
		slog.Error("failed to retrieve classes", "error", err.Error())
		return
	}

	s.renderComponent(w, r, promotions.PromotionsPage(promotionClasses, schoolClasses, currentTerm))
}

// ShowResetPromotion confirmation modal
func (s *Server) ShowResetPromotion(w http.ResponseWriter, r *http.Request) {
	s.renderComponent(w, r, promotions.ConfirmationForm("Reset"))
}

// ResetPromotionRules clears all custom class promotion rules.
func (s *Server) ResetPromotionRules(w http.ResponseWriter, r *http.Request) {
	if err := s.queries.ResetPromotions(r.Context()); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to reset promotion rules")
		slog.Error("failed to reset promotion rules", "error", err.Error())
		return
	}

	if r.Header.Get("HX-Request") != "" {
		w.Header().Set("HX-Redirect", "/promotions")
		w.WriteHeader(http.StatusOK)
		return
	}

	http.Redirect(w, r, "/promotions", http.StatusSeeOther)
}

// ShowUndoPromotion confirmation modal
func (s *Server) ShowUndoPromotion(w http.ResponseWriter, r *http.Request) {
	s.renderComponent(w, r, promotions.ConfirmationForm("Undo"))
}

// UndoPromotion undoes the last student class promotion for a given term.
func (s *Server) UndoPromotion(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseForm(); err != nil {
		writeError(w, http.StatusBadRequest, "invalid form submission")
		return
	}
	termID := r.FormValue("term_id")
	if termID == "" {
		writeError(w, http.StatusBadRequest, "term ID is required")
		return
	}
	parsedTermID, err := uuid.Parse(termID)
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid term ID format")
		slog.Error("failed to parse term ID", "error", err.Error())
		return
	}

	err = s.queries.UndoPromoteStudents(r.Context(), parsedTermID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to undo student promotion")
		slog.Error("failed to undo student promotion", "error", err.Error())
		return
	}

	if r.Header.Get("HX-Request") != "" {
		w.Header().Set("HX-Redirect", "/promotions")
		w.WriteHeader(http.StatusOK)
		return
	}
	http.Redirect(w, r, "/promotions", http.StatusSeeOther)
}
