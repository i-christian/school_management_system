// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: subjects.sql

package database

import (
	"context"

	"github.com/google/uuid"
)

const createSubject = `-- name: CreateSubject :exec
INSERT INTO
    subjects (class_id, name)
VALUES ($1, $2)
ON CONFLICT ON CONSTRAINT unique_subject_name_per_class DO NOTHING
`

type CreateSubjectParams struct {
	ClassID uuid.UUID `json:"class_id"`
	Name    string    `json:"name"`
}

func (q *Queries) CreateSubject(ctx context.Context, arg CreateSubjectParams) error {
	_, err := q.db.Exec(ctx, createSubject, arg.ClassID, arg.Name)
	return err
}

const deleteSubject = `-- name: DeleteSubject :exec
DELETE FROM subjects WHERE subject_id = $1
`

func (q *Queries) DeleteSubject(ctx context.Context, subjectID uuid.UUID) error {
	_, err := q.db.Exec(ctx, deleteSubject, subjectID)
	return err
}

const editSubject = `-- name: EditSubject :exec
UPDATE subjects
SET name = COALESCE($2, name)
WHERE subject_id = $1
`

type EditSubjectParams struct {
	SubjectID uuid.UUID `json:"subject_id"`
	Name      string    `json:"name"`
}

func (q *Queries) EditSubject(ctx context.Context, arg EditSubjectParams) error {
	_, err := q.db.Exec(ctx, editSubject, arg.SubjectID, arg.Name)
	return err
}

const listSubjects = `-- name: ListSubjects :many
SELECT
    subjects.subject_id,
    subjects.name AS SubjectName,
    classes.name AS ClassName
FROM subjects
INNER JOIN classes
    ON subjects.class_id = classes.class_id
GROUP BY classes.name
ORDER BY subjects.name
`

type ListSubjectsRow struct {
	SubjectID   uuid.UUID `json:"subject_id"`
	Subjectname string    `json:"subjectname"`
	Classname   string    `json:"classname"`
}

func (q *Queries) ListSubjects(ctx context.Context) ([]ListSubjectsRow, error) {
	rows, err := q.db.Query(ctx, listSubjects)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []ListSubjectsRow{}
	for rows.Next() {
		var i ListSubjectsRow
		if err := rows.Scan(&i.SubjectID, &i.Subjectname, &i.Classname); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}
