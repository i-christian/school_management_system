package server

import (
	"net/http"
	"os"

	"school_management_system/cmd/web"
	"school_management_system/cmd/web/dashboard/academics"
	"school_management_system/cmd/web/dashboard/userlist"

	"github.com/a-h/templ"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := chi.NewRouter()

	// Global middlewares
	r.Use(middleware.CleanPath)
	r.Use(middleware.RequestID)
	r.Use(secureHeaders)
	r.Use(middleware.Compress(5, "text/html", "text/css"))
	r.Use(middleware.Recoverer)
	r.Use(middleware.Logger)

	// CORS setup
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{os.Getenv("DOMAIN")},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Static file server
	fileServer := http.FileServer(http.FS(web.Files))
	r.Handle("/assets/*", fileServer)

	// PUBLIC ROUTES
	r.Group(func(r chi.Router) {
		r.Get("/", templ.Handler(web.Home()).ServeHTTP)
		r.With(s.RedirectIfAuthenticated).Get("/login", templ.Handler(web.Login()).ServeHTTP)
		r.Post("/login", s.LoginHandler)
	})

	// AUTHENTICATED USER ROUTES
	r.Group(func(r chi.Router) {
		r.Use(s.AuthMiddleware)

		r.Get("/profile", s.userProfile)
		r.Get("/logout/confirm", templ.Handler(web.LogoutConfirmHandler()).ServeHTTP)
		r.Get("/logout/cancel", s.LogoutCancelHandler)
		r.Post("/logout", s.LogoutHandler)
	})

	// USER MANAGEMENT (ADMIN)
	r.Route("/users", func(r chi.Router) {
		r.Use(s.AuthMiddleware)
		r.Use(s.RequireRoles("admin"))

		// Registration routes
		r.Get("/create", templ.Handler(userlist.CreateUserForm()).ServeHTTP)
		r.Post("/", s.Register)

		// Edit routes
		r.Get("/{id}/edit", s.ShowEditUserForm)
		r.Put("/{id}", s.EditUser)

		// Delete routes:
		r.Get("/{id}/delete", s.ShowDeleteConfirmation)
		r.Delete("/{id}", s.DeleteUser)
	})

	// DASHBOARD (ADMIN)
	r.Route("/dashboard", func(r chi.Router) {
		r.Use(s.AuthMiddleware)
		r.Use(s.RequireRoles("admin", "teacher", "headteacher", "accountant"))
		r.Get("/academics", s.GetAcademicsDetails)
		r.Get("/", s.Dashboard)
		r.Get("/userlist", s.ListUsers)
		r.Get("/total_users", s.GetTotalUsers)
		r.Get("/total_students", s.GetStudentsTotal)
		r.Get("/income", s.GetFees)
	})

	// ACADEMIC ADMINISTRATION (ADMIN)
	r.Route("/academics", func(r chi.Router) {
		r.Use(s.AuthMiddleware)

		r.Get("/years", s.ListAcademicYears)
		r.Get("/create", templ.Handler(academics.AcademicYearForm()).ServeHTTP)
		r.Post("/years", s.CreateAcademicYear)
		r.Get("/years/{id}/edit", s.ShowEditAcademicYear)
		r.Put("/years/{id}", s.EditAcademicYear)

		r.Get("/terms/{id}/create", s.CreateTermForm)
		r.Post("/terms/{id}", s.CreateTerm)
		r.Get("/terms/{id}/edit", s.ShowEditAcademicTerm)
		r.Put("/terms/{id}", s.EditTerm)
		r.Get("/year/{id}/terms", s.ListTerms)

		r.Get("/classes/create", s.ShowCreateClassForm)
		r.Post("/classes", s.CreateClass)
		r.Get("/classes", s.ListClasses)
		r.Get("/classes/{id}/edit", s.ShowEditClass)
		r.Put("/classes/{id}", s.EditClass)
		r.Delete("/classes/{id}", s.DeleteClass)
		r.Get("/classes/{id}/subjects", s.ListSubjects)

		r.Get("/subjects/{id}/create", s.ShowCreateSubjectForm)
		r.Post("/subjects/{id}", s.CreateSubject)
		r.Get("/subjects/{id}/edit", s.ShowEditSubject)
		r.Put("/subjects/{id}", s.EditSubject)
		r.Delete("/subjects/{id}", s.DeleteSubject)

		r.Get("/assignments", s.ListAssignments)
		r.Get("/assignments/create", s.ShowCreateAssignmentForm)
		r.Post("/assignments", s.CreateAssignment)
		r.Get("/assignments/{id}/edit", s.ShowEditAssignment)
		r.Put("/assignments/{id}", s.EditAssignment)
		r.Delete("/assignments/{id}", s.DeleteAssignment)
	})

	// STUDENT MANAGEMENT (ADMIN)
	r.Route("/students", func(r chi.Router) {
		r.Use(s.AuthMiddleware)
		r.Use(s.RequireRoles("admin"))

		r.Get("/", nil)
		r.Post("/", nil)
		r.Get("/{id}", nil)
		r.Put("/{id}", nil)
		r.Delete("/{id}", nil)

		r.Get("/student-classes", nil)
		r.Post("/student-classes", nil)
		r.Delete("/student-classes/{id}", nil)

		r.Post("/students/promotions", nil)
		r.Get("/guardians", nil)
		// More routes here
	})

	// ACADEMIC RECORDS
	r.Route("/grades", func(r chi.Router) {
		r.Use(s.AuthMiddleware)
		r.Use(s.RequireRoles("teacher", "classteacher", "headteacher"))
		r.Get("/student/{id}", nil)
		r.Post("/", nil)
		r.Put("/{id}", nil)
		r.Delete("/{id}", nil)
		r.Get("/remarks", nil)
	})

	r.Route("/fees", func(r chi.Router) {
		r.Use(s.AuthMiddleware)
		r.Use(s.RequireRoles("accountant"))

		r.Get("/", s.GetFees)
		r.Post("/", nil)
		r.Get("/student/{id}", nil)
	})

	r.Route("/discipline", func(r chi.Router) {
		r.Use(s.AuthMiddleware)
		r.Use(s.RequireRoles("headteacher", "teacher", "classteacher"))

		r.Get("/", nil)
		r.Post("/", nil)
		r.Put("/{id}", nil)
		r.Delete("/{id}", nil)
	})

	return r
}
