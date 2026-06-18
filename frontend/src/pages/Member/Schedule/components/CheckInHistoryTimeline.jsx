import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, Dumbbell, Calendar, MapPin, User, Clock } from 'lucide-react';

/* ─── helpers ─── */
const getMonthKey = (isoString) => isoString.slice(0, 7);

const formatMonthHeading = (monthKey, locale) => {
  const [year, month] = monthKey.split('-');
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
};

const formatDateTime = (isoString, locale) => {
  const d = new Date(isoString);
  return {
    weekday: d.toLocaleDateString(locale, { weekday: 'short' }),
    date: d.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }),
    time: d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }),
  };
};

/* ─── Sub-components ─── */

const StatsBadge = ({ icon: Icon, label, value, colorClass }) => (
  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold ${colorClass}`}>
    <Icon className="w-4 h-4 shrink-0" />
    <span className="text-xs text-current opacity-70">{label}</span>
    <span>{value}</span>
  </div>
);

const MonthGroup = ({ monthKey, entries, locale, defaultOpen }) => {
  const [open, setOpen] = useState(defaultOpen);
  const ptCount = entries.filter((e) => !!e.pt_name).length;
  const freeCount = entries.length - ptCount;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-3 py-2 px-1 mb-2 group"
      >
        <div className="flex-1 flex items-center gap-3">
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300 capitalize">
            {formatMonthHeading(monthKey, locale)}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
            {entries.length} lần vào
            {ptCount > 0 && ` · ${ptCount} buổi có PT`}
            {freeCount > 0 && ` · ${freeCount} tự tập`}
          </span>
        </div>
        <div className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {open && (
        <div className="space-y-2">
          {entries.map((checkIn) => {
            const { weekday, date, time } = formatDateTime(checkIn.member_confirmed_at || checkIn.session_time, locale);
            const isPT = !!checkIn.pt_name;

            return (
              <div
                key={checkIn.session_id}
                className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
              >
                {/* Left: Date block */}
                <div className="shrink-0 w-14 text-center">
                  <p className="text-xs text-gray-400 dark:text-gray-500">{weekday}</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-white leading-tight">
                    {date.split('/')[0]}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {date.split('/').slice(1).join('/')}
                  </p>
                </div>

                {/* Divider */}
                <div className="w-px h-10 bg-gray-200 dark:bg-gray-700 shrink-0" />

                {/* Middle: Session info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {isPT ? (
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-700 dark:text-purple-300">
                        <User className="w-3.5 h-3.5" />
                        Buổi tập có PT
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400">
                        <Dumbbell className="w-3.5 h-3.5" />
                        Tự tập
                      </span>
                    )}
                    {isPT && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        · {checkIn.pt_name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {checkIn.facility_name || 'Phòng tập Gym'}
                    </span>
                  </div>
                </div>

                {/* Right: Time */}
                <div className="shrink-0 text-right">
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg">
                    <Clock className="w-3.5 h-3.5" />
                    {time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ─── Main component ─── */
const CheckInHistoryTimeline = ({ checkInHistories, locale }) => {
  const { monthGroups, totalSessions, ptSessions, lastDate } = useMemo(() => {
    const grouped = {};
    let lastD = null;
    let ptCount = 0;

    checkInHistories.forEach((checkIn) => {
      const isoStr = (checkIn.member_confirmed_at || checkIn.session_time || '').toString();
      if (!isoStr) return;
      const mk = getMonthKey(isoStr);
      if (!grouped[mk]) grouped[mk] = [];
      grouped[mk].push(checkIn);
      if (!lastD || isoStr > lastD) lastD = isoStr;
      if (checkIn.pt_name) ptCount++;
    });

    const monthGroups = Object.keys(grouped)
      .sort()
      .reverse()
      .map((mk) => ({ monthKey: mk, entries: grouped[mk] }));

    return {
      monthGroups,
      totalSessions: checkInHistories.length,
      ptSessions: ptCount,
      lastDate: lastD,
    };
  }, [checkInHistories]);

  /* Empty state */
  if (totalSessions === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 text-3xl">
          🏃‍♂️
        </div>
        <p className="text-gray-700 dark:text-gray-300 font-semibold">Chưa có lịch sử ra vào</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
          Mỗi lần bạn check-in vào phòng tập sẽ được ghi lại tại đây.
        </p>
      </div>
    );
  }

  const lastDateDisplay = lastDate
    ? new Date(lastDate).toLocaleDateString(locale, { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })
    : '—';

  return (
    <div className="flex flex-col h-full">
      {/* Stats */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-sm font-bold text-gray-800 dark:text-white mb-3">Tổng quan ra vào</h2>
        <div className="flex flex-wrap gap-2">
          <StatsBadge
            icon={Dumbbell}
            label="Tổng lần vào"
            value={totalSessions}
            colorClass="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
          />
          <StatsBadge
            icon={User}
            label="Buổi có PT"
            value={ptSessions}
            colorClass="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
          />
          <StatsBadge
            icon={Calendar}
            label="Lần vào gần nhất"
            value={lastDateDisplay}
            colorClass="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
        {monthGroups.map(({ monthKey, entries }, idx) => (
          <MonthGroup
            key={monthKey}
            monthKey={monthKey}
            entries={entries}
            locale={locale}
            defaultOpen={idx === 0}
          />
        ))}
      </div>
    </div>
  );
};

export default CheckInHistoryTimeline;
