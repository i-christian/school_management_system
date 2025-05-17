package server

import (
	"encoding/json"
	"log/slog"
	"net/http"

	"school_management_system/cmd/web/dashboard/grades"
	"school_management_system/internal/database"
)

type GradeEntry struct {
	Remark    string  `json:"remark"`
	SubjectID string  `json:"subject_id"`
	Score     float64 `json:"score"`
}

type StudentGrades struct {
	StudentID string       `json:"student_id"`
	Grades    []GradeEntry `json:"grades"`
}

type GradeSubmission struct {
	ClassID string          `json:"class_id"`
	TermID  string          `json:"term_id"`
	Grades  []StudentGrades `json:"grades"`
}

// SubmitGrades handles the HTTP request for submitting student grades.
// It decodes the incoming JSON payload, then inserts or updates the grade record for each student-subject combination.
// The function uses a transaction to ensure atomicity. On success, it returns a 201 Created status.
// On failure, it writes an appropriate error message and logs the error.
func (s *Server) SubmitGrades(w http.ResponseWriter, r *http.Request) {
	var submission GradeSubmission

	if err := json.NewDecoder(r.Body).Decode(&submission); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid request format")
		return
	}

	// Begin transaction
	tx, err := s.conn.Begin(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Failed to start transaction")
		slog.Error("failed to begin transaction", "error", err.Error())
		return
	}
	defer tx.Rollback(r.Context())

	for _, student := range submission.Grades {
		for _, grade := range student.Grades {
			_, err := tx.Exec(r.Context(),
				`INSERT INTO grades (student_id, subject_id, term_id, score, remark)
                 VALUES ($1, $2, $3, $4, $5)
                 ON CONFLICT (student_id, subject_id, term_id)
                 DO UPDATE SET score = EXCLUDED.score, remark = EXCLUDED.remark`,
				student.StudentID, grade.SubjectID, submission.TermID, grade.Score, grade.Remark,
			)
			if err != nil {
				writeError(w, http.StatusInternalServerError, "Failed to save grade")
				slog.Error("failed to save grade",
					"student_id", student.StudentID,
					"subject_id", grade.SubjectID,
					"error", err.Error(),
				)
				return
			}
		}
	}

	// Commit transaction
	if err := tx.Commit(r.Context()); err != nil {
		writeError(w, http.StatusInternalServerError, "Failed to commit transaction")
		slog.Error("failed to commit transaction", "error", err.Error())
		return
	}

	w.WriteHeader(http.StatusCreated)
}

// ListGrades handles HTTP requests for displaying student grades.
// It retrieves class subjects and student grade views from the database, organizes them into maps,
// and then builds a slice of ClassGradesData to render an HTML table of grades.
func (s *Server) ListGrades(w http.ResponseWriter, r *http.Request) {
	classSubjects, err := s.queries.ListAllSubjects(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to fetch classes", ":", err.Error())
		return
	}

	students, err := s.queries.ListGrades(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to fetch grades", "error", err.Error())
		return
	}

	classSubjectMap := make(map[string][]database.ListAllSubjectsRow)
	for _, subj := range classSubjects {
		classSubjectMap[subj.Classname] = append(classSubjectMap[subj.Classname], subj)
	}

	classStudentMap := make(map[string][]database.StudentGradesView)
	for _, student := range students {
		classStudentMap[student.ClassName] = append(classStudentMap[student.ClassName], student)
	}

	var classData []grades.ClassGradesData
	for class, stuList := range classStudentMap {
		classData = append(classData, grades.ClassGradesData{
			ClassName: class,
			Subjects:  classSubjectMap[class],
			Students:  stuList,
		})
	}

	s.renderComponent(w, r, grades.GradesList(classData))
}
