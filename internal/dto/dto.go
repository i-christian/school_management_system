package dto

import "github.com/google/uuid"

// Grade represents the grade details for a subject.
type Grade struct {
	Remark  string    `json:"remark"`
	Score   float64   `json:"score"`
	GradeID uuid.UUID `json:"grade_id"`
}

// GradesMap maps subject names to their corresponding grade details.
type GradesMap map[uuid.UUID]Grade
