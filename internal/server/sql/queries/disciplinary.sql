-- name: UpsertDisciplinaryRecord :one
INSERT INTO discipline_records (student_id, term_id, date, description, action_taken, reported_by, notes)
VALUES ($1, $2, $3, $4, $5, $6, $7)
ON CONFLICT (student_id, term_id, date) DO UPDATE
  SET description  = EXCLUDED.description,
      action_taken = EXCLUDED.action_taken,
      reported_by  = EXCLUDED.reported_by,
      notes        = EXCLUDED.notes
RETURNING *;

-- name: ListDisciplinaryRecords :many
SELECT 
    dr.discipline_id,
    s.last_name,
    s.middle_name,
    s.first_name,
    dr.date,
    dr.description AS offense,
    dr.action_taken,
    dr.notes,
    t.name AS term_name,
    u.last_name AS reporter_last_name,
    u.first_name AS reporter_first_name  
FROM discipline_records dr
INNER JOIN students s ON dr.student_id = s.student_id
LEFT JOIN users u ON dr.reported_by = u.user_id
INNER JOIN term t ON dr.term_id = t.term_id
ORDER BY dr.date DESC;

-- name: DeleteDisciplinaryRecord :exec
DELETE FROM discipline_records WHERE discipline_id = $1;
