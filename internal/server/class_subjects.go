package server

import (
	"log/slog"
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
	if name == "" {
		writeError(w, http.StatusBadRequest, "name can not be empty")
	}

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

// DeleteClass handler method
func (s *Server) DeleteClass(w http.ResponseWriter, r *http.Request) {
	classId, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "wrong parameters")
		return
	}

	err = s.queries.DeleteClass(r.Context(), classId)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}
}

// CreateSubject handler method
func (s *Server) CreateSubject(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "wrong parameters")
		return
	}

	className := r.FormValue("class_name")
	subjectName := r.FormValue("subject_name")

	if className == "" || subjectName == "" {
		writeError(w, http.StatusBadRequest, "fields can not be empty")
		return
	}

	class, err := s.queries.GetClass(r.Context(), className)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("Failed to get a class", "Message:", err.Error())
		return
	}

	params := database.CreateSubjectParams{
		ClassID: class.ClassID,
		Name:    subjectName,
	}

	err = s.queries.CreateSubject(r.Context(), params)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}
}
