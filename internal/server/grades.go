package server

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"

	"school_management_system/cmd/web/dashboard/grades"
	"school_management_system/internal/database"

	"github.com/google/uuid"
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

// PivotClassRoom pivots classroom data from the database into a slice of GradeEntryData.
// It aggregates subjects and students per class from the given rows, ensuring no duplicates in the lists.
// This transformed data is then used to render the grade entry form.
func PivotClassRoom(rows []database.RetrieveClassRoomRow) []grades.GradeEntryData {
	classMap := make(map[uuid.UUID]*grades.GradeEntryData)

	for _, row := range rows {
		entry, exists := classMap[row.ClassID]
		if !exists {
			entry = &grades.GradeEntryData{
				ClassID:        row.ClassID,
				ClassName:      row.ClassName,
				TermID:         row.TermID,
				TermName:       row.TermName,
				AcademicYearID: row.AcademicYearID,
				TeacherID:      row.TeacherID,
				TeacherName:    fmt.Sprintf("%v", row.TeacherName),
				Subjects:       []grades.Subject{},
				Students:       []grades.Student{},
			}
			classMap[row.ClassID] = entry
		}

		// Add subject if not already in list.
		subjectExists := false
		for _, subj := range entry.Subjects {
			if subj.SubjectID == row.SubjectID {
				subjectExists = true
				break
			}
		}
		if !subjectExists {
			entry.Subjects = append(entry.Subjects, grades.Subject{
				SubjectID:   row.SubjectID,
				SubjectName: row.SubjectName,
			})
		}

		studentExists := false
		for _, stu := range entry.Students {
			if stu.StudentID == row.StudentID {
				studentExists = true
				break
			}
		}
		if !studentExists {
			entry.Students = append(entry.Students, grades.Student{
				StudentID:   row.StudentID,
				StudentNo:   row.StudentNo,
				StudentName: fmt.Sprintf("%v", row.StudentName),
			})
		}
	}

	results := make([]grades.GradeEntryData, 0, len(classMap))
	for _, v := range classMap {
		results = append(results, *v)
	}

	return results
}

// MyClasses handles HTTP requests for displaying the teacher's classes for grade entry.
// It extracts the teacher's user ID from the context, retrieves classroom data, pivots the data into a suitable format,
// and renders the grade entry form component.
func (s *Server) MyClasses(w http.ResponseWriter, r *http.Request) {
	teacher, ok := r.Context().Value(userContextKey).(User)
	if !ok {
		writeError(w, http.StatusForbidden, "forbidden")
		slog.Error("failed to read user ID from context")
		return
	}

	classRoom, err := s.queries.RetrieveClassRoom(r.Context(), teacher.UserID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to get classroom data", "error", err.Error())
		return
	}

	GradeEntryData := PivotClassRoom(classRoom)
	s.renderComponent(w, r, grades.EnterGradesForm(GradeEntryData))
}

// GetClassForm serves the grade entry form for a specific class.
// It parses the classID from the URL, validates the teacher's context, and retrieves both classroom data and the current grades for the class.
// If a matching class is found, it renders the grade entry form pre-populated with existing grade data; otherwise, it returns a 404 error.
func (s *Server) GetClassForm(w http.ResponseWriter, r *http.Request) {
	classID, err := uuid.Parse(r.PathValue("classID"))
	if err != nil {
		http.Error(w, "Invalid class ID", http.StatusBadRequest)
		return
	}

	teacher, ok := r.Context().Value(userContextKey).(User)
	if !ok {
		writeError(w, http.StatusForbidden, "forbidden")
		slog.Error("failed to read user ID from context")
		return
	}

	if teacher.Role == "admin" {
		writeError(w, http.StatusForbidden, "user does not teach any class")
		return
	}

	classRoom, err := s.queries.RetrieveClassRoom(r.Context(), teacher.UserID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to get classroom data", "error", err.Error())
		return
	}

	currentGrades, err := s.queries.ListGradesForClass(r.Context(), classID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to get grades", "error", err.Error())
		return
	}

	gradeEntryData := PivotClassRoom(classRoom)
	for _, class := range gradeEntryData {
		if class.ClassID == classID {
			s.renderComponent(w, r, grades.EnterGradesFormSingle(class, currentGrades))
			return
		}
	}

	writeError(w, http.StatusNotFound, "class not found")
}
