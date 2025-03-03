-- name: CreateClass :exec
INSERT INTO classes (name)
VALUES ($1)
ON CONFLICT (name) DO NOTHING
RETURNING *;

-- name: ListClasses :many
SELECT * FROM classes
WHERE name NOT ILIKE 'Graduates - %'
ORDER BY name;

-- name: GetClass :one
SELECT * FROM classes WHERE class_id = $1;

-- name: EditClass :exec
UPDATE classes
SET name = COALESCE($2, name)
WHERE class_id = $1;

-- name: DeleteClass :exec
DELETE FROM classes WHERE class_id = $1;

-- name: GetCurrentGraduateClass :one
SELECT 
    c.*,
    ay.name AS AcademicYear
FROM classes c
INNER JOIN academic_year ay
    ON c.class_id = ay.graduate_class_id
WHERE ay.academic_year_id = $1;
