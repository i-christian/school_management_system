-- name: GetTotalUsers :one
SELECT COUNT(*) AS total_users
FROM users;

-- name: GetTotalStudents :one
SELECT COUNT(*) AS total_students
FROM students;

-- name: GetTotalFeesPaid :one
SELECT COALESCE(SUM(paid), 0) AS total_fees_paid
FROM fees;

-- name: GetStudentGenderBreakdown :many
SELECT gender, COUNT(*) AS total_students
FROM students
GROUP BY gender;

-- name: GetTotalGuardians :one
SELECT COUNT(*) AS total_guardians
FROM guardians;

-- name: GetAverageGradeScore :one
SELECT AVG(score) AS average_grade
FROM grades;

-- name: GetTotalDisciplineRecords :one
SELECT COUNT(*) AS total_discipline_records
FROM discipline_records;
