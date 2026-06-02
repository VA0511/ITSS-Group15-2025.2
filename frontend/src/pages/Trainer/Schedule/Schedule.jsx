import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { X, Phone, Mail, User, Clock, Target, BookOpen, Zap, MapPin, Calendar, Package, Loader2, Inbox } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useMyBookings } from '@/hooks/queries/useTraining';
import { useUpdateBooking } from '@/hooks/mutations/useTrainingMutations';
import { useMembers, useMemberDetails } from '@/hooks/queries/useMembers';

const DAY_KEYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const TrainerSchedule = () => {
  const { t, i18n } = useTranslation('trainer');
  const locale = i18n.language === 'ja' ? 'ja-JP' : i18n.language === 'en' ? 'en-US' : 'vi-VN';
  const todayKey = format(new Date(), 'yyyy-MM-dd');

  const [activeTab, setActiveTab] = useState('mySchedule');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const { data: bookingsRaw } = useMyBookings();
  const bookings = Array.isArray(bookingsRaw) ? bookingsRaw : [];
  const { data: membersResponse } = useMembers(1, 100);
  const members = membersResponse?.data || (Array.isArray(membersResponse) ? membersResponse : []);
  const { mutate: updateBooking } = useUpdateBooking();
  const { data: selectedMemberDetail, isLoading: loadingMember } = useMemberDetails(selectedRequest?.memberId);

  const myScheduleData = useMemo(() => {
    const map = {};
    bookings
      .filter((b) => b.status === 'Accepted')
      .forEach((b) => {
        const dk = b.requested_start.slice(0, 10);
        const member = members.find((m) => m.id === b.member_id);
        const memberName = member?.full_name || member?.name || t('students.member_fallback', { id: b.member_id });
        if (!map[dk]) map[dk] = [];
        map[dk].push({
          bookingId: b.id,
          startTime: b.requested_start.slice(11, 16),
          endTime: b.requested_end.slice(11, 16),
          memberName,
          note: b.training_plan_note || '',
          status: 'Accepted',
        });
      });
    return map;
  }, [bookings, members]);

  const memberRequestsData = useMemo(() => {
    const map = {};
    bookings
      .filter((b) => b.status === 'Pending' || b.status === 'Rejected')
      .forEach((b) => {
        const dk = b.requested_start.slice(0, 10);
        const member = members.find((m) => m.id === b.member_id);
        const memberName = member?.full_name || member?.name || t('students.member_fallback', { id: b.member_id });
        if (!map[dk]) map[dk] = [];
        map[dk].push({
          bookingId: b.id,
          memberId: b.member_id,
          ptId: b.pt_id,
          requestedStart: b.requested_start,
          requestedEnd: b.requested_end,
          startTime: b.requested_start.slice(11, 16),
          endTime: b.requested_end.slice(11, 16),
          memberName,
          memberPhone: member?.phone || '',
          note: b.training_plan_note || '',
          intensity: b.intensity || '',
          roadmapGoal: b.roadmap_goal || '',
          freeSchedule: b.member_free_schedule || '',
          status: b.status,
        });
      });
    return map;
  }, [bookings, members]);

  const handleUpdateStatus = (item, newStatus, rejectionReason = '') => {
    updateBooking({
      id: item.bookingId,
      data: {
        member_id: item.memberId,
        pt_id: item.ptId,
        requested_start: item.requestedStart,
        requested_end: item.requestedEnd,
        training_plan_note: item.note,
        intensity: item.intensity,
        roadmap_goal: item.roadmapGoal,
        member_free_schedule: item.freeSchedule,
        status: newStatus,
        rejection_reason: rejectionReason,
      },
    });
  };

  const handleConfirmReject = () => {
    handleUpdateStatus(rejectTarget, 'Rejected', rejectReason);
    setRejectTarget(null);
    setRejectReason('');
    setSelectedRequest(null);
  };

  const dateKey = (y, m, d) =>
    `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const buildCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const first = new Date(year, month, 1).getDay();
    const offset = first === 0 ? 6 : first - 1;
    const dim = new Date(year, month + 1, 0).getDate();
    const prev = new Date(year, month, 0).getDate();
    const days = [];
    for (let i = offset - 1; i >= 0; i--) days.push({ day: prev - i, isCurrentMonth: false });
    for (let d = 1; d <= dim; d++) days.push({ day: d, isCurrentMonth: true });
    const tot = offset + dim;
    const rem = tot % 7 === 0 ? 0 : 7 - (tot % 7);
    for (let i = 1; i <= rem; i++) days.push({ day: i, isCurrentMonth: false });
    return days;
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  const calendarDays = buildCalendar();

  const selectDay = (day) => setSelectedDate(dateKey(year, month, day));
  const previousMonth = () => setCurrentDate(new Date(year, month - 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1));

  const currentData = activeTab === 'mySchedule' ? myScheduleData : memberRequestsData;
  const selectedItems = selectedDate ? (currentData[selectedDate] || []) : [];
  const selectedDateObject = selectedDate ? new Date(`${selectedDate}T00:00:00`) : null;

  const getCalendarDotClass = (dk) => {
    if (activeTab === 'mySchedule') {
      return myScheduleData[dk]?.length > 0 ? 'bg-green-500' : null;
    }
    const reqs = memberRequestsData[dk] || [];
    if (reqs.some((r) => r.status === 'Pending')) return 'bg-yellow-400';
    if (reqs.some((r) => r.status === 'Accepted')) return 'bg-green-500';
    if (reqs.some((r) => r.status === 'Rejected')) return 'bg-red-400';
    return null;
  };

  const getStatusBadgeClass = (status) => {
    if (status === 'Accepted') return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300';
    if (status === 'Pending') return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300';
    if (status === 'Rejected') return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300';
    return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
  };

  const getAccentColor = (status) => {
    if (status === 'Accepted') return '#16A34A';
    if (status === 'Pending') return '#EAB308';
    if (status === 'Rejected') return '#EF4444';
    return '#9CA3AF';
  };

  return (
    <>
    <div className="flex-1 p-4 lg:p-6 w-full overflow-hidden flex flex-col">
      <div
        className="flex-1 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden flex flex-col lg:flex-row min-h-0"
        style={{ minHeight: '560px' }}
      >
        {/* Left panel: Calendar + Tabs */}
        <div className="lg:w-[45%] shrink-0 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-800 flex flex-col">
          <div className="p-5 flex-1 flex flex-col overflow-hidden">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-3 shrink-0">
              <button
                onClick={previousMonth}
                className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 text-lg font-bold"
              >‹</button>
              <div className="text-sm font-bold text-gray-800 dark:text-white capitalize">{monthName}</div>
              <button
                onClick={nextMonth}
                className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 text-lg font-bold"
              >›</button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1 shrink-0">
              {DAY_KEYS.map((key) => (
                <div key={key} className="text-xs font-bold text-gray-400 dark:text-gray-500 text-center py-1">
                  {t(`availability.days.${key}`)}
                </div>
              ))}
            </div>

            {/* Calendar cells — fill remaining height */}
            <div
              className="flex-1 grid grid-cols-7 gap-0.5"
              style={{ gridTemplateRows: `repeat(${calendarDays.length / 7}, 1fr)` }}
            >
              {calendarDays.map((dayObj, idx) => {
                const key = dayObj.isCurrentMonth ? dateKey(year, month, dayObj.day) : null;
                const dotClass = key ? getCalendarDotClass(key) : null;
                const isSelected = selectedDate === key;
                return (
                  <div
                    key={idx}
                    onClick={() => dayObj.isCurrentMonth && selectDay(dayObj.day)}
                    className={`flex flex-col items-center justify-center rounded text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold'
                        : dayObj.isCurrentMonth
                          ? 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                          : 'text-gray-300 dark:text-gray-600'
                    }`}
                  >
                    <span className="text-sm font-semibold leading-none">{dayObj.day}</span>
                    {dotClass && (
                      <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${dotClass} ${isSelected ? 'opacity-70' : ''}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-100 dark:border-gray-800 p-3 flex gap-2 shrink-0">
            {[['mySchedule', t('schedule.tab_my_schedule')], ['memberRequests', t('schedule.tab_requests')]].map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-2 py-2 rounded-lg font-semibold text-xs transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Right panel: Content */}
        <div className="flex-1 overflow-y-auto p-5 lg:p-6">
          {!selectedDate ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-3xl">📅</div>
              <div className="text-sm font-medium text-gray-400 dark:text-gray-500">{t('schedule.select_day_hint')}</div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-base font-bold text-gray-800 dark:text-white">
                    {selectedDateObject
                      ? selectedDateObject.toLocaleDateString(locale, { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
                      : ''}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {activeTab === 'memberRequests' ? t('schedule.booking_requests_label') : t('schedule.my_teaching_label')}
                  </div>
                </div>
                {selectedItems.length > 0 && (
                  <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {activeTab === 'memberRequests'
                      ? t('schedule.request_count', { count: selectedItems.length })
                      : t('schedule.session_count', { count: selectedItems.length })}
                  </div>
                )}
              </div>

              {selectedItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
                    {activeTab === 'memberRequests'
                      ? <Inbox className="h-7 w-7 text-gray-400 dark:text-gray-500" />
                      : <Calendar className="h-7 w-7 text-gray-400 dark:text-gray-500" />
                    }
                  </div>
                  <div className="text-sm text-gray-400 dark:text-gray-500 italic">
                    {activeTab === 'memberRequests' ? t('schedule.no_requests') : t('schedule.no_sessions')}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedItems.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => activeTab === 'memberRequests' ? setSelectedRequest(item) : undefined}
                      className={`bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex gap-3.5 relative overflow-hidden ${
                        activeTab === 'memberRequests' ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900/60 transition-colors' : ''
                      }`}
                    >
                      <div
                        className="absolute left-0 top-0 bottom-0 w-1"
                        style={{ backgroundColor: getAccentColor(item.status) }}
                      />
                      <div className="flex flex-col items-center min-w-12">
                        <div className="text-xs font-bold text-gray-700 dark:text-gray-300">{item.startTime}</div>
                        <div className="w-px h-2 bg-gray-300 dark:bg-gray-600 my-1" />
                        <div className="text-xs text-gray-400 dark:text-gray-500">{item.endTime}</div>
                      </div>
                      <div className="flex-1 ml-2">
                        <div className="text-sm font-bold text-gray-800 dark:text-white mb-1">{item.memberName}</div>
                        {item.note && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 italic">{t('schedule.note_prefix')}{item.note}</div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <div className={`text-xs font-bold px-2.5 py-1 rounded whitespace-nowrap ${getStatusBadgeClass(item.status)}`}>
                          {t(`schedule.status.${item.status}`, { defaultValue: item.status })}
                        </div>
                        {activeTab === 'memberRequests' && item.status === 'Pending' && (
                          <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleUpdateStatus(item, 'Accepted')}
                              className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors font-semibold"
                            >
                              {t('schedule.accept_btn')}
                            </button>
                            <button
                              onClick={() => setRejectTarget(item)}
                              className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors font-semibold"
                            >
                              {t('schedule.reject_btn')}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>

    {selectedRequest && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={() => setSelectedRequest(null)}>
        <div className="bg-white dark:bg-gray-950 rounded-2xl max-w-lg w-full my-auto border border-gray-200 dark:border-gray-800 shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('schedule.request_detail.title')}</h2>
            <button onClick={() => setSelectedRequest(null)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">{t('schedule.request_detail.member_section')}</p>
              {loadingMember ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                      <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedMemberDetail?.full_name || selectedRequest.memberName}</p>
                      <p className="text-xs text-gray-400">{t('schedule.request_detail.member_id_prefix')}{selectedRequest.memberId}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {(selectedMemberDetail?.phone || selectedRequest.memberPhone) && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">{selectedMemberDetail?.phone || selectedRequest.memberPhone}</span>
                      </div>
                    )}
                    {selectedMemberDetail?.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">{selectedMemberDetail.email}</span>
                      </div>
                    )}
                    {selectedMemberDetail?.gender && (
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">{selectedMemberDetail.gender}</span>
                      </div>
                    )}
                    {selectedMemberDetail?.dob && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">{new Date(selectedMemberDetail.dob).toLocaleDateString('vi-VN')}</span>
                      </div>
                    )}
                  </div>
                  {selectedMemberDetail?.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">{selectedMemberDetail.address}</span>
                    </div>
                  )}
                  {selectedMemberDetail?.package && (
                    <div className="flex items-center gap-2 pt-1 border-t border-gray-100 dark:border-gray-800">
                      <Package className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">{selectedMemberDetail.package}</span>
                      {selectedMemberDetail?.expiryDate && (
                        <span className="text-xs text-gray-400 dark:text-gray-500">{t('schedule.request_detail.package_expiry_prefix')}{selectedMemberDetail.expiryDate}</span>
                      )}
                    </div>
                  )}
                  {selectedRequest.roadmapGoal && (
                    <div className="flex items-start gap-2 pt-1 border-t border-gray-100 dark:border-gray-800">
                      <Target className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{t('schedule.request_detail.roadmap_goal_label')}</p>
                        <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5">{selectedRequest.roadmapGoal}</p>
                      </div>
                    </div>
                  )}
                  {selectedRequest.freeSchedule && (
                    <div className="flex items-start gap-2">
                      <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{t('schedule.request_detail.free_schedule_label')}</p>
                        <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5">{selectedRequest.freeSchedule}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">{t('schedule.request_detail.session_section')}</p>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500 shrink-0" />
                    <span className="text-sm font-semibold text-gray-800 dark:text-white">
                      {new Date(`${selectedRequest.requestedStart.slice(0,10)}T00:00:00`).toLocaleDateString(locale, { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </span>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded ${getStatusBadgeClass(selectedRequest.status)}`}>
                    {t(`schedule.status.${selectedRequest.status}`, { defaultValue: selectedRequest.status })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500 shrink-0" />
                  <span className="text-sm font-semibold text-gray-800 dark:text-white">{selectedRequest.startTime} – {selectedRequest.endTime}</span>
                </div>
                {selectedRequest.intensity && (
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-500 shrink-0" />
                    <div>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{t('schedule.request_detail.intensity_label')}</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{selectedRequest.intensity}</span>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-2 pt-1 border-t border-blue-100 dark:border-blue-900/50">
                  <BookOpen className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{t('schedule.request_detail.curriculum_label')}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{selectedRequest.note || <span className="italic text-gray-400 dark:text-gray-600">{t('schedule.request_detail.curriculum_empty')}</span>}</p>
                  </div>
                </div>
              </div>
            </div>

            {selectedRequest.status === 'Pending' && (
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setRejectTarget(selectedRequest)}
                  className="flex-1 py-2.5 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 font-semibold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm"
                >
                  {t('schedule.request_detail.reject_btn')}
                </button>
                <button
                  onClick={() => { handleUpdateStatus(selectedRequest, 'Accepted'); setSelectedRequest(null); }}
                  className="flex-1 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors text-sm shadow-lg shadow-green-500/20"
                >
                  {t('schedule.request_detail.accept_btn')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )}

    {rejectTarget && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4" onClick={() => { setRejectTarget(null); setRejectReason(''); }}>
        <div className="bg-white dark:bg-gray-950 rounded-xl max-w-sm w-full border border-gray-200 dark:border-gray-800 shadow-2xl p-5 space-y-4" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">{t('schedule.reject_modal.title')}</h3>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder={t('schedule.reject_modal.placeholder')}
            rows={3}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
          />
          <div className="flex gap-3">
            <button
              onClick={() => { setRejectTarget(null); setRejectReason(''); }}
              className="flex-1 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              {t('schedule.reject_modal.cancel')}
            </button>
            <button
              onClick={handleConfirmReject}
              className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
            >
              {t('schedule.reject_modal.confirm')}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default TrainerSchedule;
