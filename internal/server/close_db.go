package server

import (
	"context"
	"log/slog"
)

func (s *Server) CloseDbConn() {
	if err := s.conn.Close(context.Background()); err != nil {
		slog.Error("Error closing database connection", "error", err)
	}
}
