-- name: CreateFeesRecord :one
INSERT INTO fees (student_id, term_id, class_id, required, paid)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: GetStudentFeesRecord :one
SELECT * FROM fees
WHERE student_id = $1;

-- name: ListStudentFeesRecords :many
SELECT * FROM fees;

-- name: EditFeesRecord :exec
UPDATE fees
SET term_id = COALESCE($2, term_id),
class_id = COALESCE($3, class_id),
required = COALESCE($4, required),
paid = COALESCE($5, paid)
WHERE fees_id = $1;

-- name: DeleteFeesRecord :exec
DELETE FROM fees WHERE fees_id = $1;
