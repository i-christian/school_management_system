-- name: CreateRemark :one
INSERT INTO remarks (student_id, term_id, content_class_teacher, content_head_teacher) 
VALUES ($1, $2, $3, $4) RETURNING *;

-- name: GetRemark :one
SELECT * FROM remarks WHERE student_id = $1;

-- name: ListRemarks :many
SELECT * FROM remarks;

-- name: EditRemark :exec
UPDATE remarks
SET term_id = COALESCE($2, term_id),
content_class_teacher = COALESCE($3, content_class_teacher),
content_head_teacher = COALESCE($4, content_head_teacher)
WHERE remarks_id = $1;

-- name: DeleteRemark :exec
DELETE FROM remarks WHERE remarks_id = $1;
