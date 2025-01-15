-- name: CreateStudentClasses :one
INSERT INTO student_classes (student_id, class_id, term_id)
VALUES ($1, $2, $3) RETURNING *;

-- name: GetStudentClasses :one
SELECT
    student_classes.student_class_id,
    students.last_name,
    students.first_name,
    classes.name AS className,
    term.term_id AS AcademicTerm 
FROM student_classes
INNER JOIN students
    ON student_classes.student_id = students.student_id
INNER JOIN classes
    ON student_classes.class_id = classes.class_id
INNER JOIN term
    ON student_classes.term_id = term.term_id
WHERE students.student_id = $1;

-- name: ListStudentClasses :many
SELECT
    student_classes.student_class_id,
    students.last_name,
    students.first_name,
    classes.name AS className,
    term.term_id AS AcademicTerm 
FROM student_classes
INNER JOIN students
    ON student_classes.student_id = students.student_id
INNER JOIN classes
    ON student_classes.class_id = classes.class_id
INNER JOIN term
    ON student_classes.term_id = term.term_id;

-- name: EditStudentClasses :exec
UPDATE student_classes
SET student_id = COALESCE($2, student_id),
class_id = COALESCE($3, class_id),
term_id = COALESCE($4, term_id)
WHERE student_class_id = $1;

-- name: DeleteStudentClasses :exec
DELETE FROM student_classes WHERE student_class_id = $1;
