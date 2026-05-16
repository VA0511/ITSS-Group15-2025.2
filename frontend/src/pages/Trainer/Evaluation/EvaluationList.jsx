import React, { useState, useRef, useEffect } from 'react';
import { ClipboardList, CheckCircle2, Clock, ChevronDown, ChevronUp, Save, User, Building2, X } from 'lucide-react';
import { useTrainingSessions, useTrainingBookings } from '@/hooks/queries/useTraining';
import { useAllMembers } from '@/hooks/queries/useMembers';
import { useUpdateTrainingSession } from '@/hooks/mutations/useTrainingMutations';
import { useFacilities } from '@/hooks/queries/useFacilities';
import { cn } from '@/lib/utils';

const FIELDS = [
  { key: 'pt_feedback', label: 'Nhận xét buổi tập', placeholder: 'Buổi tập diễn ra như thế nào...' },
  { key: 'physical_condition', label: 'Tình trạng thể chất', placeholder: 'Đánh giá thể trạng học viên...' },
  { key: 'session_result', label: 'Kết quả buổi tập', placeholder: 'Những gì học viên đạt được...' },
  { key: 'nutrition_advice', label: 'Tư vấn dinh dưỡng', placeholder: 'Gợi ý chế độ ăn uống...' },
];

const defaultForm = (session) => ({
  attendance_status: session.attendance_status || 'Present',
  pt_feedback: session.pt_feedback || '',
  physical_condition: session.physical_condition || '',
  session_result: session.session_result || '',
  nutrition_advice: session.nutrition_advice || '',
  facility_ids: session.facility_id ? [session.facility_id] : [],
});

