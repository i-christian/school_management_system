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

-- name: GetFeeStructureForClass :one
SELECT fee_structure_id, term_id, class_id, required
FROM fee_structure
WHERE class_id = $1;

-- name: GetStudentFeesRecord :one
SELECT
    fees.fees_id,
    students.last_name,
    students.first_name,
    students.middle_name,
    term.name AS AcademicTerm,
    classes.class_id,
    classes.name AS ClassName,
    fee_structure.required AS TuitionAmount,
    fees.paid AS PaidAmount,
    fees.arrears,
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
    students.student_id,
    students.last_name,
    students.first_name,
    students.middle_name,
    term.name AS AcademicTerm,
    classes.class_id,
    classes.name AS ClassName,
    fee_structure.required AS TuitionAmount,
    fees.paid AS PaidAmount,
    fees.arrears,
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
ORDER BY classes.name;
    
-- name: EditFeesRecord :exec
UPDATE fees
    SET paid = paid + $2
WHERE fees_id = $1
RETURNING *;
