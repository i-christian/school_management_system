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
