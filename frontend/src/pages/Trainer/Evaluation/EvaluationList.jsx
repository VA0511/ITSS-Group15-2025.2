import React, { useState, useRef, useEffect } from 'react';
import { ClipboardList, CheckCircle2, Clock, Save, User, Building2, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTrainingSessions, useTrainingBookings } from '@/hooks/queries/useTraining';
import { useAllMembers } from '@/hooks/queries/useMembers';
import { useUpdateTrainingSession } from '@/hooks/mutations/useTrainingMutations';
import { useFacilities } from '@/hooks/queries/useFacilities';
import { cn } from '@/lib/utils';
import { slideUpVariants } from '@/lib/animations';

const FIELD_KEYS = ['pt_feedback', 'physical_condition', 'session_result', 'nutrition_advice'];

const defaultForm = (session) => ({
  attendance_status: session.attendance_status || 'Present',
  pt_feedback: session.pt_feedback || '',
  physical_condition: session.physical_condition || '',
  session_result: session.session_result || '',
  nutrition_advice: session.nutrition_advice || '',
  facility_ids: session.facility_id ? [session.facility_id] : [],
});

const EvaluationList = () => {
  const { t, i18n } = useTranslation('trainer');
  const locale = i18n.language === 'ja' ? 'ja-JP' : i18n.language === 'en' ? 'en-US' : 'vi-VN';
  const { data: sessions = [], isLoading } = useTrainingSessions();
  const { data: bookings = [] } = useTrainingBookings();
  const { data: members = [] } = useAllMembers();
  const { mutate: updateSession, isPending } = useUpdateTrainingSession();
  const { data: facilitiesRaw } = useFacilities(1, 100);
  const allFacilities = facilitiesRaw?.data ?? [];

  const [selectedId, setSelectedId] = useState(null);
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
    .filter((s) => new Date(s.session_time) < new Date() && bookingMap[s.booking_id] !== undefined)
    .sort((a, b) => new Date(b.session_time) - new Date(a.session_time))
    .map((s) => {
      const booking = bookingMap[s.booking_id];
      const member = booking ? memberMap[booking.member_id] : null;
      return { ...s, memberName: member?.full_name || member?.name || t('evaluation.member_unknown') };
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

  const selectedSession = pastSessions.find((s) => s.id === selectedId) || null;
  const selectedForm = selectedSession ? getForm(selectedSession) : null;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-64">
        <div className="text-gray-500 dark:text-gray-400 text-sm">{t('evaluation.loading')}</div>
      </div>
    );
  }

  return (
    <motion.div
      className="flex-1 p-4 lg:p-6 w-full overflow-hidden flex flex-col"
      variants={slideUpVariants}
      initial="hidden"
      animate="visible"
    >
      <div
        className="flex-1 flex flex-col lg:flex-row bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm min-h-0"
        style={{ minHeight: '520px' }}
      >
        {/* Left panel: session list */}
        <div className="lg:w-72 xl:w-80 shrink-0 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
            <h1 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-blue-600" />
              {t('evaluation.title')}
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {t('evaluation.past_sessions_count', { count: pastSessions.length })}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            {pastSessions.length === 0 ? (
              <div className="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">
                {t('evaluation.no_sessions')}
              </div>
            ) : (
              pastSessions.map((session) => {
                const evaluated = !!session.pt_feedback;
                const isSelected = selectedId === session.id;
                const sessionDate = new Date(session.session_time);
                return (
                  <button
                    key={session.id}
                    onClick={() => { setSelectedId(session.id); setFacilityDropdownOpen(false); }}
                    className={cn(
                      'w-full flex items-center gap-3 p-3.5 border-b border-gray-50 dark:border-gray-800/50 text-left transition-colors',
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-l-[3px] border-l-blue-500'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-900/30 border-l-[3px] border-l-transparent',
                    )}
                  >
                    <div className={cn(
                      'w-9 h-9 rounded-full flex items-center justify-center shrink-0',
                      isSelected ? 'bg-blue-600' : 'bg-blue-100 dark:bg-blue-900/40',
                    )}>
                      <User className={cn('h-4 w-4', isSelected ? 'text-white' : 'text-blue-600 dark:text-blue-400')} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={cn(
                        'text-sm font-semibold truncate',
                        isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white',
                      )}>
                        {session.memberName}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {sessionDate.toLocaleDateString(locale, { weekday: 'short', day: '2-digit', month: '2-digit' })}
                        {' · '}
                        {sessionDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    {evaluated ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                    ) : (
                      <Clock className="h-4 w-4 text-amber-400 shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right panel: editing form */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {!selectedSession ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-center p-6">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center">
                <ClipboardList className="h-8 w-8 text-blue-300 dark:text-blue-600" />
              </div>
              <div className="text-sm font-medium text-gray-400 dark:text-gray-500">
                {t('evaluation.select_hint')}
              </div>
            </div>
          ) : (
            <div className="p-6">
              {/* Form header */}
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100 dark:border-gray-800">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900 dark:text-white">{selectedSession.memberName}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {new Date(selectedSession.session_time).toLocaleDateString(locale, {
                      weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric',
                    })}
                    {' · '}
                    {new Date(selectedSession.session_time).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {selectedSession.pt_feedback ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2.5 py-1 rounded-full shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {t('evaluation.badge_evaluated')}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2.5 py-1 rounded-full shrink-0">
                    <Clock className="h-3.5 w-3.5" />
                    {t('evaluation.badge_pending')}
                  </span>
                )}
              </div>

              {/* Attendance status */}
              <div className="mb-5">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-2">
                  {t('evaluation.attendance_label')}
                </label>
                <div className="flex gap-2">
                  {[{ value: 'Present', label: t('evaluation.attendance_present') }, { value: 'Absent', label: t('evaluation.attendance_absent') }].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setField(selectedSession.id, 'attendance_status', value)}
                      className={cn(
                        'flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all',
                        selectedForm.attendance_status === value
                          ? value === 'Present'
                            ? 'bg-green-600 border-green-600 text-white'
                            : 'bg-red-500 border-red-500 text-white'
                          : 'bg-transparent border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500',
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Facility */}
              <div className="mb-5">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1.5">
                  {t('evaluation.facility_label')}
                </label>
                <div className="relative" ref={dropdownRef}>
                  <div
                    className="min-h-10 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-xl px-3 py-2 flex flex-wrap items-center gap-1.5 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                    onClick={() => setFacilityDropdownOpen((p) => !p)}
                  >
                    {selectedForm.facility_ids.map((fid) => {
                      const facility = allFacilities.find((f) => f.id === fid);
                      return (
                        <span
                          key={fid}
                          className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded-lg"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {facility?.facility_name ?? t('evaluation.facility_fallback', { id: fid })}
                          <button
                            type="button"
                            onClick={() => setField(selectedSession.id, 'facility_ids', selectedForm.facility_ids.filter((id) => id !== fid))}
                            className="hover:text-red-500 transition-colors ml-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      );
                    })}
                    <span className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 flex-1 min-w-0">
                      {selectedForm.facility_ids.length === 0 && <span className="truncate">{t('evaluation.facility_placeholder')}</span>}
                      <Building2 className="h-4 w-4 ml-auto flex-shrink-0" />
                    </span>
                  </div>
                  {facilityDropdownOpen && (
                    <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-52 overflow-y-auto">
                      {allFacilities.length === 0 ? (
                        <div className="p-3 text-sm text-gray-400 dark:text-gray-500 text-center">{t('evaluation.no_facilities')}</div>
                      ) : (
                        allFacilities.map((facility) => {
                          const selected = selectedForm.facility_ids.includes(facility.id);
                          return (
                            <button
                              key={facility.id}
                              type="button"
                              onClick={() => toggleFacility(selectedSession.id, facility.id, selectedForm.facility_ids)}
                              className={cn(
                                'w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left transition-colors',
                                selected
                                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                  : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                              )}
                            >
                              <div className={cn(
                                'w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                                selected ? 'bg-blue-600 border-blue-600' : 'border-gray-300 dark:border-gray-600',
                              )}>
                                {selected && (
                                  <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 text-white" fill="none">
                                    <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="font-medium truncate">{facility.facility_name}</div>
                                {facility.facility_type && (
                                  <div className="text-xs text-gray-400 dark:text-gray-500 truncate">{facility.facility_type}</div>
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

              {/* Text fields — 2 columns on wider screens */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-5">
                {FIELD_KEYS.map((key) => (
                  <div key={key}>
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1.5">
                      {t(`evaluation.fields.${key}_label`)}
                    </label>
                    <textarea
                      value={selectedForm[key]}
                      onChange={(e) => setField(selectedSession.id, key, e.target.value)}
                      placeholder={t(`evaluation.fields.${key}_placeholder`)}
                      rows={4}
                      className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-xl p-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 resize-none transition-colors"
                    />
                  </div>
                ))}
              </div>

              {/* Save button */}
              <button
                onClick={() => handleSave(selectedSession)}
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {isPending ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {t('evaluation.save_btn')}
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EvaluationList;
