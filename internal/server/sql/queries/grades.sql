-- name: RetrieveClassRoom :many
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
ORDER BY vc.class_name, vc.student_no;

-- name: UpsertGrade :one
INSERT INTO grades (student_id, subject_id, term_id, score, remark)
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (student_id, subject_id, term_id)
DO UPDATE SET 
    score = EXCLUDED.score,
    remark = EXCLUDED.remark
RETURNING *;

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
