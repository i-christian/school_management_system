-- name: CreateGrade :one
INSERT INTO grades (student_id, subject_id, term_id, score, remark) 
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: GetGrade :one
SELECT * FROM grades WHERE grade_id = $1;

-- name: ListGrades :many
SELECT * FROM grades;

-- name: EditGrade :exec
UPDATE grades
SET student_id = COALESCE($2, student_id),
subject_id = COALESCE($3, subject_id),
term_id = COALESCE($4, term_id),
score = COALESCE($5, score),
remark = COALESCE($6, remark)
WHERE grade_id = $1;

-- name: DeleteGrade :exec
DELETE FROM grades WHERE grade_id = $1;
