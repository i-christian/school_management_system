-- name: CreateClassPromotions :one
INSERT INTO class_promotions (class_id)
VALUES ('5a2940f6-a1db-406d-b814-4271c91fa5ff') RETURNING *;


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
        cp.next_class_id,
        $1::UUID AS new_term_id,
        CASE
            WHEN cp.next_class_id IS NULL THEN TRUE
            ELSE FALSE
        END AS is_graduating
    FROM student_classes sc
    JOIN students s ON sc.student_id = s.student_id
    LEFT JOIN class_promotions cp ON sc.class_id = cp.class_id
    WHERE s.status = 'active'
      AND sc.term_id <> $1
),
update_student_classes AS (
    UPDATE student_classes sc
    SET
        previous_class_id = ps.previous_class_id,
        class_id = COALESCE(ps.next_class_id, sc.class_id),
        term_id = ps.new_term_id
    FROM promoted_students ps
    WHERE sc.student_id = ps.student_id
    RETURNING sc.student_id
)
UPDATE students s
SET
    promoted = TRUE,
    status = CASE
                WHEN ps.is_graduating THEN 'graduated'
                ELSE s.status
             END,
    graduated = CASE
                   WHEN ps.is_graduating THEN TRUE
                   ELSE s.graduated
                END
FROM promoted_students ps
WHERE s.student_id = ps.student_id;

