-- name: InsertStudent :one
INSERT INTO students (
    academic_year_id, 
    last_name, 
    first_name, 
    middle_name, 
    gender, 
    date_of_birth
)
VALUES
    ($1, $2, $3, $4, $5, $6)
ON CONFLICT (first_name, last_name, middle_name, date_of_birth, academic_year_id)
DO NOTHING
RETURNING student_id;

-- name: UpsertGuardian :one
INSERT INTO guardians (
    guardian_name, 
    phone_number_1, 
    phone_number_2, 
    gender, 
    profession
)
VALUES
    ($1, $2, $3, $4, $5)
ON CONFLICT (phone_number_1, phone_number_2)
DO UPDATE
    SET guardian_name = EXCLUDED.guardian_name,
        gender = EXCLUDED.gender,
        profession = EXCLUDED.profession
RETURNING guardian_id;

-- name: LinkStudentGuardian :exec
INSERT INTO student_guardians (student_id, guardian_id)
VALUES ($1, $2)
ON CONFLICT (student_id, guardian_id) DO NOTHING;

-- name: GetStudent :one
SELECT DISTINCT ON (students.student_id)
    students.student_id,
    students.student_no,
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
SELECT DISTINCT ON (students.student_id)
    students.student_id,
    students.student_no,
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
ORDER BY students.student_id, students.last_name ASC;

-- name: EditStudent :exec
UPDATE students
SET academic_year_id = COALESCE($2, academic_year_id),
    last_name = COALESCE($3, last_name),
    first_name = COALESCE($4, first_name),
    gender = COALESCE($5, gender),
    date_of_birth = COALESCE($6, date_of_birth)
WHERE student_id = $1
AND (
    $2 IS NOT NULL OR 
    $3 IS NOT NULL OR 
    $4 IS NOT NULL OR 
    $5 IS NOT NULL OR 
    $6 IS NOT NULL
);

-- name: DeleteStudent :exec
DELETE FROM students WHERE student_id = $1;
