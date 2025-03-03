package server

import (
	"log/slog"
	"net/http"

	"school_management_system/cmd/web/dashboard/promotions"
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

	if r.Header.Get("HX-Request") != "" {
		w.Header().Set("HX-Redirect", "/promotions")
		w.WriteHeader(http.StatusOK)
		return
	}
	http.Redirect(w, r, "/promotions", http.StatusFound)
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

// ShowPromotionList renders the current promotion list templ component
// func (s *Server) ShowPromotionList(w http.ResponseWriter, r *http.Request) {
// 	err := r.ParseForm()
// 	if err != nil {
// 		writeError(w, http.StatusBadRequest, "failed to parse form data")
// 		slog.Error("failed to parse academic year", "error", err.Error())
// 		return
// 	}

// 	academicYearID := r.FormValue("academic_year_id")
// 	parsedAcademicID, err := uuid.Parse(academicYearID)
// 	if err != nil {
// 		writeError(w, http.StatusInternalServerError, "internal server error")
// 		slog.Error("failed to parse ", "academic year ID", academicYearID, "error", err.Error())
// 		return
// 	}

// 	graduatesList, err := s.queries.ListGraduatesByAcademicYear(r.Context(), parsedAcademicID)
// 	if err != nil {
// 		writeError(w, http.StatusInternalServerError, "failed to retrieve academic years")
// 		slog.Error("failed to retrieve academic year records", "message", err.Error())
// 	}

// 	s.renderComponent(w, r, graduates.GraduatesList(graduatesList))
// }
