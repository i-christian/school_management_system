-- name: CreateClassPromotions :one
INSERT INTO class_promotions (class_id, next_class_id)
VALUES ($1, $2) RETURNING *;

-- name: ResetPromotions :exec
DELETE FROM class_promotions;

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
WITH promotion_record AS (
    INSERT INTO promotion_history (stored_term_id) VALUES ($1::UUID) RETURNING promotion_history_id, stored_term_id
),
promoted_students AS (
    SELECT
        sc.student_id,
        sc.class_id AS previous_class_id,
        cp.next_class_id,
        $2::UUID AS new_term_id,
        current_term.academic_year_id AS current_academic_year_id,
        new_term.academic_year_id AS new_academic_year_id,
        CASE
            WHEN cp.next_class_id IS NULL THEN TRUE
            ELSE FALSE
        END AS is_graduating,
        (SELECT promotion_history_id FROM promotion_record) AS promotion_history_id,
        s.promoted as student_promoted,
        s.status as student_status,
        s.graduated as student_graduated,
        sc.class_id as current_class_id
    FROM student_classes sc
    JOIN students s ON sc.student_id = s.student_id
    JOIN term current_term ON sc.term_id = current_term.term_id
    JOIN term new_term ON new_term.term_id = $2
    LEFT JOIN class_promotions cp ON sc.class_id = cp.class_id
    WHERE s.status = 'active'
      AND sc.term_id <> $2
      AND s.promoted = FALSE
),
insert_promotion_history_details AS (
    INSERT INTO student_promotion_history_details (
        promotion_history_id,
        student_id,
        previous_class_id,
        class_id,
        promoted,
        status,
        graduated
    )
    SELECT
        ps.promotion_history_id,
        ps.student_id,
        ps.previous_class_id,
        ps.current_class_id,
        ps.student_promoted,
        ps.student_status,
        ps.student_graduated
    FROM promoted_students ps
    RETURNING student_id
),
update_student_classes AS (
    UPDATE student_classes sc
    SET
        previous_class_id = ps.previous_class_id,
        class_id = CASE
            WHEN ps.current_academic_year_id <> ps.new_academic_year_id
            THEN COALESCE(ps.next_class_id, sc.class_id)
            ELSE sc.class_id
        END,
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

-- name: UndoPromoteStudents :exec
WITH last_promotion AS (
    SELECT promotion_history_id, stored_term_id
    FROM promotion_history
    WHERE term_id = $1::UUID AND is_undone = FALSE
    ORDER BY promotion_date DESC
    LIMIT 1
),
undone_promotion_history AS (
    UPDATE promotion_history
    SET is_undone = TRUE
    WHERE promotion_history_id = (SELECT promotion_history_id FROM last_promotion)
    RETURNING promotion_history_id, stored_term_id
),
promotion_details_to_revert AS (
    SELECT
        sphd.student_id,
        sphd.class_id AS original_class_id,
        sphd.previous_class_id AS original_previous_class_id,
        sphd.promoted AS original_promoted,
        sphd.status AS original_status,
        sphd.graduated AS original_graduated,
        l_p.stored_term_id AS term_id
    FROM student_promotion_history_details sphd
    INNER JOIN last_promotion l_p ON sphd.promotion_history_id = l_p.promotion_history_id
    WHERE sphd.promotion_history_id = (SELECT promotion_history_id FROM undone_promotion_history)
),
updated_student_classes AS (
    UPDATE student_classes sc
    SET
        previous_class_id = pdr.original_previous_class_id,
        class_id = pdr.original_class_id,
        term_id = pdr.term_id
    FROM promotion_details_to_revert pdr
    WHERE sc.student_id = pdr.student_id
    RETURNING sc.*
),
updated_students AS (
    UPDATE students s
    SET
        promoted = pdr.original_promoted,
        status = pdr.original_status,
        graduated = pdr.original_graduated
    FROM promotion_details_to_revert pdr
    WHERE s.student_id = pdr.student_id
    RETURNING s.*
)
SELECT
    (SELECT COUNT(*) FROM updated_student_classes) AS student_classes_updated,
    (SELECT COUNT(*) FROM updated_students) AS students_updated;
