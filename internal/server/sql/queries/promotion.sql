-- name: UpdateStudentTerm :exec

INSERT INTO student_classes (student_id, class_id, term_id)
SELECT
    sc.student_id,
    CASE
        WHEN s.promoted THEN c.next_class_id
        ELSE c.class_id
    END AS new_class_id,
    t.term_id
FROM student_classes sc
JOIN students s ON sc.student_id = s.student_id
JOIN classes c ON sc.class_id = c.class_id
JOIN term t ON t.term_id = $1
WHERE s.status = 'active' AND t.end_date <= CURRENT_DATE;
