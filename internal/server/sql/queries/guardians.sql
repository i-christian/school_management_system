-- name: UpdateGuardianAndLink :exec
UPDATE guardians
SET guardian_name = COALESCE($2, guardian_name),
    phone_number_1 = COALESCE($3, phone_number_1),
    phone_number_2 = COALESCE($4, phone_number_2),
    gender = COALESCE($5, gender),
    profession = COALESCE($6, profession)
WHERE guardian_id = $1;

-- name: DeleteGuardianAndUnlink :exec
WITH deleted_guardian AS (
    DELETE FROM guardians
    WHERE guardians.guardian_id = $1
    RETURNING guardians.guardian_id
)
DELETE FROM student_guardians
WHERE student_guardians.guardian_id = (SELECT deleted_guardian.guardian_id FROM deleted_guardian);

-- name: GetStudentAndLinkedGuardians :many
SELECT s.last_name AS student_first_name, s.first_name AS student_last_name, s.gender AS student_gender, g.*
FROM students s
LEFT JOIN student_guardians sg ON s.student_id = sg.student_id
LEFT JOIN guardians g ON sg.guardian_id = g.guardian_id
WHERE s.student_id = $1;

-- name: GetAllStudentGuardianLinks :many
SELECT s.last_name AS student_first_name, s.first_name AS student_last_name, g.guardian_name AS guardian_name, g.phone_number_1, g.phone_number_2, g.gender AS guardian_gender, g.profession AS guardian_profession
FROM students s
INNER JOIN student_guardians sg ON s.student_id = sg.student_id
INNER JOIN guardians g ON sg.guardian_id = g.guardian_id
ORDER BY s.last_name;
