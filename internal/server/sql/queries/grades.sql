-- name: RetrieveClassRoom :many
SELECT
    vc.class_id,
    vc.class_name,
    vc.subject_id,
    vc.subject_name,
    vc.student_id,
    vc.student_no,
    vc.student_name,
    vc.teacher_id,
    vc.teacher_name,
    vc.term_id,
    vc.term_name,
    vc.academic_year_id
FROM virtual_classroom vc
WHERE vc.teacher_id = $1
ORDER BY vc.class_name, vc.student_no;

-- name: UpsertGrade :one
INSERT INTO grades (student_id, subject_id, term_id, score, remark)
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (student_id, subject_id, term_id)
DO UPDATE SET 
    score = EXCLUDED.score,
    remark = EXCLUDED.remark
RETURNING *;

-- name: ListGradesForClass :many
SELECT 
    sc.class_id,
    s.student_id,
    subj.subject_id,
    g.score,
    g.remark,
    sc.term_id
FROM student_classes sc
JOIN students s ON sc.student_id = s.student_id
JOIN subjects subj ON subj.class_id = sc.class_id
LEFT JOIN grades g 
  ON g.student_id = s.student_id 
  AND g.subject_id = subj.subject_id 
  AND g.term_id = sc.term_id
WHERE sc.class_id = $1;

-- name: ListGrades :many
SELECT *
FROM student_grades_view
ORDER BY class_name, student_no;
