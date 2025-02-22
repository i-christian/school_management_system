-- name: UpsertGrade :one
INSERT INTO grades (student_id, subject_id, term_id, score, remark)
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (student_id, subject_id, term_id)
DO UPDATE SET 
    score = EXCLUDED.score,
    remark = EXCLUDED.remark
RETURNING *;

-- name: GetGrades :one
SELECT
    s.student_no,
    s.last_name,
    s.first_name,
    s.middle_name,
    jsonb_object_agg(
        sub.name,
        jsonb_build_object(
            'grade_id', g.grade_id,
            'score', g.score,
            'remark', g.remark
        )
    ) AS grades
FROM students s
JOIN student_classes sc ON s.student_id = sc.student_id
JOIN subjects sub ON sc.class_id = sub.class_id
LEFT JOIN grades g ON s.student_id = g.student_id
                   AND sub.subject_id = g.subject_id
                   AND sc.term_id = g.term_id
WHERE s.student_id = $1
GROUP BY s.student_no, s.last_name, s.first_name, s.middle_name;

-- name: ListGrades :many
SELECT
    s.student_no,
    s.last_name,
    s.first_name,
    s.middle_name,
    jsonb_object_agg(
        sub.name,
        jsonb_build_object(
            'grade_id', g.grade_id,
            'score', g.score,
            'remark', g.remark
        )
    ) AS grades
FROM students s
JOIN student_classes sc ON s.student_id = sc.student_id
JOIN subjects sub ON sc.class_id = sub.class_id
LEFT JOIN grades g ON s.student_id = g.student_id
                   AND sub.subject_id = g.subject_id
                   AND sc.term_id = g.term_id
GROUP BY s.student_no, s.last_name, s.first_name, s.middle_name
ORDER BY s.student_no;

-- name: EditGrade :exec
UPDATE grades
SET score = COALESCE($2, score),
    remark = COALESCE($3, remark)
WHERE grade_id = $1;

-- name: DeleteGrade :exec
DELETE FROM grades WHERE grade_id = $1;
