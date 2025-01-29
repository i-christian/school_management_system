-- name: CreateClass :exec
INSERT INTO classes (name)
VALUES ($1)
ON CONFLICT (name) DO NOTHING
RETURNING *;

-- name: ListClasses :many
SELECT * FROM classes ORDER BY name;

-- name: GetClass :one
SELECT * FROM classes WHERE name = $1;

-- name: EditClass :exec
UPDATE classes
SET name = COALESCE($2, name)
WHERE class_id = $1;

-- name: DeleteClass :exec
DELETE FROM classes WHERE class_id = $1;
