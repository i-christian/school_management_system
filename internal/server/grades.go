package server

import (
	"log/slog"
	"net/http"
	"sort"

	"school_management_system/cmd/web/dashboard/grades"
)

// ListGrades handles HTTP requests and renders an HTML table displaying student grades.
func (s *Server) ListGrades(w http.ResponseWriter, r *http.Request) {
	students, err := s.queries.ListGrades(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to fetch grades", "error", err)
		return
	}

	subjectSet := make(map[string]struct{})
	for _, student := range students {
		for subj := range student.Grades {
			subjectSet[subj] = struct{}{}
		}
	}

	var subjects []string
	for subj := range subjectSet {
		subjects = append(subjects, subj)
	}
	sort.Strings(subjects)

	data := grades.GradesData{
		Subjects: subjects,
		Students: students,
	}

	s.renderComponent(w, r, grades.GradesList(data))
}
