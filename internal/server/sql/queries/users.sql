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
ON CONFLICT (phone_number) DO NOTHING
RETURNING *;

-- name: GetUserDetails :one
SELECT 
    users.user_id,
    users.user_no,
    users.last_name, 
    users.first_name, 
    users.gender, 
    users.email, 
    users.phone_number,
    users.password, 
    roles.name AS role
FROM 
    users
INNER JOIN 
    roles 
ON 
    users.role_id = roles.role_id
WHERE 
    users.user_id = $1;

-- name: GetUserByPhone :one
SELECT password, user_id FROM users 
WHERE phone_number = $1;

-- name: GetUserByUsername :one
SELECT password, user_id FROM users
WHERE user_no = $1;

-- name: ListUsers :many
SELECT
    users.user_id,
    users.user_no,
    users.last_name,
    users.first_name,
    users.gender,
    users.email,
    users.phone_number,
    users.password,
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
    role_id = COALESCE((SELECT role_id FROM roles WHERE name = $7), role_id)
WHERE user_id = $1;

-- name: EditPassword :exec
UPDATE users
    set password = COALESCE($2, password)
WHERE user_id = $1;

-- name: DeleteUser :exec
DELETE FROM users
WHERE user_id = $1;
