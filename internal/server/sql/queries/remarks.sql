-- name: UpsertRemark :one
INSERT INTO remarks (student_id, term_id, content_class_teacher, content_head_teacher)
VALUES ($1, $2, $3, $4)
ON CONFLICT (student_id, term_id) DO UPDATE
  SET content_class_teacher = EXCLUDED.content_class_teacher,
      content_head_teacher   = EXCLUDED.content_head_teacher,
      updated_at           = CURRENT_TIMESTAMP
RETURNING *;

-- name: GetRemark :one
SELECT
    remarks.remarks_id,
    students.last_name,
    students.first_name,
    term.name AS AcademicTerm,
    remarks.content_class_teacher AS ClassTeacherRemarks,
    remarks.content_head_teacher AS HeadTeacherRemarks,
    remarks.updated_at
FROM remarks
INNER JOIN students 
    ON remarks.student_id = students.student_id
INNER JOIN term
    ON remarks.term_id = term.term_id
WHERE students.student_id = $1;

-- name: ListRemarks :many
SELECT
    remarks.remarks_id,
    students.last_name,
    students.first_name,
    students.middle_name,
    term.name AS AcademicTerm,
    remarks.content_class_teacher AS ClassTeacherRemarks,
    remarks.content_head_teacher AS HeadTeacherRemarks,
    remarks.updated_at
FROM remarks
INNER JOIN students 
    ON remarks.student_id = students.student_id
INNER JOIN term
    ON remarks.term_id = term.term_id
;

-- name: DeleteRemark :exec
DELETE FROM remarks WHERE remarks_id = $1;
