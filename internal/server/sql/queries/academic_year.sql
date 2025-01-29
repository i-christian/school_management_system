-- name: CreateAcademicYear :one
INSERT INTO academic_year (name, start_date, end_date) 
VALUES ($1, $2, $3)
ON CONFLICT (name) DO NOTHING
RETURNING academic_year_id;

-- name: ListAcademicYear :many
SELECT * FROM academic_year;

-- name: GetAcademicYear :one
SELECT * FROM academic_year WHERE name = $1;

-- name: EditAcademicYear :exec
UPDATE academic_year
    SET name = COALESCE($1, name),
    start_date = COALESCE($2, start_date),
    end_date = COALESCE($3, end_date)
WHERE academic_year_id = $4;

-- name: DeleteAcademicYear :exec
DELETE FROM academic_year
WHERE academic_year_id = $1;

-- name: CreateTerm :one
INSERT INTO term (academic_year_id, name, start_date, end_date) 
VALUES ($1, $2, $3, $4) 
RETURNING term_id;

-- name: ListTerms :many
SELECT
term.term_id,
academic_year.name AS Academic_Year,
term.name AS Academic_Term,
term.start_date AS Opening_date,
term.end_date AS Closing_date
FROM term
INNER JOIN academic_year
ON
term.academic_year_id = academic_year.academic_year_id
WHERE academic_year.name = $1;

-- name: GetTerm :one
SELECT
term.term_id,
academic_year.name AS Academic_Year,
term.name AS Academic_Term,
term.start_date AS Opening_date,
term.end_date AS Closing_date
FROM term
INNER JOIN academic_year
ON
term.academic_year_id = academic_year.academic_year_id
WHERE term_id = $1;

-- name: EditTerm :exec
UPDATE term 
SET academic_year_id = COALESCE($1, academic_year_id),
name = COALESCE($2, name),
start_date = COALESCE($3, start_date),
end_date = COALESCE($4, end_date)
WHERE term_id = $5;

-- name: DeleteTerm :exec
DELETE FROM term
WHERE term_id = $1;
