-- name: CreateDisciplinaryRecord :one
INSERT INTO discipline_records (student_id, term_id, date, description, action_taken, reported_by, notes)
VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;

-- name: GetDisciplinaryRecord :one
SELECT 
    students.last_name,
    students.first_name,
    discipline_records.date,
    discipline_records.description AS offense,
    discipline_records.action_taken,
    discipline_records.notes,
    term.name AS term_name,
    users.last_name As reporter_last_name,
    users.first_name As reporter_first_name  
FROM discipline_records
INNER JOIN students
ON
discipline_records.student_id = students.student_id
INNER JOIN users
ON
discipline_records.reported_by = users.users_id
INNER JOIN term
ON
discipline_records.term_id = term.term_id
WHERE students.student_id = $1;

-- name: ListDisciplinaryRecords :many
SELECT 
    students.last_name,
    students.first_name,
    discipline_records.date,
    discipline_records.description AS offense,
    discipline_records.action_taken,
    discipline_records.notes,
    term.name AS term_name,
    users.last_name As reporter_last_name,
    users.first_name As reporter_first_name  
FROM discipline_records
INNER JOIN students
ON
discipline_records.student_id = students.student_id
INNER JOIN users
ON
discipline_records.reported_by = users.users_id
INNER JOIN term
ON
discipline_records.term_id = term.term_id;

-- name: EditDisciplinaryRecord :exec
UPDATE discipline_records
SET description = COALESCE($2, description),
action_taken = COALESCE($3, action_taken),
notes = COALESCE($4, notes)
WHERE discipline_id = $1;

-- name: DeleteDisciplinaryRecord :exec
DELETE FROM discipline_records WHERE discipline_id = $1;
