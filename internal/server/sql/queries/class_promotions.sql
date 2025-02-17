-- name: CreateClassPromotions :one
INSERT INTO class_promotions (class_id, next_class_id)
VALUES ($1, $2) RETURNING *;

-- name: ListClassPromotions :many
SELECT * FROM class_promotions;

-- name: UpdateStudentTerm :exec
WITH promoted_students AS (
    SELECT
        sc.student_id,
        sc.class_id AS previous_class_id,
        COALESCE(cp.next_class_id, sc.class_id) AS new_class_id,
        $1 AS term_id
    FROM student_classes sc
    JOIN students s ON sc.student_id = s.student_id
    LEFT JOIN class_promotions cp ON sc.class_id = cp.class_id
    WHERE s.status = 'active'
)
INSERT INTO student_classes (student_id, previous_class_id, class_id, term_id)
SELECT student_id, previous_class_id, new_class_id, term_id FROM promoted_students;
