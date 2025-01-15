-- name: CreateSubject :one
INSERT INTO subjects (class_id, name) VALUES ($1, $2) RETURNING *;

-- name: ListSubjects :many
SELECT * FROM subjects ORDER BY name;

-- name: GetSubject :one
SELECT * FROM subjects WHERE name = $1;

-- name: EditSubject :exec
UPDATE subjects
SET class_id = COALESCE($2, class_id),
name = COALESCE($3, name)
WHERE subject_id = $1;

-- name: DeleteSubject :exec
DELETE FROM subjects WHERE subject_id = $1;
