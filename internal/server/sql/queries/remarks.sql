-- name: CreateRemark :one
INSERT INTO remarks (student_id, term_id, content_class_teacher, content_head_teacher) 
VALUES ($1, $2, $3, $4) RETURNING *;

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
    term.name AS AcademicTerm,
    remarks.content_class_teacher AS ClassTeacherRemarks,
    remarks.content_head_teacher AS HeadTeacherRemarks,
    remarks.updated_at
FROM remarks
INNER JOIN students 
    ON remarks.student_id = students.student_id
INNER JOIN term
    ON remarks.term_id = term.term_id;

-- name: EditRemark :exec
UPDATE remarks
SET term_id = COALESCE($2, term_id),
content_class_teacher = COALESCE($3, content_class_teacher),
content_head_teacher = COALESCE($4, content_head_teacher),
updated_at = COALESCE($5, updated_at)
WHERE remarks_id = $1;

-- name: DeleteRemark :exec
DELETE FROM remarks WHERE remarks_id = $1;
