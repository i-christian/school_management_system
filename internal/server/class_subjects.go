package server

import (
	"net/http"

	"school_management_system/internal/database"

	"github.com/google/uuid"
)

// CreateClass handler method
func (s *Server) CreateClass(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}

	err := r.ParseForm()
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "wrong parameters")
		return
	}

	name := r.FormValue("class_name")

	err = s.queries.CreateClass(r.Context(), name)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}
}

// ListClasses handler method
func (s *Server) ListClasses(w http.ResponseWriter, r *http.Request) {
	// TODO: classInfo slice here
	_, err := s.queries.ListClasses(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}
}

// EditClasses handler method
func (s *Server) EditClass(w http.ResponseWriter, r *http.Request) {
	class_id, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "wrong parameters")
		return
	}

	err = r.ParseForm()
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "wrong form params")
		return
	}

	name := r.FormValue("class_name")

	params := database.EditClassParams{
		ClassID: class_id,
		Name:    name,
	}

	err = s.queries.EditClass(r.Context(), params)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}
}
