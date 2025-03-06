-- name: GetStudentReportCard :one
SELECT 
    sgv.student_id,
    sgv.student_no,
    sgv.last_name,
    sgv.first_name,
    sgv.middle_name,
    sgv.class_id,
    sgv.class_name,
    sgv.grades,
    r.content_class_teacher AS class_teacher_remark,
    r.content_head_teacher AS head_teacher_remark
FROM student_grades_view sgv
LEFT JOIN remarks r 
    ON r.student_id = sgv.student_id 
WHERE sgv.student_id = $1;


-- name: ListStudentReportCards :many
SELECT 
    sgv.student_id,
    sgv.student_no,
    sgv.last_name,
    sgv.first_name,
    sgv.middle_name,
    sgv.class_id,
    sgv.class_name,
    sgv.grades,
    r.content_class_teacher AS class_teacher_remark,
    r.content_head_teacher AS head_teacher_remark
FROM student_grades_view sgv
LEFT JOIN remarks r 
    ON r.student_id = sgv.student_id 
ORDER BY sgv.class_id = $1;
