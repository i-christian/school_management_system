-- name: CreateSubject :exec
INSERT INTO
    subjects (class_id, name)
VALUES ($1, $2)
ON CONFLICT ON CONSTRAINT unique_subject_name_per_class DO NOTHING;

-- name: ListSubjects :many
SELECT
    subjects.subject_id,
    subjects.name AS SubjectName,
    classes.name AS ClassName
FROM subjects
INNER JOIN classes
    ON subjects.class_id = classes.class_id
GROUP BY classes.name
ORDER BY subjects.name;

-- name: EditSubject :exec
UPDATE subjects
SET name = COALESCE($2, name)
WHERE subject_id = $1;

-- name: DeleteSubject :exec
DELETE FROM subjects WHERE subject_id = $1;
