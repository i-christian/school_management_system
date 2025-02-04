package server

import (
	"context"
	"encoding/hex"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"school_management_system/internal/database"

	"github.com/pashagolub/pgxmock/v4"
)

func generateKey() []byte {
	secretKey, err := hex.DecodeString(os.Getenv("RANDOM_HEX"))
	if err != nil {
		slog.Error(err.Error())
	}

	return secretKey
}

func TestAuthMiddleware_NoSessionCookie(t *testing.T) {
	mockConn, err := pgxmock.NewConn()
	if err != nil {
		t.Fatalf("failed to create pgxmock connection: %v", err)
	}
	defer mockConn.Close(context.Background())

	queries := database.New(mockConn)

	s := &Server{
		SecretKey: generateKey(),
		queries:   queries,
	}

	nextHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("next called"))
	})
	handler := s.AuthMiddleware(nextHandler)

	req := httptest.NewRequest("GET", "/", nil)
	rec := httptest.NewRecorder()

	handler.ServeHTTP(rec, req)

	resp := rec.Result()
	if resp.StatusCode != http.StatusFound {
		t.Errorf("expected status %d; got %d", http.StatusFound, resp.StatusCode)
	}

	location := resp.Header.Get("Location")
	if location != "/login" {
		t.Errorf("expected redirect to /login; got %s", location)
	}

	if err := mockConn.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestSecureHeaders(t *testing.T) {
	nextHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("ok"))
	})
	handler := secureHeaders(nextHandler)

	req := httptest.NewRequest("GET", "/", nil)
	rec := httptest.NewRecorder()

	handler.ServeHTTP(rec, req)
	resp := rec.Result()

	expectedHeaders := map[string]string{
		"Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' data: fonts.gstatic.com",
		"Referrer-Policy":         "origin-when-cross-origin",
		"X-Content-Type-Options":  "nosniff",
		"X-Frame-Options":         "deny",
		"X-XSS-Protection":        "0",
	}

	for key, expected := range expectedHeaders {
		if got := resp.Header.Get(key); got != expected {
			t.Errorf("header %s: expected %q; got %q", key, expected, got)
		}
	}
}
