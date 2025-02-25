package server

import (
	"fmt"
	"log/slog"
	"net/http"
	"time"

	"school_management_system/cmd/web/dashboard/remarks"
	"school_management_system/internal/database"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
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
			hx-on:click="
				document.getElementById('selected-student-id').value='%s'; 
				document.querySelector('input[name=search]').value='%s %s';
				document.querySelector('input[name=search]').setAttribute('readonly', true);
				document.getElementById('student-search-results').innerHTML='';
			">
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

// SubmitDisplinaryRecord handler method accepts form data and submits data to the database
func (s *Server) SubmitDisplinaryRecord(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		writeError(w, http.StatusBadRequest, "Invalid form submission")
		slog.Error("failed to parse form", "error", err.Error())
		return
	}

	// Extract form values
	studentID, err := uuid.Parse(r.FormValue("student_id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "Invalid student ID")
		slog.Error("invalid student ID", "error", err.Error())
		return
	}

	date, err := time.Parse("2006-01-02", r.FormValue("date"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "Invalid date format")
		slog.Error("invalid date format", "error", err.Error())
		return
	}

	description := r.FormValue("description")
	actionTaken := r.FormValue("action_taken")
	notes := r.FormValue("notes")

	reportedBy, ok := r.Context().Value(userContextKey).(User)
	if !ok {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Info("failed to get user ID")
		return
	}

	term, err := s.queries.GetCurrentTerm(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to get current term", "error", err.Error())
		return
	}

	record := database.UpsertDisciplinaryRecordParams{
		StudentID:   studentID,
		TermID:      term.TermID,
		Date:        pgtype.Date{Time: date, Valid: true},
		Description: description,
		ActionTaken: pgtype.Text{String: actionTaken, Valid: actionTaken != ""},
		ReportedBy:  reportedBy.UserID,
		Notes:       pgtype.Text{String: notes, Valid: notes != ""},
	}

	_, err = s.queries.UpsertDisciplinaryRecord(r.Context(), record)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Failed to save disciplinary record")
		slog.Error("failed to insert disciplinary record", "error", err.Error())
		return
	}

	http.Redirect(w, r, "/discipline", http.StatusSeeOther)
}
