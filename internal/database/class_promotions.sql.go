// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: class_promotions.sql

package database

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

const createClassPromotions = `-- name: CreateClassPromotions :one
INSERT INTO class_promotions (class_id, next_class_id)
VALUES ($1, $2) RETURNING class_id, next_class_id
`

type CreateClassPromotionsParams struct {
	ClassID     uuid.UUID   `json:"class_id"`
	NextClassID pgtype.UUID `json:"next_class_id"`
}

func (q *Queries) CreateClassPromotions(ctx context.Context, arg CreateClassPromotionsParams) (ClassPromotion, error) {
	row := q.db.QueryRow(ctx, createClassPromotions, arg.ClassID, arg.NextClassID)
	var i ClassPromotion
	err := row.Scan(&i.ClassID, &i.NextClassID)
	return i, err
}

const listClassPromotions = `-- name: ListClassPromotions :many
SELECT 
  cp.class_id,
  c1.name AS current_class_name,
  cp.next_class_id,
  c2.name AS next_class_name
FROM class_promotions cp
JOIN classes c1 ON cp.class_id = c1.class_id
LEFT JOIN classes c2 ON cp.next_class_id = c2.class_id
`

type ListClassPromotionsRow struct {
	ClassID          uuid.UUID   `json:"class_id"`
	CurrentClassName string      `json:"current_class_name"`
	NextClassID      pgtype.UUID `json:"next_class_id"`
	NextClassName    pgtype.Text `json:"next_class_name"`
}

func (q *Queries) ListClassPromotions(ctx context.Context) ([]ListClassPromotionsRow, error) {
	rows, err := q.db.Query(ctx, listClassPromotions)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []ListClassPromotionsRow{}
	for rows.Next() {
		var i ListClassPromotionsRow
		if err := rows.Scan(
			&i.ClassID,
			&i.CurrentClassName,
			&i.NextClassID,
			&i.NextClassName,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const promoteStudents = `-- name: PromoteStudents :exec
WITH promoted_students AS (
    SELECT 
        sc.student_id,
        sc.class_id AS previous_class_id,
        COALESCE(cp.next_class_id, sc.class_id) AS new_class_id
    FROM student_classes sc
    JOIN students s ON sc.student_id = s.student_id
    LEFT JOIN class_promotions cp ON sc.class_id = cp.class_id
    WHERE s.status = 'active'
)
UPDATE student_classes sc
SET 
    previous_class_id = ps.previous_class_id,
    class_id = ps.new_class_id
FROM promoted_students ps
WHERE sc.student_id = ps.student_id
`

func (q *Queries) PromoteStudents(ctx context.Context) error {
	_, err := q.db.Exec(ctx, promoteStudents)
	return err
}
