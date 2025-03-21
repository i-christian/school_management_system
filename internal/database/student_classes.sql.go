// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: student_classes.sql

package database

import (
	"context"

	"github.com/google/uuid"
)

const createStudentClasses = `-- name: CreateStudentClasses :one
INSERT INTO student_classes (student_id, class_id, term_id)
VALUES ($1, $2, $3) RETURNING student_class_id, student_id, previous_class_id, class_id, term_id
`

type CreateStudentClassesParams struct {
	StudentID uuid.UUID `json:"student_id"`
	ClassID   uuid.UUID `json:"class_id"`
	TermID    uuid.UUID `json:"term_id"`
}

func (q *Queries) CreateStudentClasses(ctx context.Context, arg CreateStudentClassesParams) (StudentClass, error) {
	row := q.db.QueryRow(ctx, createStudentClasses, arg.StudentID, arg.ClassID, arg.TermID)
	var i StudentClass
	err := row.Scan(
		&i.StudentClassID,
		&i.StudentID,
		&i.PreviousClassID,
		&i.ClassID,
		&i.TermID,
	)
	return i, err
}

const deleteStudentClasses = `-- name: DeleteStudentClasses :exec
DELETE FROM student_classes WHERE student_class_id = $1
`

func (q *Queries) DeleteStudentClasses(ctx context.Context, studentClassID uuid.UUID) error {
	_, err := q.db.Exec(ctx, deleteStudentClasses, studentClassID)
	return err
}

const editStudentClasses = `-- name: EditStudentClasses :exec
UPDATE student_classes
SET class_id = COALESCE($2, class_id)
WHERE student_id = $1
`

type EditStudentClassesParams struct {
	StudentID uuid.UUID `json:"student_id"`
	ClassID   uuid.UUID `json:"class_id"`
}

func (q *Queries) EditStudentClasses(ctx context.Context, arg EditStudentClassesParams) error {
	_, err := q.db.Exec(ctx, editStudentClasses, arg.StudentID, arg.ClassID)
	return err
}
