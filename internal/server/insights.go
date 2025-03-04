package server

import (
	"fmt"
	"log/slog"
	"net/http"
	"strconv"

	"school_management_system/cmd/web/dashboard"
)

// Dashboard is the index handler for the dashboard.
func (s *Server) Dashboard(w http.ResponseWriter, r *http.Request) {
	user, ok := r.Context().Value(userContextKey).(User)
	if !ok {
		writeError(w, http.StatusUnauthorized, "unauthorized")
	}

	userRole := dashboard.DashboardUserRole{
		Role: user.Role,
	}

	contents := dashboard.DashboardCards(userRole)
	s.renderComponent(w, r, contents)
}

func (s *Server) GetTotalUsers(w http.ResponseWriter, r *http.Request) {
	totalUsers, err := s.queries.GetTotalUsers(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
	}

	s.renderComponent(w, r, dashboard.TotalCount(strconv.Itoa(int(totalUsers))))
}

func (s *Server) GetStudentsTotal(w http.ResponseWriter, r *http.Request) {
	totalStudents, err := s.queries.GetTotalStudents(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
	}

	s.renderComponent(w, r, dashboard.TotalCount(strconv.Itoa(int(totalStudents))))
}

func (s *Server) GetFees(w http.ResponseWriter, r *http.Request) {
	totalAmount, err := s.queries.GetTotalFeesPaid(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}

	totalFees, ok := totalAmount.(float64)
	if !ok {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("Failed to convert to float")
		return
	}

	totalFeesStr := fmt.Sprintf("%.2f", totalFees)

	s.renderComponent(w, r, dashboard.TotalCount(totalFeesStr))
}
