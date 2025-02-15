package server

import (
	"errors"
	"log/slog"
	"net/http"

	"school_management_system/cmd/web/dashboard/assignments"
	"school_management_system/internal/database"

	"github.com/google/uuid"
)

func convertStringToUUID(id string) (uuid.UUID, error) {
	if id == "" {
		return uuid.Nil, errors.New("an empty string cannot be converted to a UUID")
	}
	return uuid.Parse(id)
}

// ShowCreateAssignmentForm renders the form to create a new assignment with dropdowns.
func (s *Server) ShowCreateAssignmentForm(w http.ResponseWriter, r *http.Request) {
	teachers, err := s.queries.ListUsers(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to retrieve teachers")
		return
	}

	subjects, err := s.queries.ListAllSubjects(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to retrieve subjects")
		return
	}

	s.renderComponent(w, r, assignments.AssignmentForm(teachers, subjects))
}

// CreateAssignment handles POST requests to create an assignment.
// It reads form values for teacher_id, class_id, and subject_id.
func (s *Server) CreateAssignment(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	if err := r.ParseForm(); err != nil {
		writeError(w, http.StatusUnprocessableEntity, "failed to parse form")
		return
	}

	teacherID := r.FormValue("teacher_id")
	classID := r.FormValue("class_id")
	subjectID := r.FormValue("subject_id")

	if teacherID == "" || classID == "" || subjectID == "" {
		writeError(w, http.StatusUnprocessableEntity, "missing required fields")
		return
	}

	parsedTeacherID, err := convertStringToUUID(teacherID)
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid teacher ID")
		return
	}
	parsedClassID, err := convertStringToUUID(classID)
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid class ID")
		return
	}
	parsedSubjectID, err := convertStringToUUID(subjectID)
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid subject ID")
		return
	}

	params := database.CreateAssignmentsParams{
		TeacherID: parsedTeacherID,
		ClassID:   parsedClassID,
		SubjectID: parsedSubjectID,
	}
	_, err = s.queries.CreateAssignments(r.Context(), params)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to create assignment", "error", err.Error())
		return
	}

	if r.Header.Get("HX-Request") != "" {
		w.Header().Set("HX-Redirect", "/assignments")
		w.WriteHeader(http.StatusOK)
		return
	}
	http.Redirect(w, r, "/assignments", http.StatusFound)
}

// ListAssignments retrieves a list of assignments and renders them.
func (s *Server) ListAssignments(w http.ResponseWriter, r *http.Request) {
	assigns, err := s.queries.ListAssignments(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to list assignments", "error", err.Error())
		return
	}
	component := assignments.AssignmentsList(assigns)
	s.renderComponent(w, r, component)
}

// ShowEditAssignment renders the edit form for a specific assignment.
func (s *Server) ShowEditAssignment(w http.ResponseWriter, r *http.Request) {
	assignmentID, err := convertStringToUUID(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid assignment ID")
		return
	}

	assignment, err := s.queries.GetAssignment(r.Context(), assignmentID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to retrieve assignment", "error", err.Error())
		return
	}

	s.renderComponent(w, r, assignments.EditAssignmentForm(assignment))
}

// EditAssignment handles form submission to update an assignment.
func (s *Server) EditAssignment(w http.ResponseWriter, r *http.Request) {
	assignmentID, err := convertStringToUUID(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid assignment ID")
		return
	}
	if err := r.ParseForm(); err != nil {
		writeError(w, http.StatusUnprocessableEntity, "failed to parse form")
		return
	}

	teacherID := r.FormValue("teacher_id")
	classID := r.FormValue("class_id")
	subjectID := r.FormValue("subject_id")

	if teacherID == "" || classID == "" || subjectID == "" {
		writeError(w, http.StatusUnprocessableEntity, "missing required fields")
		return
	}

	parsedTeacherID, err := convertStringToUUID(teacherID)
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid teacher ID")
		return
	}
	parsedClassID, err := convertStringToUUID(classID)
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid class ID")
		return
	}
	parsedSubjectID, err := convertStringToUUID(subjectID)
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid subject ID")
		return
	}

	params := database.EditAssignmentsParams{
		ID:        assignmentID,
		TeacherID: parsedTeacherID,
		ClassID:   parsedClassID,
		SubjectID: parsedSubjectID,
	}
	err = s.queries.EditAssignments(r.Context(), params)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to edit assignment", "error", err.Error())
		return
	}

	if r.Header.Get("HX-Request") != "" {
		w.Header().Set("HX-Redirect", "/academics/assignments")
		w.WriteHeader(http.StatusOK)
		return
	}
	http.Redirect(w, r, "/academics/assignments", http.StatusFound)
}

// DeleteAssignment removes an assignment.
func (s *Server) DeleteAssignment(w http.ResponseWriter, r *http.Request) {
	assignmentID, err := convertStringToUUID(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid assignment ID")
		return
	}
	err = s.queries.DeleteAssignments(r.Context(), assignmentID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to delete assignment", "error", err.Error())
		return
	}

	if r.Header.Get("HX-Request") != "" {
		w.Header().Set("HX-Redirect", "/academics/assignments")
		w.WriteHeader(http.StatusOK)
		return
	}
	http.Redirect(w, r, "/academics/assignments", http.StatusFound)
}
