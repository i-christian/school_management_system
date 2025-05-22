package server

import (
	"log/slog"
	"net/http"

	"school_management_system/cmd/web/dashboard/classteachers"
	"school_management_system/internal/database"

	"github.com/google/uuid"
)

// showClassTeachers method renders ClassTeachers Component
func (s *Server) showClassTeachers(w http.ResponseWriter, r *http.Request) {
	classID := r.PathValue("class_id")
	parsedClassID, err := uuid.Parse(classID)
	if err != nil {
		writeError(w, http.StatusBadRequest, "bad request")
		return
	}

	classTeacher, err := s.queries.GetClassTeacher(r.Context(), parsedClassID)
	if err != nil {
		slog.Warn("no teachers have been set as class teachers")
	}

	s.renderComponent(w, r, classteachers.ClassTeachers(classTeacher, (classID)))
}

// showCreateClassTeacher method links a classteacher to a class
func (s *Server) showCreateClassTeacher(w http.ResponseWriter, r *http.Request) {
	classID := r.PathValue("class_id")

	teachers, err := s.queries.GetAllDBClassTeachers(r.Context())
	if err != nil {
		slog.Warn("no user with the role of classteacher found in the system", "error", err.Error())
	}

	s.renderComponent(w, r, classteachers.ClassTeacherForm(teachers, classID))
}

// assignClassTeacher accepts form data with teacher_id and class_id
// Initiates a database request to assign a teacher to a class.
func (s *Server) assignClassTeacher(w http.ResponseWriter, r *http.Request) {
	classID, err := uuid.Parse(r.PathValue("class_id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "bad request")
		return
	}

	err = r.ParseForm()
	if err != nil {
		writeError(w, http.StatusBadRequest, "bad request")
		return
	}

	teacherID := r.FormValue("teacher_id")
	parsedTeacherID, err := uuid.Parse(teacherID)
	if err != nil {
		writeError(w, http.StatusBadRequest, "failed to parse form")
		return
	}

	params := database.UpSertClassTeacherParams{
		TeacherID: parsedTeacherID,
		ClassID:   classID,
	}

	_, err = s.queries.UpSertClassTeacher(r.Context(), params)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to classteacher to a class", "error", err.Error())
		return
	}

	if r.Header.Get("HX-Request") != "" {
		w.Header().Set("HX-Redirect", "/academics/classes")
		w.WriteHeader(http.StatusOK)
		return
	}

	http.Redirect(w, r, "/academics/classes", http.StatusFound)
}

// showEditClassTeacher method renders the EditClassTeacher component
func (s *Server) showEditClassTeacher(w http.ResponseWriter, r *http.Request) {
	classID := r.PathValue("class_id")
	parsedClassID, err := uuid.Parse(classID)
	if err != nil {
		writeError(w, http.StatusBadRequest, "bad request")
		return
	}

	current, err := s.queries.GetClassTeacher(r.Context(), parsedClassID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("internal server error", "error", err.Error())
		return
	}

	teachers, err := s.queries.GetAllDBClassTeachers(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("internal server error", "error", err.Error())
		return
	}

	s.renderComponent(w, r, classteachers.EditClassTeacherForm(current, teachers))
}

// editClassTeacher accepts form data with teacher_id and class_id
// Initiates a database request to upsert a classteacher.
func (s *Server) editClassTeacher(w http.ResponseWriter, r *http.Request) {
	classID, err := uuid.Parse(r.PathValue("class_id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "bad request")
		return
	}

	err = r.ParseForm()
	if err != nil {
		writeError(w, http.StatusBadRequest, "bad request")
		return
	}

	teacherID := r.FormValue("teacher_id")
	parsedTeacherID, err := uuid.Parse(teacherID)
	if err != nil {
		writeError(w, http.StatusBadRequest, "failed to parse form")
		return
	}

	params := database.UpSertClassTeacherParams{
		TeacherID: parsedTeacherID,
		ClassID:   classID,
	}

	_, err = s.queries.UpSertClassTeacher(r.Context(), params)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to classteacher to a class", "error", err.Error())
		return
	}

	if r.Header.Get("HX-Request") != "" {
		w.Header().Set("HX-Redirect", "/academics/classes")
		w.WriteHeader(http.StatusOK)
		return
	}

	http.Redirect(w, r, "/academics/classes", http.StatusFound)
}
