// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: grades.sql

package database

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

const listGrades = `-- name: ListGrades :many
SELECT student_id, student_no, last_name, first_name, middle_name, class_id, class_name, grades
FROM student_grades_view
ORDER BY class_name, student_no
`

func (q *Queries) ListGrades(ctx context.Context) ([]StudentGradesView, error) {
	rows, err := q.db.Query(ctx, listGrades)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []StudentGradesView{}
	for rows.Next() {
		var i StudentGradesView
		if err := rows.Scan(
			&i.StudentID,
			&i.StudentNo,
			&i.LastName,
			&i.FirstName,
			&i.MiddleName,
			&i.ClassID,
			&i.ClassName,
			&i.Grades,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const listGradesForClass = `-- name: ListGradesForClass :many
SELECT 
    sc.class_id,
    s.student_id,
    subj.subject_id,
    g.score,
    g.remark,
    sc.term_id
FROM student_classes sc
JOIN students s ON sc.student_id = s.student_id
JOIN subjects subj ON subj.class_id = sc.class_id
LEFT JOIN grades g 
  ON g.student_id = s.student_id 
  AND g.subject_id = subj.subject_id 
  AND g.term_id = sc.term_id
WHERE sc.class_id = $1
`

type ListGradesForClassRow struct {
	ClassID   uuid.UUID      `json:"class_id"`
	StudentID uuid.UUID      `json:"student_id"`
	SubjectID uuid.UUID      `json:"subject_id"`
	Score     pgtype.Numeric `json:"score"`
	Remark    pgtype.Text    `json:"remark"`
	TermID    uuid.UUID      `json:"term_id"`
}

func (q *Queries) ListGradesForClass(ctx context.Context, classID uuid.UUID) ([]ListGradesForClassRow, error) {
	rows, err := q.db.Query(ctx, listGradesForClass, classID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []ListGradesForClassRow{}
	for rows.Next() {
		var i ListGradesForClassRow
		if err := rows.Scan(
			&i.ClassID,
			&i.StudentID,
			&i.SubjectID,
			&i.Score,
			&i.Remark,
			&i.TermID,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const retrieveClassRoom = `-- name: RetrieveClassRoom :many
SELECT
    vc.class_id,
    vc.class_name,
    vc.subject_id,
    vc.subject_name,
    vc.student_id,
    vc.student_no,
    vc.student_name,
    vc.teacher_id,
    vc.teacher_name,
    vc.term_id,
    vc.term_name,
    vc.academic_year_id
FROM virtual_classroom vc
WHERE vc.teacher_id = $1
ORDER BY vc.class_name, vc.student_no
`

type RetrieveClassRoomRow struct {
	ClassID        uuid.UUID   `json:"class_id"`
	ClassName      string      `json:"class_name"`
	SubjectID      uuid.UUID   `json:"subject_id"`
	SubjectName    string      `json:"subject_name"`
	StudentID      uuid.UUID   `json:"student_id"`
	StudentNo      string      `json:"student_no"`
	StudentName    interface{} `json:"student_name"`
	TeacherID      uuid.UUID   `json:"teacher_id"`
	TeacherName    interface{} `json:"teacher_name"`
	TermID         uuid.UUID   `json:"term_id"`
	TermName       string      `json:"term_name"`
	AcademicYearID uuid.UUID   `json:"academic_year_id"`
}

func (q *Queries) RetrieveClassRoom(ctx context.Context, teacherID uuid.UUID) ([]RetrieveClassRoomRow, error) {
	rows, err := q.db.Query(ctx, retrieveClassRoom, teacherID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []RetrieveClassRoomRow{}
	for rows.Next() {
		var i RetrieveClassRoomRow
		if err := rows.Scan(
			&i.ClassID,
			&i.ClassName,
			&i.SubjectID,
			&i.SubjectName,
			&i.StudentID,
			&i.StudentNo,
			&i.StudentName,
			&i.TeacherID,
			&i.TeacherName,
			&i.TermID,
			&i.TermName,
			&i.AcademicYearID,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const upsertGrade = `-- name: UpsertGrade :one
INSERT INTO grades (student_id, subject_id, term_id, score, remark)
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (student_id, subject_id, term_id)
DO UPDATE SET 
    score = EXCLUDED.score,
    remark = EXCLUDED.remark
RETURNING grade_id, student_id, subject_id, term_id, score, remark
`

type UpsertGradeParams struct {
	StudentID uuid.UUID      `json:"student_id"`
	SubjectID uuid.UUID      `json:"subject_id"`
	TermID    uuid.UUID      `json:"term_id"`
	Score     pgtype.Numeric `json:"score"`
	Remark    pgtype.Text    `json:"remark"`
}

func (q *Queries) UpsertGrade(ctx context.Context, arg UpsertGradeParams) (Grade, error) {
	row := q.db.QueryRow(ctx, upsertGrade,
		arg.StudentID,
		arg.SubjectID,
		arg.TermID,
		arg.Score,
		arg.Remark,
	)
	var i Grade
	err := row.Scan(
		&i.GradeID,
		&i.StudentID,
		&i.SubjectID,
		&i.TermID,
		&i.Score,
		&i.Remark,
	)
	return i, err
}
