// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: remarks.sql

package database

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
)

const createRemark = `-- name: CreateRemark :one
INSERT INTO remarks (student_id, term_id, content_class_teacher, content_head_teacher) 
VALUES ($1, $2, $3, $4) RETURNING remarks_id, student_id, term_id, content_class_teacher, content_head_teacher, updated_at
`

type CreateRemarkParams struct {
	StudentID           pgtype.UUID
	TermID              pgtype.UUID
	ContentClassTeacher pgtype.Text
	ContentHeadTeacher  pgtype.Text
}

func (q *Queries) CreateRemark(ctx context.Context, arg CreateRemarkParams) (Remark, error) {
	row := q.db.QueryRow(ctx, createRemark,
		arg.StudentID,
		arg.TermID,
		arg.ContentClassTeacher,
		arg.ContentHeadTeacher,
	)
	var i Remark
	err := row.Scan(
		&i.RemarksID,
		&i.StudentID,
		&i.TermID,
		&i.ContentClassTeacher,
		&i.ContentHeadTeacher,
		&i.UpdatedAt,
	)
	return i, err
}

const deleteRemark = `-- name: DeleteRemark :exec
DELETE FROM remarks WHERE remarks_id = $1
`

func (q *Queries) DeleteRemark(ctx context.Context, remarksID pgtype.UUID) error {
	_, err := q.db.Exec(ctx, deleteRemark, remarksID)
	return err
}

const editRemark = `-- name: EditRemark :exec
UPDATE remarks
SET term_id = COALESCE($2, term_id),
content_class_teacher = COALESCE($3, content_class_teacher),
content_head_teacher = COALESCE($4, content_head_teacher)
WHERE remarks_id = $1
`

type EditRemarkParams struct {
	RemarksID           pgtype.UUID
	TermID              pgtype.UUID
	ContentClassTeacher pgtype.Text
	ContentHeadTeacher  pgtype.Text
}

func (q *Queries) EditRemark(ctx context.Context, arg EditRemarkParams) error {
	_, err := q.db.Exec(ctx, editRemark,
		arg.RemarksID,
		arg.TermID,
		arg.ContentClassTeacher,
		arg.ContentHeadTeacher,
	)
	return err
}

const getRemark = `-- name: GetRemark :one
SELECT remarks_id, student_id, term_id, content_class_teacher, content_head_teacher, updated_at FROM remarks WHERE student_id = $1
`

func (q *Queries) GetRemark(ctx context.Context, studentID pgtype.UUID) (Remark, error) {
	row := q.db.QueryRow(ctx, getRemark, studentID)
	var i Remark
	err := row.Scan(
		&i.RemarksID,
		&i.StudentID,
		&i.TermID,
		&i.ContentClassTeacher,
		&i.ContentHeadTeacher,
		&i.UpdatedAt,
	)
	return i, err
}

const listRemarks = `-- name: ListRemarks :many
SELECT remarks_id, student_id, term_id, content_class_teacher, content_head_teacher, updated_at FROM remarks
`

func (q *Queries) ListRemarks(ctx context.Context) ([]Remark, error) {
	rows, err := q.db.Query(ctx, listRemarks)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Remark
	for rows.Next() {
		var i Remark
		if err := rows.Scan(
			&i.RemarksID,
			&i.StudentID,
			&i.TermID,
			&i.ContentClassTeacher,
			&i.ContentHeadTeacher,
			&i.UpdatedAt,
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