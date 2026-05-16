import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { X, Phone, Mail, User, Clock, Target, BookOpen, Zap, MapPin, Calendar, Package, Loader2 } from 'lucide-react';

import { useMyBookings } from '@/hooks/queries/useTraining';
import { useUpdateBooking } from '@/hooks/mutations/useTrainingMutations';
import { useMembers, useMemberDetails } from '@/hooks/queries/useMembers';

const DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const STATUS_VI = { Accepted: 'Đã xác nhận', Pending: 'Chờ xác nhận', Rejected: 'Từ chối' };

const TrainerSchedule = () => {
  const todayKey = format(new Date(), 'yyyy-MM-dd');
  const dayNames = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

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
        const memberName = member?.full_name || member?.name || `Hội viên #${b.member_id}`;
        if (!map[dk]) map[dk] = [];
        map[dk].push({
          bookingId: b.id,
          startTime: b.requested_start.slice(11, 16),
          endTime: b.requested_end.slice(11, 16),
          memberName,
          note: b.training_plan_note || '',
          status: 'Đã xác nhận',
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
        const memberName = member?.full_name || member?.name || `Hội viên #${b.member_id}`;
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
          status: STATUS_VI[b.status] || b.status,
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
  const monthName = currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
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
    if (reqs.some((r) => r.status === 'Chờ xác nhận')) return 'bg-yellow-400';
    if (reqs.some((r) => r.status === 'Đã xác nhận')) return 'bg-green-500';
    if (reqs.some((r) => r.status === 'Từ chối')) return 'bg-red-400';
    return null;
  };

  const getStatusBadgeClass = (status) => {
    if (status === 'Đã xác nhận') return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300';
    if (status === 'Chờ xác nhận') return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300';
    if (status === 'Từ chối') return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300';
    return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
  };

  const getAccentColor = (status) => {
    if (status === 'Đã xác nhận') return '#16A34A';
    if (status === 'Chờ xác nhận') return '#EAB308';
    if (status === 'Từ chối') return '#EF4444';
    return '#9CA3AF';
  };

  return (
    <>
    <div className="flex-1 overflow-y-auto p-6 max-w-6xl mx-auto w-full pb-20">
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={previousMonth}
              className="w-7 h-7 rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              ‹
            </button>
            <div className="text-sm font-bold text-gray-800 dark:text-white capitalize">{monthName}</div>
            <button
              onClick={nextMonth}
              className="w-7 h-7 rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-0 mb-2">
            {DAYS.map((day) => (
              <div key={day} className="text-xs font-bold text-gray-400 dark:text-gray-500 text-center py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((dayObj, idx) => {
              const key = dayObj.isCurrentMonth ? dateKey(year, month, dayObj.day) : null;
              const dotClass = key ? getCalendarDotClass(key) : null;
              const isSelected = selectedDate === key;
              return (
                <div
                  key={idx}
                  onClick={() => dayObj.isCurrentMonth && selectDay(dayObj.day)}
                  className={`h-14 flex flex-col items-center justify-center rounded text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold'
                      : dayObj.isCurrentMonth
                        ? 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                        : 'text-gray-300 dark:text-gray-600'
                  }`}
                >
                  <span className="text-sm font-semibold">{dayObj.day}</span>
                  {dotClass && <div className={`w-1.5 h-1.5 rounded-full mt-1 ${dotClass}`} />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 p-4 flex gap-2">
          <button
            onClick={() => setActiveTab('mySchedule')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              activeTab === 'mySchedule'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Lịch của tôi
          </button>
          <button
            onClick={() => setActiveTab('memberRequests')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              activeTab === 'memberRequests'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Yêu cầu hội viên
          </button>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 p-6">
          {!selectedDate ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-3xl">
                📅
              </div>
              <div className="text-sm text-gray-400 dark:text-gray-500">Chọn một ngày để xem lịch</div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  {selectedDateObject
                    ? `${dayNames[selectedDateObject.getDay()]}, ${selectedDateObject.getDate()}/${String(selectedDateObject.getMonth() + 1).padStart(2, '0')}/${selectedDateObject.getFullYear()}`
                    : ''}
                </div>
                {selectedItems.length > 0 && (
                  <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {selectedItems.length} {activeTab === 'memberRequests' ? 'yêu cầu' : 'buổi'}
                  </div>
                )}
              </div>

              {selectedItems.length === 0 ? (
                <div className="text-sm text-gray-400 dark:text-gray-500 italic">
                  {activeTab === 'memberRequests' ? 'Chưa có yêu cầu nào' : 'Không có lịch dạy nào'}
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedItems.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => activeTab === 'memberRequests' ? setSelectedRequest(item) : undefined}
                      className={`bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex gap-3.5 relative overflow-hidden ${activeTab === 'memberRequests' ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900/60 transition-colors' : ''}`}
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
                          <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                            Ghi chú: {item.note}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 items-end">
                        <div className={`text-xs font-bold px-2.5 py-1 rounded whitespace-nowrap ${getStatusBadgeClass(item.status)}`}>
                          {item.status}
                        </div>
                        {activeTab === 'memberRequests' && item.status === 'Chờ xác nhận' && (
                          <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleUpdateStatus(item, 'Accepted')}
                              className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors font-semibold"
                            >
                              Chấp nhận
                            </button>
                            <button
                              onClick={() => setRejectTarget(item)}
                              className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors font-semibold"
                            >
                              Từ chối
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
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Chi tiết yêu cầu đặt lịch</h2>
            <button onClick={() => setSelectedRequest(null)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Member info */}
            <div className="space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">Thông tin hội viên</p>
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
                      <p className="text-xs text-gray-400">ID: MEM-{selectedRequest.memberId}</p>
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
                        <span className="text-xs text-gray-400 dark:text-gray-500">· HSD: {selectedMemberDetail.expiryDate}</span>
                      )}
                    </div>
                  )}
                  {selectedRequest.roadmapGoal && (
                    <div className="flex items-start gap-2 pt-1 border-t border-gray-100 dark:border-gray-800">
                      <Target className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-400 dark:text-gray-500">Mục tiêu lộ trình</p>
                        <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5">{selectedRequest.roadmapGoal}</p>
                      </div>
                    </div>
                  )}
                  {selectedRequest.freeSchedule && (
                    <div className="flex items-start gap-2">
                      <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-400 dark:text-gray-500">Lịch rảnh</p>
                        <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5">{selectedRequest.freeSchedule}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Booking request info */}
            <div className="space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">Yêu cầu buổi tập</p>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500 shrink-0" />
                    <span className="text-sm font-semibold text-gray-800 dark:text-white">
                      {new Date(`${selectedRequest.requestedStart.slice(0,10)}T00:00:00`).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </span>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded ${getStatusBadgeClass(selectedRequest.status)}`}>
                    {selectedRequest.status}
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
                      <span className="text-xs text-gray-400 dark:text-gray-500">Cường độ: </span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{selectedRequest.intensity}</span>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-2 pt-1 border-t border-blue-100 dark:border-blue-900/50">
                  <BookOpen className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Giáo trình mong muốn</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{selectedRequest.note || <span className="italic text-gray-400 dark:text-gray-600">Chưa điền</span>}</p>
                  </div>
                </div>
              </div>
            </div>

            {selectedRequest.status === 'Chờ xác nhận' && (
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setRejectTarget(selectedRequest)}
                  className="flex-1 py-2.5 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 font-semibold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm"
                >
                  Từ chối
                </button>
                <button
                  onClick={() => { handleUpdateStatus(selectedRequest, 'Accepted'); setSelectedRequest(null); }}
                  className="flex-1 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors text-sm shadow-lg shadow-green-500/20"
                >
                  Chấp nhận
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
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Lý do từ chối</h3>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Nhập lý do từ chối (tùy chọn)..."
            rows={3}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
          />
          <div className="flex gap-3">
            <button
              onClick={() => { setRejectTarget(null); setRejectReason(''); }}
              className="flex-1 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirmReject}
              className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
            >
              Xác nhận từ chối
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default TrainerSchedule;
