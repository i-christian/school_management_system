-- name: ListStudentSubjects :many
SELECT
    sc.term_id,
    s.student_id,
    subj.subject_id,
    s.last_name,
    s.first_name,
    s.middle_name,
    c.name AS className,
    subj.name AS Subject
FROM student_classes sc
INNER JOIN students s
    ON sc.student_id = s.student_id
INNER JOIN classes c
    ON sc.class_id = c.class_id
INNER JOIN subjects subj
    ON subj.class_id = sc.class_id
ORDER BY c.class_id, subj.name;

-- name: ListStudentSubjectsByTeacher :many
SELECT
    sc.term_id,
    s.student_id,
    subj.subject_id,
    s.last_name,
    s.first_name,
    s.middle_name,
    c.name AS className,
    subj.name AS Subject
FROM student_classes sc
INNER JOIN students s
    ON sc.student_id = s.student_id
INNER JOIN classes c
    ON sc.class_id = c.class_id
INNER JOIN subjects subj
    ON subj.class_id = sc.class_id
INNER JOIN assignments a
    ON a.class_id = sc.class_id
    AND a.subject_id = subj.subject_id
WHERE c.class_id = $2
  AND a.teacher_id = $1
ORDER BY c.class_id;

-- name: UpsertGrade :one
INSERT INTO grades (student_id, subject_id, term_id, score, remark)
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (student_id, subject_id, term_id)
DO UPDATE SET 
    score = EXCLUDED.score,
    remark = EXCLUDED.remark
RETURNING *;

-- name: GetGrade :one
SELECT
    grades.grade_id,
    students.last_name,
    students.first_name,
    subjects.name AS Subject,
    term.name AS AcademicTerm,
    grades.score,
    grades.remark
FROM grades
INNER JOIN students
    ON grades.student_id = students.student_id
INNER JOIN subjects
    ON grades.subject_id = subjects.subject_id
INNER JOIN term
    ON grades.term_id = term.term_id
WHERE students.student_id = $1;

-- name: ListGrades :many
SELECT
    grades.grade_id,
    students.last_name,
    students.first_name,
    subjects.name AS Subject,
    term.name AS AcademicTerm,
    grades.score,
    grades.remark
FROM grades
INNER JOIN students
    ON grades.student_id = students.student_id
INNER JOIN subjects
    ON grades.subject_id = subjects.subject_id
INNER JOIN term
    ON grades.term_id = term.term_id;

-- name: EditGrade :exec
UPDATE grades
SET student_id = COALESCE($2, student_id),
subject_id = COALESCE($3, subject_id),
term_id = COALESCE($4, term_id),
score = COALESCE($5, score),
remark = COALESCE($6, remark)
WHERE grade_id = $1;

-- name: DeleteGrade :exec
DELETE FROM grades WHERE grade_id = $1;
