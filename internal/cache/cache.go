package cache

import "sync"

// Cache is a simple in-memory key-value cache implementation.
type Cache[K comparable, V any] struct {
	items map[K]V
	mu    sync.Mutex
}

// New creates a new Cache instance
func New[K comparable, V any]() *Cache[K, V] {
	return &Cache[K, V]{
		items: make(map[K]V),
	}
}

// Set adds or updates a key-value pair in the cache
func (c *Cache[K, V]) Set(key K, value V) {
	c.mu.Lock()
	defer c.mu.Unlock()

	_, exists := c.items[key]
	if exists {
		delete(c.items, key)
	}

	c.items[key] = value
}

// Get retrieves the value associated with the given key from the cache.
// bool return value will be false if no matching key is found, and true otherwise
func (c *Cache[K, V]) Get(key K) (V, bool) {
	c.mu.Lock()
	defer c.mu.Unlock()

	value, exists := c.items[key]
	return value, exists
}

// Remove deletes the key-value pair with the specified key from the cache
func (c *Cache[K, V]) Remove(key K) {
	c.mu.Lock()
	defer c.mu.Unlock()

	delete(c.items, key)
}
