-- name: CreateUser :one
INSERT INTO users(last_name, first_name, phone_number, email, gender, password) 
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;


