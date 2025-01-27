-- name: CreateGrade :one
INSERT INTO grades (student_id, subject_id, term_id, score, remark) 
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: GetGrade :one
SELECT
    grades.grade_id,
    students.last_name,
    students.first_name,
    subjects.name AS Subject,
    term.name AS AcademicTerm,
    grades.score,
    grades.remark
FROM grades
INNER JOIN students
    ON grades.student_id = students.student_id
INNER JOIN subjects
    ON grades.subject_id =  students.student_id
INNER JOIN term
    ON grades.term_id = term.term_id
WHERE students.student_id = $1;

-- name: ListGrades :many
SELECT
    grades.grade_id,
    students.last_name,
    students.first_name,
    subjects.name AS Subject,
    term.name AS AcademicTerm,
    grades.score,
    grades.remark
FROM grades
INNER JOIN students
    ON grades.student_id = students.student_id
INNER JOIN subjects
    ON grades.subject_id =  students.student_id
INNER JOIN term
    ON grades.term_id = term.term_id;

-- name: EditGrade :exec
UPDATE grades
SET student_id = COALESCE($2, student_id),
subject_id = COALESCE($3, subject_id),
term_id = COALESCE($4, term_id),
score = COALESCE($5, score),
remark = COALESCE($6, remark)
WHERE grade_id = $1;

-- name: DeleteGrade :exec
DELETE FROM grades WHERE grade_id = $1;
