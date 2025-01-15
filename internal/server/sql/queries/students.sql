-- name: CreateStudent :one
INSERT INTO students (academic_year_id, last_name, first_name, gender, date_of_birth) 
VALUES ($1, $2, $3, $4, $5) 
RETURNING *;

-- name: GetStudent :one
SELECT
    students.student_id,
    students.last_name,
    students.first_name,
    students.gender,
    students.date_of_birth,
    students.status,
    academic_year.name AS AcademicYear,
    classes.name AS ClassName
FROM students
INNER JOIN academic_year
    ON students.academic_year_id = academic_year.academic_year_id
LEFT OUTER JOIN student_classes
    ON students.student_id = student_classes.student_id
LEFT OUTER JOIN classes
    ON student_classes.class_id = classes.class_id
WHERE students.student_id = $1;

-- name: ListStudents :many
SELECT
    students.student_id,
    students.last_name,
    students.first_name,
    students.gender,
    students.date_of_birth,
    students.status,
    academic_year.name AS AcademicYear,
    classes.name AS ClassName
FROM students
INNER JOIN academic_year
    ON students.academic_year_id = academic_year.academic_year_id
LEFT OUTER JOIN student_classes
    ON students.student_id = student_classes.student_id
LEFT OUTER JOIN classes
    ON student_classes.class_id = classes.class_id
ORDER BY students.last_name ASC, students.first_name ASC;

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
