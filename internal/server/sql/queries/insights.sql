-- name: GetTotalUsers :one
SELECT COUNT(*) AS total_users
FROM users;

-- name: GetTotalStudents :one
SELECT COUNT(*) AS total_students
FROM students;

-- name: GetTotalFeesPaid :one
SELECT COALESCE(SUM(paid), 0) AS total_fees_paid
FROM fees;
