package server

import (
	"log/slog"
	"net/http"
	"sort"
	"strconv"

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
		writeError(w, http.StatusInternalServerError, "failed to retrieve fees records")
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

// ShowSetTuition handler method used to create a fees structure for a given
func (s *Server) ShowSetTuition(w http.ResponseWriter, r *http.Request) {
	classes, err := s.queries.ListClasses(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get class list")
		slog.Error("failed to get class list", "error", err.Error())
		return
	}

	s.renderComponent(w, r, fees.CreateStructure(classes))
}

// SetFeesStructure handler method creates a fees structure for a given class using the current academic term
func (s *Server) SetFeesStructure(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "wrong parameters")
		slog.Error("failed to parse form data", "error", err.Error())
		return
	}

	classID := r.FormValue("class_id")
	required := r.FormValue("required")

	parsedClassID, err := uuid.Parse(classID)
	if err != nil {
		writeError(w, http.StatusBadRequest, "bad class ID")
		slog.Error("failed to parse class ID", "error", err.Error())
		return
	}

	parsedRequired, err := strconv.ParseFloat(required, 64)
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "failed to parse tuition")
		return
	}

	term, err := s.queries.GetCurrentTerm(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "active current term not set")
		slog.Error("failed to find current term", "error", err.Error())
		return
	}

	const query = `
		INSERT INTO fee_structure (term_id, class_id, required)
			VALUES ($1, $2, $3)
		ON CONFLICT (term_id, class_id)
  			DO UPDATE SET required = EXCLUDED.required`

	_, err = s.conn.Exec(r.Context(), query, term.TermID, parsedClassID, parsedRequired)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to create fee structure")
		slog.Error("failed to save grade", "termID", term.TermID, "classID", parsedClassID, "required tuition", parsedRequired, "error", err.Error())
		return
	}

	if r.Header.Get("HX-Request") != "" {
		w.Header().Set("HX-Redirect", "/fees")
		w.WriteHeader(http.StatusOK)
		return
	}
	http.Redirect(w, r, "/fees", http.StatusFound)
}

// ShowCreateFeesRecord renders the form to create a new fees record for a class.
func (s *Server) ShowCreateFeesRecord(w http.ResponseWriter, r *http.Request) {
	classID, err := uuid.Parse(r.PathValue("classID"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid class ID")
		return
	}

	students, err := s.queries.ListStudentsByClassForTerm(r.Context(), classID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to get students for class")
		slog.Error("failed to get students for class", "classID", classID, "error", err.Error())
		return
	}

	feeStructure, err := s.queries.GetFeeStructureByTermAndClass(r.Context(), classID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to find fee structure for this class")
		slog.Error("failed to find fee structure for this class", "error", err.Error())
		return
	}

	s.renderComponent(w, r, fees.CreateFeesRecordForm(feeStructure.FeeStructureID.String(), students, classID.String()))
}

// SaveFeesRecord handles the submission of the create fees record form.
func (s *Server) SaveFeesRecord(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "wrong parameters")
		slog.Error("failed to parse form data", "error", err.Error())
		return
	}

	feeStructureID := r.FormValue("fee_structure_id")
	studentID := r.FormValue("student_id")
	paid := r.FormValue("paid")

	parsedFeeStructureID, err := uuid.Parse(feeStructureID)
	if err != nil {
		writeError(w, http.StatusBadRequest, "bad class ID")
		slog.Error("failed to parse class ID", "error", err.Error())
		return
	}
	parsedStudentID, err := uuid.Parse(studentID)
	if err != nil {
		writeError(w, http.StatusBadRequest, "bad student ID")
		slog.Error("failed to parse student ID", "error", err.Error())
		return
	}

	parsedPaid, err := strconv.ParseFloat(paid, 64)
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "invalid paid amount")
		slog.Error("failed to parse paid amount", "error", err.Error())
		return
	}

	const query = `INSERT INTO fees (fee_structure_id, student_id, paid) VALUES ($1, $2, $3)`

	_, err = s.conn.Exec(r.Context(), query, parsedFeeStructureID, parsedStudentID, parsedPaid)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to create fees record")
		slog.Error("failed to create fees record", "parsedFeeStructureID", parsedFeeStructureID, "studentID", parsedStudentID, "paid", parsedPaid, "error", err.Error())
		return
	}

	if r.Header.Get("HX-Request") != "" {
		w.Header().Set("HX-Redirect", "/fees")
		w.WriteHeader(http.StatusOK)
		return
	}

	http.Redirect(w, r, "/fees", http.StatusFound)
}
