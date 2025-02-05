package server

import (
	"net/http"
	"strconv"

	"school_management_system/cmd/web/dashboard"
)

func (s *Server) GetTotalUsers(w http.ResponseWriter, r *http.Request) {
	totalUsers, err := s.queries.GetTotalUsers(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
	}

	s.renderComponent(w, r, dashboard.TotalUsers(strconv.Itoa(int(totalUsers))))
}
