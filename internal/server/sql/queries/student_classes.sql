-- name: CreateStudentClasses :one
INSERT INTO student_classes (student_id, class_id, term_id)
VALUES ($1, $2, $3) RETURNING *;

-- name: GetStudentClasses :one
SELECT * FROM student_classes WHERE student_class_id = $1;

-- name: ListStudentClasses :many
SELECT * FROM student_classes;

-- name: EditStudentClasses :exec
UPDATE student_classes
SET student_id = COALESCE($2, student_id),
class_id = COALESCE($3, class_id),
term_id = COALESCE($4, term_id)
WHERE student_class_id = $1;

-- name: DeleteStudentClasses :exec
DELETE FROM student_classes WHERE student_class_id = $1;
