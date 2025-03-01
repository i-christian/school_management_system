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

-- name: GetFeeStructureByTermAndClass :one
SELECT fee_structure_id, term_id, class_id, required
FROM fee_structure
WHERE class_id = $1;

-- name: ListStudentsByClassForTerm :many
SELECT
    s.*
FROM students s
INNER JOIN student_classes sc ON s.student_id = sc.student_id
INNER JOIN term t ON sc.term_id = t.term_id
INNER JOIN classes c ON sc.class_id = c.class_id
WHERE c.class_id = $1 AND t.active = TRUE;

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
    f.fees_id,
    s.student_id,
    s.last_name,
    s.first_name,
    s.middle_name,
    t.name AS AcademicTerm,
    c.name AS ClassName,
    fs.class_id,
    fs.required AS TuitionAmount,
    COALESCE(f.paid, 0.00) AS PaidAmount,
    COALESCE(f.arrears, 0.00) AS Arrears,
    COALESCE(f.status, 'OVERDUE') AS Status,
    c.class_id AS ClassID,
    fs.fee_structure_id,
    t.term_id
FROM fee_structure fs
INNER JOIN term t ON fs.term_id = t.term_id
INNER JOIN classes c ON fs.class_id = c.class_id
LEFT JOIN student_classes sc
    ON fs.class_id = sc.class_id
LEFT JOIN students s ON sc.student_id = s.student_id
LEFT JOIN fees f
    ON fs.fee_structure_id = f.fee_structure_id
    AND s.student_id = f.student_id;
    
-- name: EditFeesRecord :exec
UPDATE fees
    SET paid = paid + $2
WHERE fees_id = $1
RETURNING *;

