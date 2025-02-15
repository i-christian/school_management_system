package server

import (
	"log/slog"
	"net/http"

	"school_management_system/cmd/web/dashboard/classes"
	"school_management_system/internal/database"

	"github.com/google/uuid"
)

// ShowCreateClassForm renders the form to create a new class.
func (s *Server) ShowCreateClassForm(w http.ResponseWriter, r *http.Request) {
	s.renderComponent(w, r, classes.ClassForm())
}

// CreateClass creates a new class.
func (s *Server) CreateClass(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}

	if err := r.ParseForm(); err != nil {
		writeError(w, http.StatusUnprocessableEntity, "wrong parameters")
		return
	}

	name := r.FormValue("class_name")
	if name == "" {
		writeError(w, http.StatusBadRequest, "class name required")
		return
	}

	err := s.queries.CreateClass(r.Context(), name)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}

	if r.Header.Get("HX-Request") != "" {
		w.Header().Set("HX-Redirect", "/academics/classes")
		w.WriteHeader(http.StatusOK)
		return
	}

	http.Redirect(w, r, "/academics/classes", http.StatusFound)
}

// ListClasses renders a list of classes and their subjects.
func (s *Server) ListClasses(w http.ResponseWriter, r *http.Request) {
	classesList, err := s.queries.ListClasses(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}

	component := classes.ClassesSubjectsList(classesList)
	s.renderComponent(w, r, component)
}

// ShowEditClass handler method renders EditClassForm
func (s *Server) ShowEditClass(w http.ResponseWriter, r *http.Request) {
	classID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "invalid class")
		slog.Error("failed to parse class id", "message:", err.Error())
		return
	}

	class, err := s.queries.GetClass(r.Context(), classID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}

	s.renderComponent(w, r, classes.EditClassForm(class))
}

// EditClass updates an existing class.
func (s *Server) EditClass(w http.ResponseWriter, r *http.Request) {
	classID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "wrong parameters")
		return
	}

	if err := r.ParseForm(); err != nil {
		writeError(w, http.StatusUnprocessableEntity, "wrong form params")
		return
	}

	name := r.FormValue("class_name")
	if name == "" {
		writeError(w, http.StatusBadRequest, "name cannot be empty")
		return
	}

	params := database.EditClassParams{
		ClassID: classID,
		Name:    name,
	}

	err = s.queries.EditClass(r.Context(), params)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}

	if r.Header.Get("HX-Request") != "" {
		w.Header().Set("HX-Redirect", "/academics/classes")
		w.WriteHeader(http.StatusOK)
		return
	}

	http.Redirect(w, r, "/academics/classes", http.StatusFound)
}

// DeleteClass removes a class.
func (s *Server) DeleteClass(w http.ResponseWriter, r *http.Request) {
	classID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "wrong parameters")
		return
	}

	err = s.queries.DeleteClass(r.Context(), classID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}

	if r.Header.Get("HX-Request") != "" {
		w.Header().Set("HX-Redirect", "/academics/classes")
		w.WriteHeader(http.StatusOK)
		return
	}

	http.Redirect(w, r, "/academics/classes", http.StatusFound)
}

// ShowCreateSubjectForm renders the form to create a new subject.
func (s *Server) ShowCreateSubjectForm(w http.ResponseWriter, r *http.Request) {
	classID := r.PathValue("id")
	s.renderComponent(w, r, classes.CreateSubjectForm(classID))
}

// CreateSubject creates a new subject for a given class.
func (s *Server) CreateSubject(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}

	if err := r.ParseForm(); err != nil {
		writeError(w, http.StatusUnprocessableEntity, "wrong parameters")
		return
	}

	classID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "invalid class")
		slog.Error("Invalid class id", "message:", err.Error())
		return
	}

	subjectName := r.FormValue("subject_name")
	if subjectName == "" {
		writeError(w, http.StatusBadRequest, "fields cannot be empty")
		return
	}

	class, err := s.queries.GetClass(r.Context(), classID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("Failed to get a class", "Message", err.Error())
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

	if r.Header.Get("HX-Request") != "" {
		w.Header().Set("HX-Redirect", "/academics/classes")
		w.WriteHeader(http.StatusOK)
		return
	}

	http.Redirect(w, r, "/academics/classes", http.StatusFound)
}

// ListSubjects renders a list of subjects for a specific class.
func (s *Server) ListSubjects(w http.ResponseWriter, r *http.Request) {
	classID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "bad request")
		slog.Error("failed to parse class id")
		return
	}

	subjectsList, err := s.queries.ListSubjects(r.Context(), classID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to retrieve subjects", "Message", err.Error())
		return
	}

	component := classes.SubjectsList(subjectsList)
	s.renderComponent(w, r, component)
}

// ShowEditSubject handler method renders EditSubjectForm
func (s *Server) ShowEditSubject(w http.ResponseWriter, r *http.Request) {
	subjectID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "invalid subject")
		slog.Error("failed to parse subject id", "message:", err.Error())
		return
	}

	subject, err := s.queries.GetSubject(r.Context(), subjectID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}

	s.renderComponent(w, r, classes.EditSubjectForm(subject))
}

// EditSubject updates an existing subject.
func (s *Server) EditSubject(w http.ResponseWriter, r *http.Request) {
	subjectID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "wrong parameters")
		return
	}

	if err := r.ParseForm(); err != nil {
		writeError(w, http.StatusUnprocessableEntity, "wrong parameters")
		return
	}
	name := r.FormValue("subject_name")
	if name == "" {
		writeError(w, http.StatusBadRequest, "subject name can't be empty")
		return
	}

	params := database.EditSubjectParams{
		SubjectID: subjectID,
		Name:      name,
	}

	err = s.queries.EditSubject(r.Context(), params)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("Error updating a subject", "message", err.Error())
		return
	}

	if r.Header.Get("HX-Request") != "" {
		w.Header().Set("HX-Redirect", "/academics/classes")
		w.WriteHeader(http.StatusOK)
		return
	}

	http.Redirect(w, r, "/academics/classes", http.StatusFound)
}

// DeleteSubject removes a subject.
func (s *Server) DeleteSubject(w http.ResponseWriter, r *http.Request) {
	subjectID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "wrong parameters")
		return
	}

	err = s.queries.DeleteSubject(r.Context(), subjectID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to delete subject", "message", err.Error())
		return
	}

	if r.Header.Get("HX-Request") != "" {
		w.Header().Set("HX-Redirect", "/academics/classes")
		w.WriteHeader(http.StatusOK)
		return
	}

	http.Redirect(w, r, "/academics/classes", http.StatusFound)
}
