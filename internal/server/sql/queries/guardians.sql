-- name: UpdateGuardian :exec
UPDATE guardians
SET guardian_name = COALESCE($2, guardian_name),
    phone_number_1 = COALESCE($3, phone_number_1),
    phone_number_2 = COALESCE($4, phone_number_2),
    gender = COALESCE($5, gender),
    profession = COALESCE($6, profession)
WHERE guardian_id = $1;

-- name: GetGuardianByID :one
SELECT * from guardians WHERE guardian_id = $1;

-- name: GetGuardianByPhone :one
SELECT * FROM guardians
WHERE phone_number_1 = $1
OR phone_number_2 = $1;

-- name: GetStudentGuardianCount :one
WITH student_guardian AS (
    SELECT guardian_id FROM student_guardians
    WHERE  student_guardians.student_id = $1
)
SELECT COUNT(guardian_id), guardian_id FROM student_guardians   WHERE guardian_id = (SELECT student_guardian.guardian_id FROM student_guardian)
GROUP BY student_guardians.guardian_id;
 
-- name: GetAllStudentGuardianLinks :many
SELECT
    g.guardian_id,
    s.last_name AS student_first_name,
    s.first_name AS student_last_name,
    g.guardian_name AS guardian_name,
    g.phone_number_1,
    g.phone_number_2,
    g.gender AS guardian_gender,
    g.profession AS guardian_profession
FROM students s
INNER JOIN student_guardians sg ON s.student_id = sg.student_id
INNER JOIN guardians g ON sg.guardian_id = g.guardian_id
ORDER BY s.last_name, s.first_name;

-- name: SearchStudentGuardian :one
SELECT
    s.last_name AS student_first_name,
    s.first_name AS student_last_name,
    g.guardian_name AS guardian_name,
    g.phone_number_1,
    g.phone_number_2,
    g.gender AS guardian_gender,
    g.profession AS guardian_profession
FROM students s
INNER JOIN student_guardians sg ON s.student_id = sg.student_id
INNER JOIN guardians g ON sg.guardian_id = g.guardian_id
WHERE s.student_id = $1
ORDER BY s.last_name, s.first_name;

-- name: DeleteGuardian :exec
DELETE FROM guardians WHERE guardian_id = $1;
