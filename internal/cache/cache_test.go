package cache

import (
	"testing"
)

type user struct {
	name string
	age  int
}

func TestCache(t *testing.T) {
	myCache := New[string, user]()

	t.Run("test inserting into cache", func(t *testing.T) {
		myCache.Set("user1", user{
			name: "christian",
			age:  20,
		})

		want := user{
			"christian",
			20,
		}

		got, _ := myCache.Get("user1")

		if want != got {
			t.Errorf("got %v want %v", got, want)
		}
	})
}
