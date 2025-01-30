package server

import (
	"errors"
	"log/slog"
	"net/http"

	"school_management_system/internal/database"

	"github.com/google/uuid"
)

func convertStringToUUID(id string) (uuid.UUID, error) {
	if id == "" {
		return uuid.Nil, errors.New("an empty string can not be converted to a UUID")
	}

	newID, err := uuid.Parse(id)
	if err != nil {
		return uuid.Nil, err
	}
	return newID, nil
}

// CreateAssignment handler method
// A method accepts: classID, subjecID, and teacherID(userID)
// Uses these parameters to assign a teacher to a unique class plus subject combination.
func (s *Server) CreateAssignment(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}

	query := r.URL.Query()
	teacherID := query.Get("teacher_id")
	classID := query.Get("class_id")
	subjectID := query.Get("subject_id")

	if teacherID == "" || classID == "" || subjectID == " " {
		writeError(w, http.StatusUnprocessableEntity, "missing query parameters")
		return
	}

	parsedTeacherID, err := convertStringToUUID(teacherID)
	if err != nil {
		writeError(w, http.StatusBadRequest, "wrong teacher ID")
		return
	}

	parsedClassID, err := convertStringToUUID(classID)
	if err != nil {
		writeError(w, http.StatusBadRequest, "wrong class ID")
		return
	}

	parsedSubjectID, err := convertStringToUUID(subjectID)
	if err != nil {
		writeError(w, http.StatusBadRequest, "wrong subject ID")
		return
	}

	params := database.CreateAssignmentsParams{
		ClassID:   parsedClassID,
		SubjectID: parsedSubjectID,
		TeacherID: parsedTeacherID,
	}
	_, err = s.queries.CreateAssignments(r.Context(), params)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to assign teacher to class", "Message:", err.Error())
		return
	}
}

// ListAssignments handler method
// params: no parameters
// returns: a list of various teachers assignments
func (s *Server) ListAssignments(w http.ResponseWriter, r *http.Request) {
	// TODO: assignmentsData
	_, err := s.queries.ListAssignments(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to retrieve teacher class assignments", "Message:", err.Error())
		return
	}
}

// GetAssignment handler function
// Accepts a userID/teacherID
// Returns classes plus subjects assigned to said teacher
func (s *Server) GetAssignment(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	userID, err := convertStringToUUID(id)
	if err != nil {
		writeError(w, http.StatusBadRequest, "wrong parameters")
		return
	}

	// TODO: add assignments list here
	_, err = s.queries.GetAssignment(r.Context(), userID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to retrieve assignments", "message:", err.Error())
		return
	}
}

// EditAssignment handler method
// Accepts an assignment id param
// accepts query parameters
func (s *Server) EditAssignment(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	parsedassignID, err := convertStringToUUID(id)
	if err != nil {
		writeError(w, http.StatusBadRequest, "wrong parameters")
		return
	}

	query := r.URL.Query()
	teacherID := query.Get("teacher_id")
	classID := query.Get("class_id")
	subjectID := query.Get("subject_id")

	if teacherID == "" || classID == "" || subjectID == " " {
		writeError(w, http.StatusUnprocessableEntity, "missing query parameters")
		return
	}

	parsedTeacherID, err := convertStringToUUID(teacherID)
	if err != nil {
		writeError(w, http.StatusBadRequest, "wrong teacher ID")
		return
	}

	parsedClassID, err := convertStringToUUID(classID)
	if err != nil {
		writeError(w, http.StatusBadRequest, "wrong class ID")
		return
	}

	parsedSubjectID, err := convertStringToUUID(subjectID)
	if err != nil {
		writeError(w, http.StatusBadRequest, "wrong subject ID")
		return
	}

	params := database.EditAssignmentsParams{
		ID:        parsedassignID,
		ClassID:   parsedClassID,
		SubjectID: parsedSubjectID,
		TeacherID: parsedTeacherID,
	}

	err = s.queries.EditAssignments(r.Context(), params)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to update assignment", "message:", err.Error())
		return
	}
}

// DeleteAssignment handler method
// Accepts id path param
func (s *Server) DeleteAssignment(w http.ResponseWriter, r *http.Request) {
	assignID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid user id")
		return
	}

	err = s.queries.DeleteAssignments(r.Context(), assignID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to remove assignment", "message:", err.Error())
		return
	}
}
