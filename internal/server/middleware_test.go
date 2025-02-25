// middleware_test.go
package server

import (
	"context"
	"encoding/hex"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"school_management_system/internal/database"

	"github.com/pashagolub/pgxmock/v4"
)

// generateKey returns a secret key (from env or a default value) for encryption/decryption.
func generateKey() []byte {
	hexStr := os.Getenv("RANDOM_HEX")
	if hexStr == "" {
		hexStr = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
	}
	secretKey, err := hex.DecodeString(hexStr)
	if err != nil {
		panic(err)
	}
	return secretKey
}

// --- AuthMiddleware Tests ---

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
		fmt.Fprint(w, "next called")
	})
	h := s.AuthMiddleware(nextHandler)

	req := httptest.NewRequest("GET", "/", nil)
	rec := httptest.NewRecorder()

	h.ServeHTTP(rec, req)
	resp := rec.Result()

	if resp.StatusCode != http.StatusFound {
		t.Errorf("expected status %d; got %d", http.StatusFound, resp.StatusCode)
	}
	if loc := resp.Header.Get("Location"); loc != "/login" {
		t.Errorf("expected redirect to /login; got %s", loc)
	}
	if err := mockConn.ExpectationsWereMet(); err != nil {
		t.Errorf("unfulfilled expectations: %s", err)
	}
}

func TestRedirectIfAuthenticated_NoSession(t *testing.T) {
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

	nextCalled := false
	nextHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		nextCalled = true
		fmt.Fprint(w, "next called")
	})
	h := s.RedirectIfAuthenticated(nextHandler)

	req := httptest.NewRequest("GET", "/", nil)
	rec := httptest.NewRecorder()

	h.ServeHTTP(rec, req)
	resp := rec.Result()

	if !nextCalled {
		t.Error("expected next handler to be called when no valid session exists")
	}
	if resp.StatusCode != http.StatusOK {
		t.Errorf("expected status 200; got %d", resp.StatusCode)
	}
}

// --- secureHeaders Test ---

func TestSecureHeaders(t *testing.T) {
	nextHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "ok")
	})
	h := secureHeaders(nextHandler)

	req := httptest.NewRequest("GET", "/", nil)
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, req)
	resp := rec.Result()

	expectedHeaders := map[string]string{
		"Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' data: fonts.gstatic.com",
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