const EvaluationList = () => {
  const { data: sessions = [], isLoading } = useTrainingSessions();
  const { data: bookings = [] } = useTrainingBookings();
  const { data: members = [] } = useAllMembers();
  const { mutate: updateSession, isPending } = useUpdateTrainingSession();
  const { data: facilitiesRaw } = useFacilities(1, 100);
  const allFacilities = facilitiesRaw?.data ?? [];

  const [expandedId, setExpandedId] = useState(null);
  const [forms, setForms] = useState({});
  const [facilityDropdownOpen, setFacilityDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setFacilityDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);


  const bookingMap = Object.fromEntries(bookings.map((b) => [b.id, b]));
  const memberMap = Object.fromEntries(members.map((m) => [m.id, m]));

  const pastSessions = sessions
    .filter((s) => new Date(s.session_time) < new Date())
    .sort((a, b) => new Date(b.session_time) - new Date(a.session_time))
    .map((s) => {
      const booking = bookingMap[s.booking_id];
      const member = booking ? memberMap[booking.member_id] : null;
      return { ...s, memberName: member?.full_name || 'Không rõ' };
    });

  const getForm = (session) => forms[session.id] ?? defaultForm(session);

  const setField = (sessionId, field, value) => {
    setForms((prev) => {
      const session = sessions.find((s) => s.id === sessionId);
      const current = prev[sessionId] ?? defaultForm(session || {});
      return { ...prev, [sessionId]: { ...current, [field]: value } };
    });
  };

  const toggleFacility = (sessionId, facilityId, currentIds) => {
    const newIds = currentIds.includes(facilityId)
      ? currentIds.filter((id) => id !== facilityId)
      : [...currentIds, facilityId];
    setField(sessionId, 'facility_ids', newIds);
  };

  const handleSave = (session) => {
    const form = getForm(session);
    updateSession({
      id: session.id,
      data: {
        booking_id: session.booking_id,
        facility_id: form.facility_ids.length > 0 ? form.facility_ids[0] : null,
        session_time: session.session_time,
        member_confirmed_at: session.member_confirmed_at,
        attendance_status: form.attendance_status,
        pt_feedback: form.pt_feedback,
        physical_condition: form.physical_condition,
        session_result: form.session_result,
        nutrition_advice: form.nutrition_advice,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-64">
        <div className="text-gray-500 dark:text-gray-400 text-sm">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto w-full pb-20 no-scrollbar">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-blue-600" />
          Đánh giá buổi tập
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Điền nhận xét và kết quả cho các buổi tập đã hoàn thành
        </p>
      </div>

      {pastSessions.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500 text-sm">
          Chưa có buổi tập nào đã qua.
        </div>
      ) : (
        <div className="space-y-3">
          {pastSessions.map((session) => {
            const isOpen = expandedId === session.id;
            const evaluated = !!session.pt_feedback;
            const form = getForm(session);
            const sessionDate = new Date(session.session_time);

            return (
              <div
                key={session.id}
                className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors"
                  onClick={() => { setExpandedId(isOpen ? null : session.id); setFacilityDropdownOpen(false); }}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                      {session.memberName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {sessionDate.toLocaleDateString('vi-VN', {
                        weekday: 'short',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                      {' · '}
                      {sessionDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {evaluated ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Đã đánh giá
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2.5 py-1 rounded-full">
                        <Clock className="h-3.5 w-3.5" />
                        Chưa đánh giá
                      </span>
                    )}
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-gray-100 dark:border-gray-800 p-4 space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-2">
                        Trạng thái điểm danh
                      </label>
                      <div className="flex gap-2">
                        {[
                          { value: 'Present', label: 'Có mặt' },
                          { value: 'Absent', label: 'Vắng mặt' },
                        ].map(({ value, label }) => (
                          <button
                            key={value}
                            onClick={() => setField(session.id, 'attendance_status', value)}
                            className={cn(
                              'flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all',
                              form.attendance_status === value
                                ? value === 'Present'
                                  ? 'bg-green-600 border-green-600 text-white'
                                  : 'bg-red-500 border-red-500 text-white'
                                : 'bg-transparent border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
                            )}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1.5">
                        Cơ sở tập luyện
                      </label>
                      <div className="relative" ref={dropdownRef}>
                        <div
                          className="min-h-10 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-xl px-3 py-2 flex flex-wrap items-center gap-1.5 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                          onClick={() => setFacilityDropdownOpen((p) => !p)}
                        >
                          {form.facility_ids.map((fid) => {
                            const facility = allFacilities.find((f) => f.id === fid);
                            return (
                              <span
                                key={fid}
                                className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded-lg"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {facility?.facility_name ?? `Cơ sở #${fid}`}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setField(
                                      session.id,
                                      'facility_ids',
                                      form.facility_ids.filter((id) => id !== fid),
                                    )
                                  }
                                  className="hover:text-red-500 transition-colors ml-0.5"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            );
                          })}
                          <span className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 flex-1 min-w-0">
                            {form.facility_ids.length === 0 && (
                              <span className="truncate">Chọn cơ sở tập luyện...</span>
                            )}
                            <Building2 className="h-4 w-4 ml-auto flex-shrink-0" />
                          </span>
                        </div>

                        {facilityDropdownOpen && (
                          <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-52 overflow-y-auto">
                            {allFacilities.length === 0 ? (
                              <div className="p-3 text-sm text-gray-400 dark:text-gray-500 text-center">
                                Không có cơ sở nào
                              </div>
                            ) : (
                              allFacilities.map((facility) => {
                                const selected = form.facility_ids.includes(facility.id);
                                return (
                                  <button
                                    key={facility.id}
                                    type="button"
                                    onClick={() =>
                                      toggleFacility(session.id, facility.id, form.facility_ids)
                                    }
                                    className={cn(
                                      'w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left transition-colors',
                                      selected
                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                                    )}
                                  >
                                    <div
                                      className={cn(
                                        'w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                                        selected
                                          ? 'bg-blue-600 border-blue-600'
                                          : 'border-gray-300 dark:border-gray-600',
                                      )}
                                    >
                                      {selected && (
                                        <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 text-white" fill="none">
                                          <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                      )}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="font-medium truncate">{facility.facility_name}</div>
                                      {facility.facility_type && (
                                        <div className="text-xs text-gray-400 dark:text-gray-500 truncate">
                                          {facility.facility_type}
                                        </div>
                                      )}
                                    </div>
                                  </button>
                                );
                              })
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {FIELDS.map(({ key, label, placeholder }) => (
                      <div key={key}>
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1.5">
                          {label}
                        </label>
                        <textarea
                          value={form[key]}
                          onChange={(e) => setField(session.id, key, e.target.value)}
                          placeholder={placeholder}
                          rows={3}
                          className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-xl p-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 resize-none transition-colors"
                        />
                      </div>
                    ))}

                    <button
                      onClick={() => handleSave(session)}
                      disabled={isPending}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all disabled:opacity-50"
                    >
                      {isPending ? (
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Lưu đánh giá
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EvaluationList;
