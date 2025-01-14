-- name: CreateSession :exec
INSERT INTO sessions (session_id, user_id) 
VALUES ($1, $2);

-- name: GetSession :one
SELECT session_id, expires FROM sessions WHERE user_id = $1;

-- name: RefreshSession :exec
UPDATE sessions
  SET expires = COALESCE($2, expires)
WHERE user_id = $1;

-- name: DeleteSession :exec
DELETE FROM sessions
WHERE user_id = $1;
