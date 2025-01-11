package server

import (
	"encoding/json"
	"log/slog"
	"net/http"

	"school_management_system/cmd/web"
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

func HelloWebHandler(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
	}

	name := r.FormValue("name")
	component := web.HelloPost(name)
	err = component.Render(r.Context(), w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		slog.Error("Error rendering in HelloWebHandler\n", "Error Message", err.Error())
	}
}
