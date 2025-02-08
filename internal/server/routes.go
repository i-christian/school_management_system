package server

import (
	"net/http"
	"os"

	"school_management_system/cmd/web"
	"school_management_system/cmd/web/dashboard"

	"github.com/a-h/templ"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.CleanPath)
	r.Use(middleware.RequestID)
	r.Use(secureHeaders)
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

	// Serve static assets globally
	fileServer := http.FileServer(http.FS(web.Files))
	r.Handle("/assets/*", fileServer)

	// public routes
	r.Route("/", func(r chi.Router) {
		r.Get("/", templ.Handler(web.Home()).ServeHTTP)
		r.With(s.RedirectIfAuthenticated).Get("/login", templ.Handler(web.Login()).ServeHTTP)
		r.Post("/login", s.LoginHandler)
		r.With(s.AuthMiddleware).Get("/details", s.userDetails)
	})

	// private user routes
	r.Route("/user", func(r chi.Router) {
		r.Use(s.AuthMiddleware)
		r.Get("/", templ.Handler(dashboard.CreateUserForm()).ServeHTTP)
		r.Post("/", s.Register)
		r.Put("/{id}", s.EditUser)
		r.Delete("/{id}", s.DeleteUser)

		r.Get("/logout/confirm", templ.Handler(web.LogoutConfirmHandler()).ServeHTTP)
		r.Get("/logout/cancel", s.LogoutCancelHandler)
		r.Post("/logout", s.LogoutHandler)
	})

	// private dashboard routes
	r.Route("/dashboard", func(r chi.Router) {
		r.Use(s.AuthMiddleware)
		r.Use(s.RequireRoles("admin"))
		r.Get("/", templ.Handler(web.Dashboard()).ServeHTTP)
		r.Get("/userlist", s.ListUsers)
		r.Get("/total_users", s.GetTotalUsers)
		r.Get("/total_students", s.GetStudentsTotal)
		r.Get("/income", s.GetFees)
	})

	return r
}
