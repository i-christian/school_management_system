package server

import (
	"net/http"
	"os"

	"school_management_system/cmd/web"

	"github.com/a-h/templ"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.CleanPath)
	r.Use(middleware.RequestID)
	r.Use(middleware.Compress(5, "text/html", "text/css"))

	r.Use(middleware.Recoverer)
	r.Use(middleware.Logger)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{os.Getenv("DOMAIN")},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// testing cookies implementation
	r.Get("/set", s.SetCookieHandler)
	r.Get("/get", s.GetCookieHandler)

	r.Get("/", s.HelloWorldHandler)

	fileServer := http.FileServer(http.FS(web.Files))
	r.Handle("/assets/*", fileServer)

	r.Get("/web", templ.Handler(web.HelloForm()).ServeHTTP)
	r.Post("/hello", HelloWebHandler)
	r.Handle("/404", templ.Handler(web.NotFoundComponent(), templ.WithStatus(http.StatusNotFound)))
	r.Get("/register", templ.Handler(web.Register()).ServeHTTP)

	return r
}
