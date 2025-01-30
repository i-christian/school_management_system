-- name: CreateSubject :exec
INSERT INTO
    subjects (class_id, name)
VALUES ($1, $2)
ON CONFLICT (class_id, name) DO NOTHING;

-- name: ListSubjects :many
SELECT
    subjects.subject_id,
    subjects.name AS SubjectName,
    classes.name AS ClassName
FROM subjects
INNER JOIN classes
    ON subjects.class_id = classes.class_id
ORDER BY subjects.name;

-- name: GetSubjectsByClassName :many
SELECT
    subjects.subject_id,
    subjects.name AS SubjectName,
    classes.name AS ClassName
FROM subjects
INNER JOIN classes
    ON subjects.class_id = classes.class_id
WHERE classes.name = $1
ORDER BY subjects.name;

-- name: EditSubject :exec
UPDATE subjects
SET class_id = COALESCE($2, class_id),
name = COALESCE($3, name)
WHERE subject_id = $1;

-- name: DeleteSubject :exec
DELETE FROM subjects WHERE subject_id = $1;
