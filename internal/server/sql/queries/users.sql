-- name: CreateUser :one
INSERT INTO users (first_name, last_name, phone_number, email, gender, password, role_id)
VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    (SELECT role_id FROM roles WHERE name = $7)
)
RETURNING *;

-- name: GetUserRole :one
SELECT roles.name AS role, users.user_id
FROM users
INNER JOIN sessions 
    ON users.user_id = sessions.user_id
INNER JOIN roles 
    ON users.role_id = roles.role_id
WHERE session_id = $1;

-- name: GetUserDetails :one
SELECT 
    users.last_name, 
    users.first_name, 
    users.gender, 
    users.email, 
    users.phone_number, 
    roles.name AS role
FROM 
    users
INNER JOIN 
    roles 
ON 
    users.role_id = roles.role_id
WHERE 
    roles.name = $2
    AND users.user_id = $1;

-- name: ListUsers :many
SELECT
    users.user_id,
    users.last_name,
    users.first_name,
    users.gender,
    users.email,
    users.phone_number,
    roles.name AS role
FROM users
INNER JOIN roles ON users.role_id = roles.role_id
ORDER BY last_name;

-- name: EditUser :exec
UPDATE users
    set first_name = COALESCE($2, first_name),
    last_name = COALESCE($3, last_name),
    gender = COALESCE($4, gender),
    phone_number = COALESCE($5, phone_number),
    email = COALESCE($6, email),
    password = COALESCE($7, password),
    role_id = COALESCE((SELECT role_id FROM roles WHERE name = $8), role_id)
WHERE user_id = $1;

-- name: DeleteUser :exec
DELETE FROM users
WHERE user_id = $1;
