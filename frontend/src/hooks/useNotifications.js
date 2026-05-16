import { useState, useEffect, useCallback, useRef } from 'react';
import useAuthStore from '@/store/useAuthStore';
import axios from '@/lib/axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function useNotifications() {
  const token = useAuthStore((state) => state.token);
  const [notifications, setNotifications] = useState([]);
  const [connected, setConnected] = useState(false);
  const esRef = useRef(null);

  // Fetch notification history on mount
  useEffect(() => {
    if (!token) return;
    axios.get('/notifications')
      .then((data) => {
        if (Array.isArray(data)) setNotifications(data);
      })
      .catch(() => {});
  }, [token]);

  // Open SSE stream
  useEffect(() => {
    if (!token) return;

    const url = `${API_URL}/notifications/stream?token=${encodeURIComponent(token)}`;
    let es = new EventSource(url);
    esRef.current = es;
    let opened = false;

    es.onopen = () => {
      opened = true;
      setConnected(true);
    };

    es.onmessage = (e) => {
      try {
        const n = JSON.parse(e.data);
        setNotifications((prev) => [n, ...prev].slice(0, 50));
      } catch {
        // ignore malformed events
      }
    };

    es.onerror = () => {
      setConnected(false);
      // If it never opened (e.g. backend not ready / 404), stop retrying
      if (!opened) {
        es.close();
        esRef.current = null;
      }
    };

    return () => {
      es.close();
      esRef.current = null;
      setConnected(false);
    };
  }, [token]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = useCallback(async () => {
    try {
      await axios.post('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // optimistically mark anyway
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  }, []);

  return { notifications, unreadCount, connected, markAllRead };
}
