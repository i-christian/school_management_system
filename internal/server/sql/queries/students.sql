-- name: CreateStudent :one
INSERT INTO students (academic_year_id, last_name, first_name, gender, date_of_birth) 
VALUES ($1, $2, $3, $4, $5) 
RETURNING *;

-- name: GetStudent :one
SELECT * FROM students WHERE student_id = $1;

-- name: ListStudents :many
SELECT * FROM students;

-- name: EditStudent :exec
UPDATE students
SET academic_year_id = COALESCE($2, academic_year_id),
last_name = COALESCE($3, last_name),
first_name = COALESCE($4, first_name),
gender = COALESCE($5, gender),
date_of_birth = COALESCE($5, date_of_birth) 
WHERE student_id = $1;

-- name: DeleteStudent :exec
DELETE FROM students WHERE student_id = $1;
