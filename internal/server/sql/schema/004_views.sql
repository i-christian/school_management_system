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

CREATE OR REPLACE VIEW virtual_classroom AS
SELECT
    st_cl.student_id,
    s.subject_id,
    s.name AS subject_name,
    c.class_id,
    c.name AS class_name,
    u.user_id AS teacher_id,
    u.first_name || ' ' || u.last_name AS teacher_name,
    t.term_id,
    t.name AS term_name,
    t.academic_year_id
FROM
    student_classes st_cl
JOIN
    assignments a ON st_cl.class_id = a.class_id
JOIN
    subjects s ON a.subject_id = s.subject_id
JOIN
    classes c ON a.class_id = c.class_id
JOIN
    users u ON a.teacher_id = u.user_id
JOIN
    term t ON st_cl.term_id = t.term_id;

-- +goose Down
DROP VIEW student_grades_view;
DROP VIEW virtual_classroom;
