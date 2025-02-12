package server

func (s *Server) CloseDbConn() {
	s.conn.Close()
}
