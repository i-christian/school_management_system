-- name: CreateStudentClasses :one
INSERT INTO student_classes (student_id, class_id, term_id)
VALUES ($1, $2, $3) RETURNING *;

-- name: GetStudentsTerm :one
SELECT DISTINCT
    t.name as term,
    ay.name as academic_year
FROM term t
JOIN student_classes sc ON t.term_id = sc.term_id
JOIN academic_year ay ON t.academic_year_id = ay.academic_year_id
LIMIT 1;

-- name: EditStudentClasses :exec
UPDATE student_classes
SET class_id = COALESCE($2, class_id)
WHERE student_id = $1;

-- name: DeleteStudentClasses :exec
DELETE FROM student_classes WHERE student_class_id = $1;
