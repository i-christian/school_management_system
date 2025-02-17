package server

import (
	"log/slog"
	"net/http"
	"strings"

	"school_management_system/cmd/web/components"
	"school_management_system/cmd/web/dashboard/assignments"
	"school_management_system/internal/database"
)

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
	subjectClass := r.FormValue("subject_class")

	parts := strings.Split(subjectClass, "=")
	if len(parts) != 2 {
		writeError(w, http.StatusBadRequest, "invalid subject and class selection")
		return
	}

	if teacherID == "" || subjectClass == "" {
		writeError(w, http.StatusUnprocessableEntity, "missing required fields")
		return
	}

	parsedTeacherID, err := convertStringToUUID(teacherID)
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid teacher ID")
		return
	}
	parsedSubjectID, err := convertStringToUUID(parts[0])
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid subject ID")
		return
	}

	parsedClassID, err := convertStringToUUID(parts[1])
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid class ID")
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
		w.Header().Set("HX-Redirect", "/academics/assignments")
		w.WriteHeader(http.StatusOK)
		return
	}
	http.Redirect(w, r, "/academics/assignments", http.StatusFound)
}

// Function to group assignments by teacher and then by class
func groupAssignments(assignments []database.ListAssignmentsRow) map[string]map[string][]database.ListAssignmentsRow {
	grouped := make(map[string]map[string][]database.ListAssignmentsRow)

	for _, assignment := range assignments {
		teacherKey := assignment.TeacherFirstname + " " + assignment.TeacherLastname
		classKey := assignment.Classroom

		if _, exists := grouped[teacherKey]; !exists {
			grouped[teacherKey] = make(map[string][]database.ListAssignmentsRow)
		}

		grouped[teacherKey][classKey] = append(grouped[teacherKey][classKey], assignment)
	}

	return grouped
}

// ListAssignments retrieves a list of assignments and renders them.
func (s *Server) ListAssignments(w http.ResponseWriter, r *http.Request) {
	assigns, err := s.queries.ListAssignments(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to list assignments", "error", err.Error())
		return
	}

	passedAssignments := groupAssignments(assigns)
	component := assignments.AssignmentsList(passedAssignments)
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

	s.renderComponent(w, r, assignments.EditAssignmentForm(assignment, teachers, subjects))
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
	subjectClass := r.FormValue("subject_class")

	parts := strings.Split(subjectClass, "=")
	if len(parts) != 2 {
		writeError(w, http.StatusBadRequest, "invalid subject and class selection")
		return
	}

	if teacherID == "" || subjectClass == "" {
		writeError(w, http.StatusUnprocessableEntity, "missing required fields")
		return
	}

	parsedTeacherID, err := convertStringToUUID(teacherID)
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid teacher ID")
		return
	}
	parsedSubjectID, err := convertStringToUUID(parts[0])
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid subject ID")
		return
	}

	parsedClassID, err := convertStringToUUID(parts[1])
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid class ID")
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

// getAssignedClasses returns classes assigned to a particular teacher
func (s *Server) getAssignedClasses(w http.ResponseWriter, r *http.Request) {
	user, ok := r.Context().Value(userContextKey).(User)
	if !ok {
		writeError(w, http.StatusUnauthorized, "unauthorized")
		slog.Error("Failed to get user context")
		return
	}

	classes, err := s.queries.GetAssignedClasses(r.Context(), user.UserID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("internal server error", "message", err.Error())
		return
	}

	component := components.AssignedClasses(classes)
	s.renderComponent(w, r, component)
}
