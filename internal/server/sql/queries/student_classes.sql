-- name: CreateStudentClasses :one
INSERT INTO student_classes (student_id, class_id, term_id)
VALUES ($1, $2, $3) RETURNING *;

-- name: EditStudentClasses :exec
UPDATE student_classes
SET class_id = COALESCE($2, class_id)
WHERE student_id = $1;

-- name: DeleteStudentClasses :exec
DELETE FROM student_classes WHERE student_class_id = $1;
