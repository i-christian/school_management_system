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

-- name: SetUpClassPromotions :many
select 
    c.class_id,
    c.name
from classes c
inner join academic_year ay
on c.class_id = ay.graduate_class_id
and ay.active = true

union 

select
    class_id,
    name
from classes
where name not ilike 'Graduates - %'
order by name;
