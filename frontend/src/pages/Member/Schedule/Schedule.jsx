import React, { useState, useMemo, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { useMyBookings, usePTDetails, useTrainingSessions, useMyCheckInHistory } from '@/hooks/queries/useTraining';
import { useCreateBooking, useConfirmAttendance } from '@/hooks/mutations/useTrainingMutations';

import ScheduleTabs from './components/ScheduleTabs';
import CalendarView from './components/CalendarView';
import WorkoutList from './components/WorkoutList';
import EvaluationView from './components/EvaluationView';
import EvaluationTimeline from './components/EvaluationTimeline';
import RequestsTimeline from './components/RequestsTimeline';
import CheckInHistoryTimeline from './components/CheckInHistoryTimeline';
import TrainerModal from './components/Modals/TrainerModal';
import BookingModal from './components/Modals/BookingModal';
import WorkoutDetailModal from './components/Modals/WorkoutDetailModal';
import DeniedRequestModal from './components/Modals/DeniedRequestModal';
import PTCardList from './components/PTCardList';

const isPendingScheduledStatus = (status) => status === 'Unconfirmed';

const getWorkoutDateTime = (dateKey, time) => new Date(`${dateKey}T${time}:00`);

const getNextUpcomingWorkout = (workoutMap) =>
  Object.entries(workoutMap)
    .flatMap(([dateKey, dayWorkouts]) =>
      dayWorkouts.map((workout, index) => ({
        dateKey,
        index,
        workout,
        dateTime: getWorkoutDateTime(dateKey, workout.startTime),
      })),
    )
    .filter(({ workout, dateTime }) => dateTime >= new Date() && isPendingScheduledStatus(workout.status))
    .sort((a, b) => a.dateTime - b.dateTime)[0];

const Schedule = () => {
  const { t, i18n } = useTranslation('member');
  const locale = i18n.language === 'ja' ? 'ja-JP' : i18n.language === 'en' ? 'en-US' : 'vi-VN';
  const todayKey = format(new Date(), 'yyyy-MM-dd');

  const [activeTab, setActiveTab] = useState('scheduled');
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [selectedDeniedRequest, setSelectedDeniedRequest] = useState(null);
  const [bookingForm, setBookingForm] = useState(null);
  const [formData, setFormData] = useState({
    notes: '',
    bookingDate: '',
    startTime: '',
    endTime: '',
    intensity: '',
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(todayKey);

  const { data: bookingsRaw } = useMyBookings();
  const { data: ptDetailsRaw } = usePTDetails();
  const { data: sessionsRaw } = useTrainingSessions();
  const { data: checkInHistoryRaw } = useMyCheckInHistory();
  const bookings = Array.isArray(bookingsRaw) ? bookingsRaw : [];
  const ptDetails = Array.isArray(ptDetailsRaw) ? ptDetailsRaw : [];
  const sessions = Array.isArray(sessionsRaw) ? sessionsRaw : [];
  const checkInHistories = Array.isArray(checkInHistoryRaw) ? checkInHistoryRaw : [];
  const { mutate: createBooking, isPending: isCreating } = useCreateBooking();
  const { mutate: confirmAttendance } = useConfirmAttendance();

  const scheduledWorkouts = useMemo(() => {
    const map = {};
    bookings
      .filter((b) => b.status === 'Accepted')
      .forEach((b) => {
        const dateKey = b.requested_start.slice(0, 10);
        const pt = ptDetails.find((p) => p.employee_id === b.pt_id);
        const ptName = pt?.full_name || `PT #${b.pt_id}`;
        const session = sessions.find((s) => s.booking_id === b.id);

        let status;
        if (session?.member_confirmed_at) status = 'Confirmed';
        else if (session) status = 'Unconfirmed';
        else status = 'Scheduled';

        if (!map[dateKey]) map[dateKey] = [];
        map[dateKey].push({
          bookingId: b.id,
          sessionId: session?.id ?? null,
          startTime: b.requested_start.slice(11, 16),
          endTime: b.requested_end.slice(11, 16),
          name: t('schedule.session_with', { name: ptName }),
          type: b.training_plan_note || 'Personal',
          location: '',
          trainer: ptName,
          status,
        });
      });
    return map;
  }, [bookings, ptDetails, sessions, t]);

  const requestsWorkouts = useMemo(() => {
    const now = new Date();
    const map = {};
    bookings
      .filter((b) => b.status === 'Pending' || b.status === 'Rejected')
      .forEach((b) => {
        const dateKey = b.requested_start.slice(0, 10);
        const pt = ptDetails.find((p) => p.employee_id === b.pt_id);
        const ptName = pt?.full_name || `PT #${b.pt_id}`;
        // Nếu Pending nhưng thời gian yêu cầu đã qua → đánh dấu Expired
        const isPastDue = b.status === 'Pending' && new Date(b.requested_end) < now;
        if (!map[dateKey]) map[dateKey] = [];
        map[dateKey].push({
          bookingId: b.id,
          startTime: b.requested_start.slice(11, 16),
          endTime: b.requested_end.slice(11, 16),
          name: t('schedule.request_with', { name: ptName }),
          type: b.training_plan_note || 'Personal',
          location: '',
          trainer: ptName,
          status: isPastDue ? 'Expired' : b.status,
          denyReason: b.rejection_reason || '',
        });
      });
    return map;
  }, [bookings, ptDetails, t]);

  const completedSessionsMap = useMemo(() => {
    const map = {};
    bookings
      .filter((b) => b.status === 'Completed')
      .forEach((b) => {
        const dk = b.requested_start.slice(0, 10);
        const pt = ptDetails.find((p) => p.employee_id === b.pt_id);
        const ptName = pt?.full_name || `PT #${b.pt_id}`;
        const session = sessions.find((s) => s.booking_id === b.id);
        if (!map[dk]) map[dk] = [];
        map[dk].push({
          sessionId: session?.id ?? null,
          bookingId: b.id,
          startTime: b.requested_start.slice(11, 16),
          endTime: b.requested_end.slice(11, 16),
          ptName,
          trainingPlanNote: b.training_plan_note || '',
          intensity: b.intensity || '',
          roadmapGoal: b.roadmap_goal || '',
          attendanceStatus: session?.attendance_status || 'Absent',
          ptFeedback: session?.pt_feedback || '',
          physicalCondition: session?.physical_condition || '',
          sessionResult: session?.session_result || '',
          nutritionAdvice: session?.nutrition_advice || '',
        });
      });
    return map;
  }, [bookings, ptDetails, sessions]);

  const ptBookingData = useMemo(() => {
    if (!selectedDate) return {};
    return {
      [selectedDate]: ptDetails.map((pt) => ({
        startTime: '',
        endTime: '',
        name: pt.full_name,
        type: `${pt.experience_years || 0}`,
        location: '',
        trainer: pt.full_name,
        isBookable: true,
        ptId: pt.employee_id,
      })),
    };
  }, [ptDetails, selectedDate]);

  const hasNavigated = useRef(false);
  useEffect(() => {
    if (hasNavigated.current || Object.keys(scheduledWorkouts).length === 0) return;
    const nextWorkout = getNextUpcomingWorkout(scheduledWorkouts);
    if (nextWorkout) {
      hasNavigated.current = true;
      setCurrentDate(new Date(nextWorkout.dateTime.getFullYear(), nextWorkout.dateTime.getMonth(), 1));
      setSelectedDate(nextWorkout.dateKey);
    }
  }, [scheduledWorkouts]);

  useEffect(() => {
    if (bookingForm) {
      setFormData((prev) => ({ ...prev, bookingDate: selectedDate }));
    }
  }, [bookingForm]);

  const dateKey = (y, m, d) =>
    `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const buildCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days = [];
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, isCurrentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }
    const totalCells = Math.ceil(days.length / 7) * 7;
    for (let i = 1; i <= totalCells - days.length; i++) {
      days.push({ day: i, isCurrentMonth: false });
    }
    return days;
  };

  const selectDay = (day) => {
    setSelectedDate(dateKey(currentDate.getFullYear(), currentDate.getMonth(), day));
  };

  const resetFormData = () => {
    setFormData({ notes: '', bookingDate: '', startTime: '', endTime: '', intensity: '' });
  };

  const currentData =
    activeTab === 'scheduled'
      ? scheduledWorkouts
      : activeTab === 'booking'
        ? ptBookingData
        : activeTab === 'evaluations'
          ? completedSessionsMap
          : requestsWorkouts;

  const prevMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const monthName = currentDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  const selectedWorkouts = selectedDate ? (currentData[selectedDate] || []) : [];
  const requestDates = Object.keys(requestsWorkouts).sort();
  const defaultRequestDate = requestDates[0] || selectedDate;
  const selectedDateObject = selectedDate ? new Date(`${selectedDate}T00:00:00`) : null;

  const openScheduledTab = () => {
    setActiveTab('scheduled');
    const nextWorkout = getNextUpcomingWorkout(scheduledWorkouts);
    if (!nextWorkout) {
      setSelectedDate(todayKey);
      setCurrentDate(new Date());
      return;
    }
    setSelectedDate(nextWorkout.dateKey);
    setCurrentDate(new Date(nextWorkout.dateTime.getFullYear(), nextWorkout.dateTime.getMonth(), 1));
  };

  const openBookingTab = () => {
    setActiveTab('booking');
    setSelectedDate(todayKey);
    setCurrentDate(new Date());
  };

  const openEvaluationsTab = () => {
    setActiveTab('evaluations');
    const dates = Object.keys(completedSessionsMap).sort().reverse();
    if (dates.length > 0) {
      const latest = dates[0];
      setSelectedDate(latest);
      setCurrentDate(new Date(`${latest}T00:00:00`));
    } else {
      setSelectedDate(todayKey);
      setCurrentDate(new Date());
    }
  };

  const openCheckInHistoryTab = () => {
    setActiveTab('checkin_history');
    setSelectedDate(todayKey);
    setCurrentDate(new Date());
  };

  const getCalendarDotClass = (item) => {
    if (activeTab === 'scheduled') {
      return item.status === 'Confirmed' ? 'bg-green-500' : 'bg-blue-400';
    }
    if (activeTab === 'requests') {
      if (item.status === 'Accepted') return 'bg-green-500';
      if (item.status === 'Pending') return 'bg-yellow-400';
      return 'bg-red-400';
    }
    if (activeTab === 'evaluations') {
      return item.attendanceStatus === 'Present' ? 'bg-green-500' : 'bg-red-400';
    }
    return item.isBookable ? 'bg-blue-400' : 'bg-gray-400';
  };

  const getAccentColor = (item) => {
    if (activeTab === 'scheduled') {
      if (item.status === 'Confirmed') return '#16A34A';
      if (item.status === 'Unconfirmed') return '#EAB308';
      return '#9CA3AF';
    }
    if (activeTab === 'requests') {
      if (item.status === 'Accepted') return '#16A34A';
      if (item.status === 'Pending') return '#EAB308';
      if (item.status === 'Expired') return '#9CA3AF';
      return '#EF4444';
    }
    return item.isBookable ? '#3B82F6' : '#9CA3AF';
  };

  const getStatusBadgeClass = (status) => {
    if (status === 'Confirmed' || status === 'Accepted')
      return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300';
    if (status === 'Unconfirmed' || status === 'Pending' || status === 'Scheduled')
      return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300';
    if (status === 'Rejected')
      return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300';
    if (status === 'Expired')
      return 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400';
    return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
  };

  const handleConfirmAttendance = (dk, workoutIndex) => {
    const workout = scheduledWorkouts[dk]?.[workoutIndex];
    if (!workout?.sessionId) return;
    confirmAttendance(workout.sessionId);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const { bookingDate, startTime, endTime, notes } = formData;
    if (!bookingForm?.ptId || !bookingDate || !startTime || !endTime) return;

    const { intensity } = formData;
    createBooking(
      {
        pt_id: bookingForm.ptId,
        requested_start: `${bookingDate}T${startTime}:00Z`,
        requested_end: `${bookingDate}T${endTime}:00Z`,
        training_plan_note: notes.trim(),
        intensity: intensity.trim(),
      },
      {
        onSuccess: () => {
          setBookingForm(null);
          resetFormData();
          setActiveTab('requests');
          setSelectedDate(bookingDate);
        },
      },
    );
  };

  return (
    <div className="pb-10">
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-none flex flex-col" style={{ minHeight: '680px' }}>

        {/* Tab bar — always visible */}
        <ScheduleTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setSelectedDate={setSelectedDate}
          defaultRequestDate={defaultRequestDate}
          openScheduledTab={openScheduledTab}
          openBookingTab={openBookingTab}
          openEvaluationsTab={openEvaluationsTab}
          openCheckInHistoryTab={openCheckInHistoryTab}
          todayKey={todayKey}
        />

        {activeTab === 'evaluations' ? (
          /* ── Evaluations: full-width timeline, no calendar ── */
          <div className="flex-1 overflow-y-auto">
            <EvaluationTimeline
              completedSessionsMap={completedSessionsMap}
              locale={locale}
            />
          </div>
        ) : activeTab === 'checkin_history' ? (
          /* ── CheckInHistory: full-width timeline, no calendar ── */
          <div className="flex-1 overflow-y-auto">
            <CheckInHistoryTimeline
              checkInHistories={checkInHistories}
              locale={locale}
            />
          </div>
        ) : activeTab === 'requests' ? (
          /* ── Requests: full-width grouped list, no calendar ── */
          <div className="flex-1 overflow-y-auto">
            <RequestsTimeline
              requestsWorkouts={requestsWorkouts}
              locale={locale}
              setSelectedDeniedRequest={setSelectedDeniedRequest}
              setSelectedWorkout={setSelectedWorkout}
            />
          </div>
        ) : (
          /* ── Other tabs: Calendar (left) + Content (right) ── */
          <div className="flex flex-col lg:flex-row flex-1">
            {/* Left panel: calendar */}
            <div className="lg:w-[55%] shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-800">
              <div className="flex-1">
                <CalendarView
                  currentDate={currentDate}
                  prevMonth={prevMonth}
                  nextMonth={nextMonth}
                  monthName={monthName}
                  calendarDays={buildCalendar()}
                  dateKey={dateKey}
                  year={currentDate.getFullYear()}
                  month={currentDate.getMonth()}
                  displayData={currentData}
                  selectedDate={selectedDate}
                  selectDay={selectDay}
                  getCalendarDotClass={getCalendarDotClass}
                  activeTab={activeTab}
                />
              </div>
            </div>

            {/* Right panel: content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'booking' ? (
                <PTCardList
                  ptDetails={ptDetails}
                  setSelectedTrainer={setSelectedTrainer}
                  bookings={bookings}
                  selectedDate={selectedDate}
                />
              ) : (
                <WorkoutList
                  activeTab={activeTab}
                  selectedDate={selectedDate}
                  selectedDateObject={selectedDateObject}
                  locale={locale}
                  selectedWorkouts={selectedWorkouts}
                  getWorkoutDisplayName={(w) => w.name}
                  setSelectedWorkout={setSelectedWorkout}
                  getStatusBadgeClass={getStatusBadgeClass}
                  getAccentColor={getAccentColor}
                  setSelectedTrainer={setSelectedTrainer}
                  setBookingForm={setBookingForm}
                  handleConfirmAttendance={handleConfirmAttendance}
                  setSelectedDeniedRequest={setSelectedDeniedRequest}
                  nextUpcomingWorkout={null}
                  isPendingScheduledStatus={isPendingScheduledStatus}
                />
              )}
            </div>
          </div>
        )}

      </div>

      <TrainerModal
        selectedTrainer={selectedTrainer}
        ptDetails={ptDetails}
        setSelectedTrainer={setSelectedTrainer}
        setBookingForm={setBookingForm}
      />

      <BookingModal
        bookingForm={bookingForm}
        closeBookingForm={() => setBookingForm(null)}
        handleBookingSubmit={handleBookingSubmit}
        formData={formData}
        setFormData={setFormData}
        isPending={isCreating}
      />

      <WorkoutDetailModal
        selectedWorkout={selectedWorkout}
        setSelectedWorkout={setSelectedWorkout}
        activeTab={activeTab}
        getWorkoutDisplayName={(w) => (activeTab === 'booking' ? w.trainer : w.name)}
        getStatusBadgeClass={getStatusBadgeClass}
        setSelectedTrainer={setSelectedTrainer}
        setSelectedDeniedRequest={setSelectedDeniedRequest}
      />

      <DeniedRequestModal
        selectedDeniedRequest={selectedDeniedRequest}
        setSelectedDeniedRequest={setSelectedDeniedRequest}
        getStatusBadgeClass={getStatusBadgeClass}
      />
    </div>
  );
};

export default Schedule;
