package server

import (
	"fmt"
	"log/slog"
	"net/http"

	"school_management_system/cmd/web/dashboard/myclasses"
	"school_management_system/internal/database"

	"github.com/google/uuid"
)

// PivotClassRoom pivots classroom data from the database into a slice of GradeEntryData.
// It aggregates subjects and students per class from the given rows, ensuring no duplicates in the lists.
// This transformed data is then used to render the grade entry form.
func PivotClassRoom(rows []database.RetrieveClassRoomRow) []myclasses.GradeEntryData {
	classMap := make(map[uuid.UUID]*myclasses.GradeEntryData)

	for _, row := range rows {
		entry, exists := classMap[row.ClassID]
		if !exists {
			entry = &myclasses.GradeEntryData{
				ClassID:        row.ClassID,
				ClassName:      row.ClassName,
				TermID:         row.TermID,
				TermName:       row.TermName,
				AcademicYearID: row.AcademicYearID,
				TeacherID:      row.TeacherID,
				TeacherName:    fmt.Sprintf("%v", row.TeacherName),
				Subjects:       []myclasses.Subject{},
				Students:       []myclasses.Student{},
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
			entry.Subjects = append(entry.Subjects, myclasses.Subject{
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
			entry.Students = append(entry.Students, myclasses.Student{
				StudentID:   row.StudentID,
				StudentNo:   row.StudentNo,
				StudentName: fmt.Sprintf("%v", row.StudentName),
			})
		}
	}

	results := make([]myclasses.GradeEntryData, 0, len(classMap))
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

	s.renderComponent(w, r, myclasses.MyClassesGradesForm(GradeEntryData))
}

// GetClassForm serves the grade entry form for a specific class.
// It parses the classID from the URL, validates the teacher's context, and retrieves both classroom data and the current myclasses for the class.
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

	if teacher.Role == "admin" || teacher.Role == "accountant" || teacher.Role == "headteacher" {
		writeError(w, http.StatusForbidden, "user does not teach any class")
		return
	}

	classRoom, err := s.queries.RetrieveClassRoom(r.Context(), teacher.UserID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to get classroom data", "error", err.Error())
		return
	}

	currentmyclasses, err := s.queries.ListGradesForClass(r.Context(), classID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		slog.Error("failed to get myclasses", "error", err.Error())
		return
	}

	gradeEntryData := PivotClassRoom(classRoom)
	for _, class := range gradeEntryData {
		if class.ClassID == classID {
			s.renderComponent(w, r, myclasses.MyClassesGradesFormSingle(class, currentmyclasses))
			return
		}
	}

	writeError(w, http.StatusNotFound, "class not found")
}
