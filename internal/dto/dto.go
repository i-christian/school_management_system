package dto

// Grade represents the grade details for a subject.
type Grade struct {
	GradeID *int     `json:"grade_id"`
	Score   *float64 `json:"score"`
	Remark  *string  `json:"remark"`
}

// GradesMap maps subject names to their corresponding grade details.
type GradesMap map[string]Grade
