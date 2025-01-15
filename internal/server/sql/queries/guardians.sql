-- name: CreateGuardian :one
INSERT INTO guardians (student_id, name, phone_number_1, phone_number_2, gender, profession)
VALUES ($1, $2, $3, $4, $5, $6) 
RETURNING *;

-- name: GetGuardian :one
SELECT * FROM guardians WHERE guardian_id = $1;

-- name: ListGuardians :many
SELECT * FROM guardians;

-- name: EditGuardian :exec
UPDATE guardians
SET student_id = COALESCE($2, student_id),
name = COALESCE($3, name),
phone_number_1 = COALESCE($4, phone_number_1),
phone_number_2 = COALESCE($5, phone_number_2),
gender = COALESCE($6, gender),
profession = COALESCE($7, profession)
WHERE guardian_id = $1;

-- name: DeleteGuardian :exec
DELETE FROM guardians WHERE guardian_id = $1;
