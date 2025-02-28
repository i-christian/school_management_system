package server

import (
	"log/slog"
	"net/http"
	"sort"

	"school_management_system/cmd/web/dashboard/fees"
	"school_management_system/internal/database"

	"github.com/google/uuid"
)

// getFeesData groups fee records by class.
func getFeesData(records []database.ListStudentFeesRecordsRow) []fees.ClassRoomData {
	classMap := make(map[string]*fees.ClassRoomData)

	for _, record := range records {
		key := record.Classname
		if _, exists := classMap[key]; !exists {
			classMap[key] = &fees.ClassRoomData{
				ClassID:         record.ClassID,
				ClassName:       key,
				RequiredTuition: record.Tuitionamount,
				Students:        []database.ListStudentFeesRecordsRow{},
			}
		}
		classMap[key].Students = append(classMap[key].Students, record)
	}

	classRooms := make([]fees.ClassRoomData, 0, len(classMap))
	for _, cr := range classMap {
		classRooms = append(classRooms, *cr)
	}

	sort.Slice(classRooms, func(i, j int) bool {
		return classRooms[i].ClassName < classRooms[j].ClassName
	})

	return classRooms
}

// ShowClassFees renders the fee records for a specific class.
func (s *Server) ShowClassFees(w http.ResponseWriter, r *http.Request) {
	classID, err := uuid.Parse(r.PathValue("classID"))
	if err != nil {
		http.Error(w, "Invalid class ID", http.StatusBadRequest)
		return
	}

	records, err := s.queries.ListStudentFeesRecords(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to retrieve fee records")
		slog.Error("failed to retrieve fee records", "error", err.Error())
		return
	}

	classRooms := getFeesData(records)
	for _, classData := range classRooms {
		if classData.ClassID == classID {
			s.renderComponent(w, r, fees.ClassFeesTable(classData))
			return
		}
	}

	writeError(w, http.StatusNotFound, "class not found or has no fee records")
}

// ShowFeesList renders fee records for all classes.
func (s *Server) ShowFeesList(w http.ResponseWriter, r *http.Request) {
	records, err := s.queries.ListStudentFeesRecords(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to retrieve fee records")
		slog.Error("failed to retrieve fee records", "error", err.Error())
		return
	}

	classRooms := getFeesData(records)
	s.renderComponent(w, r, fees.FeesList(classRooms))
}
