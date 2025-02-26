package server

import (
	"log/slog"
	"net/http"
	"sort"

	"school_management_system/cmd/web/dashboard/reports"
	"school_management_system/internal/database"

	"github.com/google/uuid"
)

// getClassroomData groups students by class and returns structured data.
func getClassroomData(students []database.ListStudentsRow) []reports.ClassRoomData {
	classMap := make(map[string]*reports.ClassRoomData)

	for _, student := range students {
		className := student.Classname.String

		if _, ok := classMap[className]; !ok {
			classID, _ := uuid.FromBytes(student.ClassID.Bytes[:])
			classMap[className] = &reports.ClassRoomData{
				ClassID:   classID,
				ClassName: className,
				Students:  []database.ListStudentsRow{},
			}
		}

		classMap[className].Students = append(classMap[className].Students, student)
	}

	classRooms := make([]reports.ClassRoomData, 0, len(classMap))
	for _, classData := range classMap {
		classRooms = append(classRooms, *classData)
	}

	sort.Slice(classRooms, func(i, j int) bool {
		return classRooms[i].ClassName < classRooms[j].ClassName
	})

	return classRooms
}

// ShowClassReports renders a report for a specific class.
func (s *Server) ShowClassReports(w http.ResponseWriter, r *http.Request) {
	classID, err := uuid.Parse(r.PathValue("classID"))
	if err != nil {
		http.Error(w, "Invalid class ID", http.StatusBadRequest)
		return
	}

	students, err := s.queries.ListStudents(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to retrieve students")
		slog.Error("failed to retrieve students", "error", err.Error())
		return
	}

	classRooms := getClassroomData(students)

	for _, classData := range classRooms {
		if classData.ClassID == classID {
			s.renderComponent(w, r, reports.ClassReportTable(classData))
			return
		}
	}

	writeError(w, http.StatusNotFound, "class not found or has no students")
}

// ShowStudentsReports renders all students grouped by class.
func (s *Server) ShowStudentsReports(w http.ResponseWriter, r *http.Request) {
	students, err := s.queries.ListStudents(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to retrieve students")
		slog.Error("failed to retrieve students", "error", err.Error())
		return
	}

	classRooms := getClassroomData(students)
	s.renderComponent(w, r, reports.ReportsList(classRooms))
}
