package notification

import (
	"sync"
	"sync/atomic"
	"time"
)

type Notification struct {
	ID        int64     `json:"id"`
	Type      string    `json:"type"`
	Title     string    `json:"title"`
	Body      string    `json:"body"`
	Read      bool      `json:"read"`
	CreatedAt time.Time `json:"created_at"`
}

const maxHistory = 50

type Hub struct {
	mu      sync.Mutex
	clients map[int]map[chan Notification]struct{}
	history map[int][]Notification
	seq     int64
}

func NewHub() *Hub {
	return &Hub{
		clients: make(map[int]map[chan Notification]struct{}),
		history: make(map[int][]Notification),
	}
}

func (h *Hub) Subscribe(accountID int) chan Notification {
	ch := make(chan Notification, 16)
	h.mu.Lock()
	if h.clients[accountID] == nil {
		h.clients[accountID] = make(map[chan Notification]struct{})
	}
	h.clients[accountID][ch] = struct{}{}
	h.mu.Unlock()
	return ch
}

func (h *Hub) Unsubscribe(accountID int, ch chan Notification) {
	h.mu.Lock()
	if chs, ok := h.clients[accountID]; ok {
		delete(chs, ch)
		if len(chs) == 0 {
			delete(h.clients, accountID)
		}
	}
	h.mu.Unlock()
}

func (h *Hub) Push(accountID int, typ, title, body string) {
	n := Notification{
		ID:        atomic.AddInt64(&h.seq, 1),
		Type:      typ,
		Title:     title,
		Body:      body,
		Read:      false,
		CreatedAt: time.Now(),
	}
	h.mu.Lock()
	defer h.mu.Unlock()

	hist := h.history[accountID]
	hist = append(hist, n)
	if len(hist) > maxHistory {
		hist = hist[len(hist)-maxHistory:]
	}
	h.history[accountID] = hist

	for ch := range h.clients[accountID] {
		select {
		case ch <- n:
		default:
		}
	}
}

func (h *Hub) GetHistory(accountID int) []Notification {
	h.mu.Lock()
	defer h.mu.Unlock()
	hist := h.history[accountID]
	result := make([]Notification, len(hist))
	copy(result, hist)
	return result
}

func (h *Hub) MarkAllRead(accountID int) {
	h.mu.Lock()
	defer h.mu.Unlock()
	for i := range h.history[accountID] {
		h.history[accountID][i].Read = true
	}
}
