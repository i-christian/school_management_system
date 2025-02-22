-- name: UpsertGrade :one
INSERT INTO grades (student_id, subject_id, term_id, score, remark)
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (student_id, subject_id, term_id)
DO UPDATE SET 
    score = EXCLUDED.score,
    remark = EXCLUDED.remark
RETURNING *;

-- name: GetGrades :one
SELECT *
FROM student_grades_view
WHERE student_id = $1;

-- name: ListGrades :many
SELECT *
FROM student_grades_view
ORDER BY class_name, student_no;

-- name: EditGrade :exec
UPDATE grades
SET score = COALESCE($2, score),
    remark = COALESCE($3, remark)
WHERE grade_id = $1;

-- name: DeleteGrade :exec
DELETE FROM grades WHERE grade_id = $1;
