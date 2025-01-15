-- name: CreateAssignments :one
INSERT INTO assignments (class_id, subject_id, teacher_id)
VALUES($1, $2, $3) RETURNING *;

-- name: ListAssignments :many
SELECT * FROM assignments;

-- name: GetAssignment :one
SELECT * FROM assignments WHERE id = $1;

-- name: EditAssignments :exec
UPDATE assignments
SET class_id = COALESCE($2, class_id),
subject_id = COALESCE($3, subject_id),
teacher_id = COALESCE($4, teacher_id)
WHERE id = $1;

-- name: DeleteAssignments :exec
DELETE FROM assignments WHERE id = $1;
