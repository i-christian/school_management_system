-- name: CreateClassPromotions :one
INSERT INTO class_promotions (class_id, next_class_id)
VALUES ($1, $2) RETURNING *;

-- name: ListClassPromotions :many
SELECT * FROM class_promotions;

-- name: UpdateStudentTerm :exec
INSERT INTO student_classes (student_id, class_id, term_id)
SELECT
    sc.student_id,
    CASE
        WHEN s.promoted AND cp.next_class_id IS NOT NULL THEN cp.next_class_id
        ELSE sc.class_id
    END AS new_class_id,
    t.term_id
FROM student_classes sc
JOIN students s ON sc.student_id = s.student_id
JOIN classes c ON sc.class_id = c.class_id
LEFT JOIN class_promotions cp ON c.class_id = cp.class_id
JOIN term t ON t.term_id = $1
WHERE s.status = 'active'
  AND t.end_date <= CURRENT_DATE;

