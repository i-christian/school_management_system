-- name: CreateClassPromotions :one
INSERT INTO class_promotions (class_id, next_class_id)
VALUES ($1, $2) RETURNING *;

-- name: ListClassPromotions :many
SELECT 
  cp.class_id,
  c1.name AS current_class_name,
  cp.next_class_id,
  c2.name AS next_class_name
FROM class_promotions cp
JOIN classes c1 ON cp.class_id = c1.class_id
LEFT JOIN classes c2 ON cp.next_class_id = c2.class_id;

-- name: PromoteStudents :exec
WITH promoted_students AS (
    SELECT 
        sc.student_id,
        sc.class_id AS previous_class_id,
        COALESCE(cp.next_class_id, sc.class_id) AS new_class_id
    FROM student_classes sc
    JOIN students s ON sc.student_id = s.student_id
    LEFT JOIN class_promotions cp ON sc.class_id = cp.class_id
    WHERE s.status = 'active'
)
UPDATE student_classes sc
SET 
    previous_class_id = ps.previous_class_id,
    class_id = ps.new_class_id
FROM promoted_students ps
WHERE sc.student_id = ps.student_id;
