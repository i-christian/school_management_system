package server

import (
	"encoding/json"
	"log/slog"
	"net/http"
)

func (s *Server) HelloWorldHandler(w http.ResponseWriter, r *http.Request) {
	resp := make(map[string]string)
	resp["message"] = "Hello World"

	jsonResp, err := json.Marshal(resp)
	if err != nil {
		slog.Error("error handling JSON marshal\n", "Error Message:", err)
	}

	_, _ = w.Write(jsonResp)
}
