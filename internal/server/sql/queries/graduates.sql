-- name: CreateGraduateClass :one
INSERT INTO classes (name) VALUES ($1) RETURNING *;

-- name: ListGraduatesByAcademicYear :many
SELECT
  s.student_no,
  s.first_name,
  s.middle_name,
  s.last_name,
  s.gender,
  s.graduated,
  c.name AS graduate_class_name
FROM students s
JOIN student_classes sc ON s.student_id = sc.student_id
JOIN term t ON sc.term_id = t.term_id
JOIN academic_year ay ON t.academic_year_id = ay.academic_year_id
LEFT JOIN classes c ON sc.class_id = c.class_id
WHERE s.graduated = TRUE
  AND ay.academic_year_id = '83d7d113-4a1b-4037-a5dc-83a3a79d1e96'
  AND c.name ILIKE 'Graduates - %';
