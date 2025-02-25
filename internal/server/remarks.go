package server

import (
	"fmt"
	"log/slog"
	"net/http"

	"school_management_system/cmd/web/dashboard/remarks"
	"school_management_system/internal/database"
)

// StudentsRemarks handler method renders RemarksPage component
func (s *Server) StudentsRemarks(w http.ResponseWriter, r *http.Request) {
	remarksData, err := s.queries.ListRemarksByClass(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get remarks")
		slog.Error("failed to get remarks data", "error", err.Error())
		return
	}

	s.renderComponent(w, r, remarks.RemarksPage(remarksData))
}

// StudentsDisciplinary handler method renders StudentsDisciplinary component
func (s *Server) StudentsDisciplinary(w http.ResponseWriter, r *http.Request) {
	disciplineData, err := s.queries.ListDisciplinaryRecords(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get disciplinary data")
		slog.Error("failed to get disciplinary data", "error", err.Error())
		return
	}

	s.renderComponent(w, r, remarks.DisciplinePage(disciplineData))
}

// ShowDisciplineForm handler method renders AddDisciplineRecordForm component
func (s *Server) ShowDisciplineForm(w http.ResponseWriter, r *http.Request) {
	s.renderComponent(w, r, remarks.AddDisciplineRecordForm())
}

// RenderStudentSearchResults returns html formated results
func RenderStudentSearchResults(w http.ResponseWriter, students []database.SearchStudentsByNameRow) {
	w.Header().Set("Content-Type", "text/html")
	for _, student := range students {
		fmt.Fprintf(w, `<div class="p-2 hover:bg-gray-200 cursor-pointer" 
			hx-on:click="document.getElementById('selected-student-id').value='%s'; 
			document.querySelector('input[name=search_student]').value='%s %s'; 
			document.getElementById('student-search-results').innerHTML='';">
			%s %s
		</div>`, student.StudentID, student.FirstName, student.LastName, student.FirstName, student.LastName)
	}
}

// SearchStudents handler method searches and renders searched results
func (s *Server) SearchStudents(w http.ResponseWriter, r *http.Request) {
	search := r.FormValue("search")
	parsedSearch := "%" + search + "%"

	studentes, err := s.queries.SearchStudentsByName(r.Context(), parsedSearch)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to find student")
		slog.Error("failed to find student", "error", err.Error())
		return
	}

	RenderStudentSearchResults(w, studentes)
}
