package server

import "net/http"

// CreateClass handler method
func (s *Server) CreateClass(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}

	err := r.ParseForm()
	if err != nil {
		writeError(w, http.StatusUnprocessableEntity, "wrong parameters")
		return
	}

	name := r.FormValue("class_name")

	err = s.queries.CreateClass(r.Context(), name)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}
}
