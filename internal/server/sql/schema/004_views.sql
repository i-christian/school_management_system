-- +goose Up
CREATE OR REPLACE VIEW student_grades_view AS
SELECT
    s.student_id,
    s.student_no,
    s.last_name,
    s.first_name,
    s.middle_name,
    c.class_id,
    c.name AS class_name,
    jsonb_object_agg(
        sub.subject_id,
        jsonb_build_object(
            'grade_id', g.grade_id,
            'score', g.score,
            'remark', g.remark
        )
    ) AS grades
FROM students s
JOIN student_classes sc ON s.student_id = sc.student_id
JOIN classes c ON sc.class_id = c.class_id
JOIN subjects sub ON sc.class_id = sub.class_id
LEFT JOIN grades g ON s.student_id = g.student_id
                   AND sub.subject_id = g.subject_id
                   AND sc.term_id = g.term_id
GROUP BY s.student_id, s.student_no, s.last_name, s.first_name, s.middle_name, c.name, c.class_id;

-- +goose Down
DROP VIEW student_grades_view;
