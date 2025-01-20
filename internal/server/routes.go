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

	r.Get("/", templ.Handler(web.Home()).ServeHTTP)

	fileServer := http.FileServer(http.FS(web.Files))
	r.Handle("/assets/*", fileServer)

	r.Get("/create", templ.Handler(web.Register()).ServeHTTP)
	r.Post("/register", s.Register)

	r.Get("/login", templ.Handler(web.Login()).ServeHTTP)

	// dashboard routes
	r.Get("/dashboard", templ.Handler(web.Dashboard()).ServeHTTP)

	return r
}
