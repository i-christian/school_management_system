-- name: CreateFeesRecord :one
INSERT INTO fees (student_id, term_id, class_id, required, paid)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: GetStudentFeesRecord :one
SELECT
    fees.fees_id,
    students.last_name AS LastName,
    students.first_name AS FirstName,
    term.name AS AcademicTerm,
    classes.name AS ClassName,
    fees.required AS TutionAmount,
    fees.paid AS PaidAmount,
    fees.status
FROM fees
INNER JOIN students
    ON fees.student_id = students.student_id
INNER JOIN term
    ON fees.term_id = term.term_id
INNER JOIN classes
    ON fees.class_id = classes.class_id
WHERE students.student_id = $1;

-- name: ListStudentFeesRecords :many
SELECT
    fees.fees_id,
    students.last_name AS LastName,
    students.first_name AS FirstName,
    term.name AS AcademicTerm,
    classes.name AS ClassName,
    fees.required AS TutionAmount,
    fees.paid AS PaidAmount,
    fees.status
FROM fees
INNER JOIN students
    ON fees.student_id = students.student_id
INNER JOIN term
    ON fees.term_id = term.term_id
INNER JOIN classes
    ON fees.class_id = classes.class_id;

-- name: EditFeesRecord :exec
UPDATE fees
SET term_id = COALESCE($2, term_id),
class_id = COALESCE($3, class_id),
required = COALESCE($4, required),
paid = COALESCE($5, paid)
WHERE fees_id = $1;

-- name: DeleteFeesRecord :exec
DELETE FROM fees WHERE fees_id = $1;
