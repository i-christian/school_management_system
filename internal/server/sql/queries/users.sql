-- name: CreateUser :one
INSERT INTO users(last_name, first_name, phone_number, password) 
VALUES ($1, $2, $3, $4)
RETURNING *;
