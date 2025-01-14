-- name: CreateUser :one
INSERT INTO users(last_name, first_name, phone_number, email, gender, password) 
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: GetUser :one
SELECT users.role, users.user_id FROM users INNER JOIN sessions ON users.user_id = sessions.user_id WHERE session_id = $1;

-- name: GetUserDetails :one
SELECT last_name, first_name, gender, email, phone_number, role 
FROM users WHERE user_id = $1;

-- name: ListUsers :many
SELECT user_id, last_name, first_name, gender, email, phone_number, role
FROM users ORDER BY last_name;

-- name: EditUser :exec
UPDATE users
    set first_name = COALESCE($2, first_name),
    last_name = COALESCE($3, last_name),
    gender = COALESCE($4, gender),
    phone_number = COALESCE($5, phone_number),
    email = COALESCE($6, email),
    password = COALESCE($7, password),
    role = COALESCE($8, role)
WHERE user_id = $1;

-- name: DeleteUser :exec
DELETE FROM users
WHERE user_id = $1;
