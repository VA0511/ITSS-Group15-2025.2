import React, { useRef, useEffect, useState } from 'react';
import { Bell, Check, Inbox } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@/hooks/useNotifications';
import useAuthStore from '@/store/useAuthStore';
import { cn } from '@/lib/utils';

const TYPE_STYLES = {
  booking_request:  'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  booking_accepted: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  booking_rejected: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  booking_cancelled:'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
};

function timeAgo(dateStr, t) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return t('notification_bell.time_ago.just_now');
  if (diff < 3600) return t('notification_bell.time_ago.minutes_ago', { count: Math.floor(diff / 60) });
  if (diff < 86400) return t('notification_bell.time_ago.hours_ago', { count: Math.floor(diff / 3600) });
  return t('notification_bell.time_ago.days_ago', { count: Math.floor(diff / 86400) });
}

const translateNotification = (n, t) => {
  const type = n.type;
  let title = n.title;
  let body = n.body;

  if (type === 'booking_request') {
    title = t('notification_bell.types.booking_request.title');
    const suffix = ' đã gửi yêu cầu đặt lịch tập';
    if (n.body && n.body.endsWith(suffix)) {
      const memberName = n.body.substring(0, n.body.length - suffix.length);
      body = t('notification_bell.types.booking_request.body', { memberName });
    } else {
      body = t('notification_bell.types.booking_request.body_fallback', { body: n.body });
    }
  } else if (type === 'booking_accepted') {
    title = t('notification_bell.types.booking_accepted.title');
    const prefix = 'PT ';
    const suffix = ' đã chấp nhận lịch tập của bạn';
    if (n.body && n.body.startsWith(prefix) && n.body.endsWith(suffix)) {
      const ptName = n.body.substring(prefix.length, n.body.length - suffix.length);
      body = t('notification_bell.types.booking_accepted.body', { ptName });
    } else {
      body = t('notification_bell.types.booking_accepted.body_fallback', { body: n.body });
    }
  } else if (type === 'booking_rejected') {
    title = t('notification_bell.types.booking_rejected.title');
    const prefix = 'PT ';
    const midText = ' đã từ chối lịch tập của bạn';
    if (n.body && n.body.startsWith(prefix) && n.body.includes(midText)) {
      const midIdx = n.body.indexOf(midText);
      const ptName = n.body.substring(prefix.length, midIdx);
      const remaining = n.body.substring(midIdx + midText.length);
      const reason = remaining.startsWith(': ') ? remaining.substring(2) : '';
      if (reason) {
        body = t('notification_bell.types.booking_rejected.body_with_reason', { ptName, reason });
      } else {
        body = t('notification_bell.types.booking_rejected.body', { ptName });
      }
    } else {
      body = t('notification_bell.types.booking_rejected.body_fallback', { body: n.body });
    }
  } else if (type === 'booking_cancelled') {
    title = t('notification_bell.types.booking_cancelled.title');
    if (n.body === 'Một lịch tập của bạn đã bị hủy') {
      body = t('notification_bell.types.booking_cancelled.body_member');
    } else {
      const prefix = 'Lịch tập với hội viên ';
      const suffix = ' đã bị hủy';
      if (n.body && n.body.startsWith(prefix) && n.body.endsWith(suffix)) {
        const memberName = n.body.substring(prefix.length, n.body.length - suffix.length);
        body = t('notification_bell.types.booking_cancelled.body_pt', { memberName });
      } else {
        body = t('notification_bell.types.booking_cancelled.body_fallback', { body: n.body });
      }
    }
  }

  return { title, body };
};

const NotificationBell = () => {
  const { t } = useTranslation('common');
  const { notifications, unreadCount, markAllRead, markOneRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = () => setOpen((prev) => !prev);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="relative rounded-full p-2.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white focus:outline-none"
        title={t('notification_bell.title')}
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
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{t('notification_bell.title')}</span>
            {notifications.some((n) => !n.read) && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-blue-600 hover:underline dark:text-blue-400"
              >
                <Check className="h-3 w-3" /> {t('notification_bell.mark_all_read')}
              </button>
            )}
          </div>

          {/* List */}
          <ul className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
            {notifications.length === 0 ? (
              <li className="flex flex-col items-center gap-2 py-8 text-gray-400 dark:text-gray-500">
                <Inbox className="h-8 w-8" />
                <span className="text-xs">{t('notification_bell.no_notifications')}</span>
              </li>
            ) : (
              notifications.map((n) => {
                const { title, body } = translateNotification(n, t);
                return (
                  <li
                    key={n.id}
                    onClick={() => !n.read && markOneRead(n.id)}
                    className={cn(
                      'flex gap-3 px-4 py-3 transition-colors',
                      !n.read
                        ? 'bg-blue-50/60 dark:bg-blue-900/10 cursor-pointer hover:bg-blue-100/60 dark:hover:bg-blue-900/20'
                        : 'opacity-70'
                    )}
                  >
                    <div className="relative shrink-0 mt-0.5">
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide h-fit block',
                          TYPE_STYLES[n.type] || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                        )}
                      >
                        {n.type === 'booking_request'  ? t('notification_bell.types.booking_request.badge')  :
                         n.type === 'booking_accepted' ? t('notification_bell.types.booking_accepted.badge') :
                         n.type === 'booking_rejected' ? t('notification_bell.types.booking_rejected.badge') :
                         n.type === 'booking_cancelled'? t('notification_bell.types.booking_cancelled.badge'):
                         t('notification_bell.types.default.badge')}
                      </span>
                      {!n.read && (
                        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 ring-1 ring-white dark:ring-gray-900" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-xs leading-snug', !n.read ? 'font-semibold text-gray-900 dark:text-white' : 'font-medium text-gray-600 dark:text-gray-400')}>
                        {title}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 leading-snug break-words">
                        {body}
                      </p>
                      <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">
                        {timeAgo(n.created_at, t)}
                      </p>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
