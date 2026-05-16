import React, { useRef, useEffect, useState } from 'react';
import { Bell, Check, Inbox } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';

const TYPE_STYLES = {
  booking_request:  'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  booking_accepted: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  booking_rejected: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  booking_cancelled:'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
};

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return 'Vừa xong';
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
}

const NotificationBell = () => {
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = () => {
    setOpen((prev) => !prev);
    if (!open && unreadCount > 0) {
      // Mark all read when opening the panel
      markAllRead();
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="relative rounded-full p-2.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white focus:outline-none"
        title="Thông báo"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-gray-950">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900 z-50">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">Thông báo</span>
            {notifications.some((n) => !n.read) && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-blue-600 hover:underline dark:text-blue-400"
              >
                <Check className="h-3 w-3" /> Đánh dấu đã đọc
              </button>
            )}
          </div>

          {/* List */}
          <ul className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
            {notifications.length === 0 ? (
              <li className="flex flex-col items-center gap-2 py-8 text-gray-400 dark:text-gray-500">
                <Inbox className="h-8 w-8" />
                <span className="text-xs">Không có thông báo nào</span>
              </li>
            ) : (
              notifications.map((n) => (
                <li
                  key={n.id}
                  className={cn(
                    'flex gap-3 px-4 py-3 transition-colors',
                    !n.read ? 'bg-blue-50/60 dark:bg-blue-900/10' : ''
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide h-fit',
                      TYPE_STYLES[n.type] || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                    )}
                  >
                    {n.type === 'booking_request'  ? 'Mới'    :
                     n.type === 'booking_accepted' ? 'Chấp nhận' :
                     n.type === 'booking_rejected' ? 'Từ chối' :
                     n.type === 'booking_cancelled'? 'Hủy'    : 'TB'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white leading-snug">
                      {n.title}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 leading-snug break-words">
                      {n.body}
                    </p>
                    <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">
                      {timeAgo(n.created_at)}
                    </p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
