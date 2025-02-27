-- name: UpsertFeeStructure :one
INSERT INTO fee_structure (term_id, class_id, required)
VALUES ($1, $2, $3)
ON CONFLICT (term_id, class_id)
  DO UPDATE SET required = EXCLUDED.required
RETURNING fee_structure_id;

-- name: CreateFeesRecord :one
INSERT INTO fees (fee_structure_id, student_id, paid)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetStudentFeesRecord :one
SELECT
    fees.fees_id,
    students.last_name,
    students.first_name,
    students.middle_name,
    term.name AS AcademicTerm,
    classes.name AS ClassName,
    fee_structure.required AS TuitionAmount,
    fees.paid AS PaidAmount,
    fees.status
FROM fees
INNER JOIN fee_structure 
    ON fees.fee_structure_id = fee_structure.fee_structure_id
INNER JOIN students
    ON fees.student_id = students.student_id
INNER JOIN term
    ON fee_structure.term_id = term.term_id
INNER JOIN classes
    ON fee_structure.class_id = classes.class_id
WHERE students.student_id = $1;

-- name: ListStudentFeesRecords :many
SELECT
    fees.fees_id,
    students.last_name,
    students.first_name,
    students.middle_name,
    term.name AS AcademicTerm,
    classes.name AS ClassName,
    fee_structure.required AS TuitionAmount,
    fees.paid AS PaidAmount,
    fees.status
FROM fees
INNER JOIN fee_structure 
    ON fees.fee_structure_id = fee_structure.fee_structure_id
INNER JOIN students
    ON fees.student_id = students.student_id
INNER JOIN term
    ON fee_structure.term_id = term.term_id
INNER JOIN classes
    ON fee_structure.class_id = classes.class_id;

-- name: EditFeesRecord :exec
UPDATE fees
    SET paid = COALESCE($2, paid)
WHERE fees_id = $1;

-- name: UpdateFeesArrears :exec
WITH previous_fees_arrears AS (
    SELECT
        f.student_id,
        fs.required - f.paid AS term_arrears
    FROM fees f
    JOIN fee_structure fs ON f.fee_structure_id = fs.fee_structure_id
    WHERE fs.term_id = $1 -- Previous term ID
)
UPDATE fees AS current_fees
SET arrears = COALESCE(current_fees.arrears, 0) + COALESCE(previous_fees_arrears.term_arrears, 0)
FROM previous_fees_arrears
WHERE current_fees.student_id = previous_fees_arrears.student_id;
