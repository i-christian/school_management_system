// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: sessions.sql

package database

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

const createSession = `-- name: CreateSession :exec
INSERT INTO sessions (session_id, user_id, expires) 
  VALUES ($1, $2, $3)
  ON CONFLICT (user_id) 
DO UPDATE
  SET
    session_id = EXCLUDED.session_id,
    expires = EXCLUDED.expires
`

type CreateSessionParams struct {
	SessionID uuid.UUID          `json:"session_id"`
	UserID    uuid.UUID          `json:"user_id"`
	Expires   pgtype.Timestamptz `json:"expires"`
}

func (q *Queries) CreateSession(ctx context.Context, arg CreateSessionParams) error {
	_, err := q.db.Exec(ctx, createSession, arg.SessionID, arg.UserID, arg.Expires)
	return err
}

const deleteSession = `-- name: DeleteSession :exec
DELETE FROM sessions
WHERE user_id = $1
`

func (q *Queries) DeleteSession(ctx context.Context, userID uuid.UUID) error {
	_, err := q.db.Exec(ctx, deleteSession, userID)
	return err
}

const getSession = `-- name: GetSession :one
SELECT 
  sessions.user_id,
  sessions.session_id,
  roles.name AS role,
  sessions.expires
FROM sessions
INNER JOIN users
  ON sessions.user_id = users.user_id
INNER JOIN roles 
  ON users.role_id = roles.role_id
WHERE session_id = $1
`

type GetSessionRow struct {
	UserID    uuid.UUID          `json:"user_id"`
	SessionID uuid.UUID          `json:"session_id"`
	Role      string             `json:"role"`
	Expires   pgtype.Timestamptz `json:"expires"`
}

func (q *Queries) GetSession(ctx context.Context, sessionID uuid.UUID) (GetSessionRow, error) {
	row := q.db.QueryRow(ctx, getSession, sessionID)
	var i GetSessionRow
	err := row.Scan(
		&i.UserID,
		&i.SessionID,
		&i.Role,
		&i.Expires,
	)
	return i, err
}

const refreshSession = `-- name: RefreshSession :exec
UPDATE sessions
  SET expires = COALESCE($2, expires),
  session_id = COALESCE($3, session_id)
WHERE user_id = $1
`

type RefreshSessionParams struct {
	UserID    uuid.UUID          `json:"user_id"`
	Expires   pgtype.Timestamptz `json:"expires"`
	SessionID uuid.UUID          `json:"session_id"`
}

func (q *Queries) RefreshSession(ctx context.Context, arg RefreshSessionParams) error {
	_, err := q.db.Exec(ctx, refreshSession, arg.UserID, arg.Expires, arg.SessionID)
	return err
}
