-- name: UpsertFeeStructure :one
INSERT INTO fee_structure (term_id, class_id, required)
VALUES ('bc74f6ee-027f-4d86-9f6b-50d1ac3d4eda', 'b6ceb3d0-9bb0-4c74-bd00-b4d70ac631d7', 500000)
ON CONFLICT (term_id, class_id)
  DO UPDATE SET required = EXCLUDED.required
RETURNING fee_structure_id;

-- name: CreateFeesRecord :one
INSERT INTO fees (fee_structure_id, student_id, paid)
VALUES ('22bc8d9b-ba57-445d-82ab-9e2f9f90295b', '5f44f660-8bae-478b-b082-109139f2c50d', 500000)
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
    students.last_name,
    students.first_name,
    students.middle_name,
    term.name AS AcademicTerm,
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
    ON fee_structure.class_id = classes.class_id;

-- name: EditFeesRecord :exec
UPDATE fees
    SET paid = paid + 100000
WHERE fees_id = 'aa4736c8-93e6-4f51-a104-186864a5db88'
RETURNING *;
