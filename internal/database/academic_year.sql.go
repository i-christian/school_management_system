// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: academic_year.sql

package database

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
)

const createAcademicYear = `-- name: CreateAcademicYear :one
INSERT INTO academic_year (name, start_date, end_date) 
VALUES ($1, $2, $3)
RETURNING academic_year_id
`

type CreateAcademicYearParams struct {
	Name      string
	StartDate pgtype.Date
	EndDate   pgtype.Date
}

func (q *Queries) CreateAcademicYear(ctx context.Context, arg CreateAcademicYearParams) (pgtype.UUID, error) {
	row := q.db.QueryRow(ctx, createAcademicYear, arg.Name, arg.StartDate, arg.EndDate)
	var academic_year_id pgtype.UUID
	err := row.Scan(&academic_year_id)
	return academic_year_id, err
}

const createTerm = `-- name: CreateTerm :one
INSERT INTO term (academic_year_id, name, start_date, end_date) 
VALUES ($1, $2, $3, $4) 
RETURNING term_id
`

type CreateTermParams struct {
	AcademicYearID pgtype.UUID
	Name           string
	StartDate      pgtype.Date
	EndDate        pgtype.Date
}

func (q *Queries) CreateTerm(ctx context.Context, arg CreateTermParams) (pgtype.UUID, error) {
	row := q.db.QueryRow(ctx, createTerm,
		arg.AcademicYearID,
		arg.Name,
		arg.StartDate,
		arg.EndDate,
	)
	var term_id pgtype.UUID
	err := row.Scan(&term_id)
	return term_id, err
}

const deleteAcademicYear = `-- name: DeleteAcademicYear :exec
DELETE FROM academic_year
WHERE academic_year_id = $1
`

func (q *Queries) DeleteAcademicYear(ctx context.Context, academicYearID pgtype.UUID) error {
	_, err := q.db.Exec(ctx, deleteAcademicYear, academicYearID)
	return err
}

const deleteTerm = `-- name: DeleteTerm :exec
DELETE FROM term
WHERE term_id = $1
`

func (q *Queries) DeleteTerm(ctx context.Context, termID pgtype.UUID) error {
	_, err := q.db.Exec(ctx, deleteTerm, termID)
	return err
}

const editAcademicYear = `-- name: EditAcademicYear :exec
UPDATE academic_year
    SET name = COALESCE($1, name),
    start_date = COALESCE($2, start_date),
    end_date = COALESCE($3, end_date)
WHERE academic_year_id = $4
`

type EditAcademicYearParams struct {
	Name           string
	StartDate      pgtype.Date
	EndDate        pgtype.Date
	AcademicYearID pgtype.UUID
}

func (q *Queries) EditAcademicYear(ctx context.Context, arg EditAcademicYearParams) error {
	_, err := q.db.Exec(ctx, editAcademicYear,
		arg.Name,
		arg.StartDate,
		arg.EndDate,
		arg.AcademicYearID,
	)
	return err
}

const editTerm = `-- name: EditTerm :exec
UPDATE term 
SET academic_year_id = COALESCE($1, academic_year_id),
name = COALESCE($2, name),
start_date = COALESCE($3, start_date),
end_date = COALESCE($4, end_date)
WHERE term_id = $5
`

type EditTermParams struct {
	AcademicYearID pgtype.UUID
	Name           string
	StartDate      pgtype.Date
	EndDate        pgtype.Date
	TermID         pgtype.UUID
}

func (q *Queries) EditTerm(ctx context.Context, arg EditTermParams) error {
	_, err := q.db.Exec(ctx, editTerm,
		arg.AcademicYearID,
		arg.Name,
		arg.StartDate,
		arg.EndDate,
		arg.TermID,
	)
	return err
}

const getAcademicYear = `-- name: GetAcademicYear :one
SELECT academic_year_id, name, start_date, end_date FROM academic_year WHERE academic_year_id = $1
`

func (q *Queries) GetAcademicYear(ctx context.Context, academicYearID pgtype.UUID) (AcademicYear, error) {
	row := q.db.QueryRow(ctx, getAcademicYear, academicYearID)
	var i AcademicYear
	err := row.Scan(
		&i.AcademicYearID,
		&i.Name,
		&i.StartDate,
		&i.EndDate,
	)
	return i, err
}

const getTerm = `-- name: GetTerm :one
SELECT term_id, academic_year_id, name, start_date, end_date FROM term WHERE term_id = $1
`

func (q *Queries) GetTerm(ctx context.Context, termID pgtype.UUID) (Term, error) {
	row := q.db.QueryRow(ctx, getTerm, termID)
	var i Term
	err := row.Scan(
		&i.TermID,
		&i.AcademicYearID,
		&i.Name,
		&i.StartDate,
		&i.EndDate,
	)
	return i, err
}

const listAcademicYear = `-- name: ListAcademicYear :many
SELECT academic_year_id, name, start_date, end_date FROM academic_year
`

func (q *Queries) ListAcademicYear(ctx context.Context) ([]AcademicYear, error) {
	rows, err := q.db.Query(ctx, listAcademicYear)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []AcademicYear
	for rows.Next() {
		var i AcademicYear
		if err := rows.Scan(
			&i.AcademicYearID,
			&i.Name,
			&i.StartDate,
			&i.EndDate,
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

const listTerms = `-- name: ListTerms :many
SELECT term_id, academic_year_id, name, start_date, end_date FROM term
`

func (q *Queries) ListTerms(ctx context.Context) ([]Term, error) {
	rows, err := q.db.Query(ctx, listTerms)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Term
	for rows.Next() {
		var i Term
		if err := rows.Scan(
			&i.TermID,
			&i.AcademicYearID,
			&i.Name,
			&i.StartDate,
			&i.EndDate,
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