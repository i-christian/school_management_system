-- name: CreateAcademicYear :one
INSERT INTO academic_year (name, start_date, end_date, graduate_class_id) 
VALUES ($1, $2, $3, $4)
ON CONFLICT (name) DO NOTHING
RETURNING academic_year_id;

-- name: ListAcademicYear :many
SELECT * FROM academic_year
ORDER BY active DESC;

-- name: GetAcademicYear :one
SELECT * FROM academic_year WHERE academic_year_id = $1;

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
ON CONFLICT ON CONSTRAINT term_name_on_academic_year DO NOTHING 
RETURNING term_id;

-- name: ListTerms :many
SELECT
term.term_id,
academic_year.academic_year_id,
academic_year.name AS Academic_Year,
term.name AS Academic_Term,
term.start_date AS Opening_date,
term.end_date AS Closing_date,
term.active
FROM term
INNER JOIN academic_year
ON
term.academic_year_id = academic_year.academic_year_id
WHERE academic_year.academic_year_id = $1
ORDER BY term.active DESC;

-- name: GetTerm :one
SELECT
term.term_id,
academic_year.academic_year_id,
academic_year.name AS Academic_Year,
term.name AS Academic_Term,
term.previous_term_id,
term.start_date AS Opening_date,
term.end_date AS Closing_date
FROM term
INNER JOIN academic_year
ON
term.academic_year_id = academic_year.academic_year_id
WHERE term_id = $1;

-- name: EditTerm :exec
UPDATE term 
SET name = COALESCE($2, name),
start_date = COALESCE($3, start_date),
end_date = COALESCE($4, end_date)
WHERE term_id = $1;

-- name: DeleteTerm :exec
DELETE FROM term
WHERE term_id = $1;

-- name: DeactivateAcademicYear :exec
UPDATE academic_year
SET active = FALSE
WHERE active = TRUE;

-- name: SetCurrentAcademicYear :one
UPDATE academic_year
SET active = TRUE
WHERE academic_year_id = $1
RETURNING *;

-- name: DeactivateTerm :one
UPDATE term
SET active = FALSE
WHERE active = TRUE
RETURNING term_id;

-- name: SetCurrentTerm :one
UPDATE term
SET active = TRUE, previous_term_id = $2
WHERE term_id = $1
RETURNING *;

-- name: GetCurrentAcademicYear :one
SELECT *
FROM academic_year
WHERE active = TRUE
LIMIT 1;

-- name: GetCurrentTerm :one
SELECT
    t.term_id,
    t.previous_term_id,
    ay.academic_year_id,
    ay.name AS Academic_Year,
    t.name AS Academic_Term,
    t.start_date AS Opening_date,
    t.end_date AS Closing_date
FROM term t
INNER JOIN academic_year ay
    ON t.academic_year_id = ay.academic_year_id
WHERE t.active = TRUE
LIMIT 1;


-- name: GetCurrentAcademicYearAndTerm :one
SELECT
    ay.academic_year_id,
    ay.name AS Academic_Year,
    ay.start_date,
    ay.end_date,
    t.term_id,
    t.name AS Academic_Term,
    t.start_date AS Term_Opening_date,
    t.end_date AS Term_Closing_date
FROM academic_year ay
LEFT JOIN term t
    ON ay.academic_year_id = t.academic_year_id
    AND t.active = TRUE
WHERE ay.active = TRUE
LIMIT 1;
