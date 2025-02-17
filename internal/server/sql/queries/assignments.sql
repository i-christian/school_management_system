-- name: CreateAssignments :one
INSERT INTO
    assignments (class_id, subject_id, teacher_id)
VALUES($1, $2, $3)
ON CONFLICT ON CONSTRAINT unique_class_subject_per_teacher DO NOTHING
RETURNING *;

-- name: ListAssignments :many
SELECT
    assignments.id,
    classes.name AS ClassRoom,
    subjects.name AS Subject,
    users.last_name AS Teacher_LastName,
    users.first_name AS Teacher_FirstName
FROM assignments
INNER JOIN classes
    ON assignments.class_id = classes.class_id
INNER JOIN subjects
    ON assignments.subject_id = subjects.subject_id
INNER JOIN users
    ON assignments.teacher_id = users.user_id
ORDER BY classes.name;

-- name: GetAssignment :one
SELECT
    assignments.id,
    assignments.class_id,
    assignments.subject_id,
    assignments.teacher_id,
    classes.name AS ClassRoom,
    subjects.name AS Subject,
    users.last_name AS Teacher_LastName,
    users.first_name AS Teacher_FirstName
FROM assignments
INNER JOIN classes
    ON assignments.class_id = classes.class_id
INNER JOIN subjects
    ON assignments.subject_id = subjects.subject_id
INNER JOIN users
    ON assignments.teacher_id = users.user_id
WHERE assignments.id = $1;

-- name: GetAssignedClasses :many
SELECT
    assignments.id,
    classes.name AS ClassRoom,
    subjects.name AS Subject
FROM assignments
INNER JOIN classes
    ON assignments.class_id = classes.class_id
INNER JOIN subjects
    ON assignments.subject_id = subjects.subject_id
WHERE teacher_id = $1
ORDER BY classes.name;

-- name: EditAssignments :exec
UPDATE assignments
SET class_id = COALESCE($2, class_id),
subject_id = COALESCE($3, subject_id),
teacher_id = COALESCE($4, teacher_id)
WHERE id = $1;

-- name: DeleteAssignments :exec
DELETE FROM assignments WHERE id = $1;
