package server

import (
	"log/slog"
	"net/http"

	"school_management_system/cmd/web/settings"
)

func (s *Server) ShowUserSettings(w http.ResponseWriter, r *http.Request) {
	user, ok := r.Context().Value(userContextKey).(User)
	if !ok {
		writeError(w, http.StatusUnauthorized, "not logged in")
		slog.Error("user not logged in, failed to read userID from userContextKey")
		return
	}

	userDetails, err := s.queries.GetUserDetails(r.Context(), user.UserID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to fetch user")
		slog.Error("failed to fetch user", "UserID", user.UserID, "error", err.Error())
		return
	}

	s.renderComponent(w, r, settings.UserSettings(userDetails))
}
