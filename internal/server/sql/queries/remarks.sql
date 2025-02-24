-- name: UpsertRemark :one
INSERT INTO remarks (student_id, term_id, content_class_teacher, content_head_teacher)
VALUES ($1, $2, $3, $4)
ON CONFLICT (student_id, term_id) DO UPDATE
  SET content_class_teacher = EXCLUDED.content_class_teacher,
      content_head_teacher   = EXCLUDED.content_head_teacher,
      updated_at           = CURRENT_TIMESTAMP
RETURNING *;


-- name: ListRemarksByClass :many
SELECT
  c.name AS class_name,
  s.student_no,
  s.student_id,
  s.last_name,
  s.first_name,
  s.middle_name,
  t.name AS academic_term,
  r.remarks_id,
  r.content_class_teacher AS class_teacher_remarks,
  r.content_head_teacher AS head_teacher_remarks,
  r.updated_at
FROM student_classes sc
INNER JOIN students s 
    ON sc.student_id = s.student_id
INNER JOIN classes c 
    ON sc.class_id = c.class_id
INNER JOIN term t 
    ON sc.term_id = t.term_id
LEFT JOIN remarks r 
    ON s.student_id = r.student_id 
   AND sc.term_id = r.term_id
ORDER BY c.name, s.last_name, s.first_name;

-- name: DeleteRemark :exec
DELETE FROM remarks WHERE remarks_id = $1;
