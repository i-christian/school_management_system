package server

import (
	"errors"
	"log/slog"
	"net/http"

	"school_management_system/cmd/web"
	"school_management_system/internal/cookies"
	"school_management_system/internal/database"

	"github.com/google/uuid"
)

func (s *Server) userDetails(w http.ResponseWriter, r *http.Request) {
	sessionID, err := cookies.ReadEncrypted(r, "sessionid", s.SecretKey)
	if err != nil {
		if errors.Is(err, http.ErrNoCookie) || errors.Is(err, cookies.ErrInvalidValue) {
			writeError(w, http.StatusUnauthorized, "User not authenticated")
			return
		}
		writeError(w, http.StatusInternalServerError, "server error")
		return
	}

	parsedSessionID, err := uuid.Parse(sessionID)
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid session ID")
		return
	}

	role, err := s.queries.GetUserRole(r.Context(), parsedSessionID)
	if err != nil {
		slog.Error("Failed to retrieve user role")
	}

	user, err := s.queries.GetSession(r.Context(), parsedSessionID)

	userInfoParams := database.GetUserDetailsParams{
		UserID: user.UserID,
		Name:   role.Role,
	}

	userInfo, err := s.queries.GetUserDetails(r.Context(), userInfoParams)

	w.Header().Set("Content-Type", "text/html")

	component := web.UserRole(web.User{
		FirstName: userInfo.FirstName,
		LastName:  userInfo.LastName,
		Gender:    userInfo.Gender,
		Role:      userInfo.Role,
	})

	err = component.Render(r.Context(), w)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		slog.Error("Failed to render")
	}
}
