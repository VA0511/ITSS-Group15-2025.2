import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BookTraining = () => {
  const { t, i18n } = useTranslation('member');
  const locale = i18n.language === 'ja' ? 'ja-JP' : i18n.language === 'en' ? 'en-US' : 'vi-VN';

  const [activeTab, setActiveTab] = useState('request');
  const [selectedDate, setSelectedDate] = useState('2026-04-14');
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [selectedDeniedRequest, setSelectedDeniedRequest] = useState(null);
  const [bookingForm, setBookingForm] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 10));
  const [formData, setFormData] = useState({
    trainingProgram: '',
    sessionCount: '',
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
    notes: ''
  });

  const DAY_KEYS_MON = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const FREE_SCHEDULE_KEYS = [
    { dayKey: 'Mon', slots: ['08:00-09:30', '14:00-15:30'] },
    { dayKey: 'Tue', slots: ['06:30-08:00', '17:00-18:30'] },
    { dayKey: 'Wed', slots: ['07:00-08:30', '18:00-19:30'] },
    { dayKey: 'Thu', slots: ['09:00-10:30', '15:00-16:30'] },
    { dayKey: 'Fri', slots: ['07:30-09:00', '13:00-14:30'] },
    { dayKey: 'Sat', slots: ['06:00-07:30', '10:00-11:30'] },
    { dayKey: 'Sun', slots: ['09:00-10:30', '16:00-17:30'] }
  ];

  const [trainingPrograms] = useState([
    'Yoga', 'Strength Training', 'Cardio', 'HIIT', 'Pilates', 'CrossFit', 'Zumba', 'Boxing', 'Personal Training'
  ]);

  const [availableBookings] = useState({
    '2026-04-07': [
      { time: '07:00', startTime: '07:00', endTime: '08:30', name: 'Lớp Aerobic', type: 'Aerobic', location: 'Studio B', trainer: 'Lê Thị B', isBookable: true },
      { time: '10:00', startTime: '10:00', endTime: '11:00', name: 'PT cá nhân', type: 'Personal Training', location: 'Phòng A1', trainer: 'Nguyễn Minh', isBookable: false },
      { time: '15:00', startTime: '15:00', endTime: '16:30', name: 'Lớp Zumba', type: 'Zumba', location: 'Studio A', trainer: 'Hoàng Văn E', isBookable: true }
    ],
    '2026-04-14': [
      { time: '08:00', startTime: '08:00', endTime: '09:30', name: 'Lớp Strength', type: 'Strength Training', location: 'Phòng B1', trainer: 'Trần Văn C', isBookable: true },
      { time: '11:00', startTime: '11:00', endTime: '12:00', name: 'PT cá nhân', type: 'Personal Training', location: 'Phòng A1', trainer: 'Phạm Thị D', isBookable: false }
    ]
  });

  const [memberRequests, setMemberRequests] = useState({
    '2026-04-18': [
      {
        time: '07:30', startTime: '07:30', endTime: '08:30',
        name: 'Lớp Pilates', type: 'Pilates', location: 'Phòng A3', trainer: 'Lê Thị B',
        status: 'Accepted', submittedAt: '2026-04-15',
        requestDetails: { fullName: 'Nguyễn Tuấn A', phoneNumber: '090 123 4567', email: 'tuana@gym.com', address: 'Số 123 Đường B, TPHCM', curriculum: 'Pilates', notes: '' }
      }
    ],
    '2026-04-20': [
      {
        time: '16:00', startTime: '16:00', endTime: '17:00',
        name: 'PT cá nhân', type: 'Personal Training', location: 'Phòng B1', trainer: 'Phạm Thị D',
        status: 'Rejected', submittedAt: '2026-04-17',
        denyReason: 'Khung giờ này đã kín lịch cho huấn luyện viên. Vui lòng chọn buổi khác.',
        requestDetails: { fullName: 'Nguyễn Tuấn A', phoneNumber: '090 123 4567', email: 'tuana@gym.com', address: 'Số 123 Đường B, TPHCM', curriculum: 'Personal Training', notes: '' }
      }
    ]
  });

  const trainerInfo = {
    'Nguyễn Minh': {
      name: 'Nguyễn Minh', birthYear: 1992,
      specialization: 'Strength Training, Powerlifting',
      phone: '+84 912 345 678', email: 'nguyen.minh@gym.com',
      awards: [
        { icon: '🥇', title: 'HCV Bodybuilding Championship', org: 'VNBF 2023' },
        { icon: '🥈', title: "Á quân Men's Physique", org: 'WBPF 2022' }
      ],
      experience: [
        { position: 'Senior PT — ActiveGym Hà Nội', duration: '2021 – nay · 4 năm' },
        { position: 'Personal Trainer — California Fitness', duration: '2018 – 2021 · 3 năm' }
      ],
      measurements: {
        height: { value: 180, unit: 'cm' }, weight: { value: 82, unit: 'kg' },
        chest: { value: 105, unit: 'cm' }, arm: { value: 40, unit: 'cm' },
        waist: { value: 78, unit: 'cm' }, forearm: { value: 32, unit: 'cm' },
        thigh: { value: 60, unit: 'cm' }, calf: { value: 42, unit: 'cm' }
      }
    },
    'Lê Thị B': {
      name: 'Lê Thị B', birthYear: 1995,
      specialization: 'Cardio, HIIT, CrossFit',
      phone: '+84 912 345 679', email: 'le.thib@gym.com',
      awards: [
        { icon: '🥇', title: 'CrossFit Regional Champion', org: 'Asia 2023' },
        { icon: '🏆', title: 'Best HIIT Instructor', org: 'ActiveGym 2024' }
      ],
      experience: [
        { position: 'Head Instructor — ActiveGym Hà Nội', duration: '2020 – nay · 5 năm' },
        { position: 'Fitness Coach — Pure Gym', duration: '2017 – 2020 · 3 năm' }
      ],
      measurements: {
        height: { value: 165, unit: 'cm' }, weight: { value: 58, unit: 'kg' },
        chest: { value: 88, unit: 'cm' }, arm: { value: 28, unit: 'cm' },
        waist: { value: 68, unit: 'cm' }, forearm: { value: 24, unit: 'cm' },
        thigh: { value: 52, unit: 'cm' }, calf: { value: 36, unit: 'cm' }
      }
    },
    'Phạm Thị D': {
      name: 'Phạm Thị D', birthYear: 1993,
      specialization: 'Personal Training, Core Training',
      phone: '+84 912 345 680', email: 'pham.thid@gym.com',
      awards: [
        { icon: '🥇', title: 'Personal Trainer of the Year', org: 'Vietnam Fitness 2023' }
      ],
      experience: [
        { position: 'Senior PT Manager — ActiveGym Hà Nội', duration: '2019 – nay · 6 năm' }
      ],
      measurements: {
        height: { value: 168, unit: 'cm' }, weight: { value: 62, unit: 'kg' },
        chest: { value: 92, unit: 'cm' }, arm: { value: 30, unit: 'cm' },
        waist: { value: 70, unit: 'cm' }, forearm: { value: 26, unit: 'cm' },
        thigh: { value: 55, unit: 'cm' }, calf: { value: 38, unit: 'cm' }
      }
    },
    'Trần Văn C': {
      name: 'Trần Văn C', birthYear: 1990,
      specialization: 'Pilates, Flexibility, Rehabilitation',
      phone: '+84 912 345 682', email: 'tran.vanc@gym.com',
      awards: [
        { icon: '🥇', title: 'Master Instructor Award', org: 'Pilates Association 2023' }
      ],
      experience: [
        { position: 'Pilates Master Instructor — ActiveGym Hà Nội', duration: '2018 – nay · 7 năm' }
      ],
      measurements: {
        height: { value: 175, unit: 'cm' }, weight: { value: 75, unit: 'kg' },
        chest: { value: 100, unit: 'cm' }, arm: { value: 36, unit: 'cm' },
        waist: { value: 77, unit: 'cm' }, forearm: { value: 30, unit: 'cm' },
        thigh: { value: 58, unit: 'cm' }, calf: { value: 41, unit: 'cm' }
      }
    }
  };

  const dateKey = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

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
    let nx = 1;
    const tot = offset + dim;
    const rem = tot % 7 === 0 ? 0 : 7 - (tot % 7);
    for (let i = 0; i < rem; i++) days.push({ day: nx++, isCurrentMonth: false });
    return days;
  };

  const calendarDays = buildCalendar();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  const selectedWorkouts = selectedDate ? availableBookings[selectedDate] || [] : [];
  const requestDates = Object.keys(memberRequests).sort();

  const selectDay = (d) => setSelectedDate(dateKey(year, month, d));
  const previousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const resetFormData = () => setFormData({ trainingProgram: '', sessionCount: '', fullName: '', phoneNumber: '', email: '', address: '', notes: '' });

  const getStatusBadgeClass = (status) => {
    if (status === 'Accepted') return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300';
    if (status === 'Pending') return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300';
    if (status === 'Rejected') return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300';
    return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
  };

  const getAccentColor = (item) => {
    if (item.status === 'Accepted') return '#16A34A';
    if (item.status === 'Pending') return '#EAB308';
    return '#EF4444';
  };

  const closeBookingForm = () => { setBookingForm(null); resetFormData(); };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!formData.trainingProgram || !formData.sessionCount) {
      alert(t('book_training.form_required_error'));
      return;
    }
    const requestDate = bookingForm.requestDate || selectedDate;
    const nextRequest = {
      time: bookingForm.time, startTime: bookingForm.startTime, endTime: bookingForm.endTime,
      name: bookingForm.name, type: bookingForm.type, location: bookingForm.location,
      trainer: bookingForm.trainer, status: 'Pending',
      submittedAt: new Date().toISOString().slice(0, 10),
      requestDetails: { ...formData, curriculum: formData.trainingProgram }
    };
    setMemberRequests((prev) => ({ ...prev, [requestDate]: [...(prev[requestDate] || []), nextRequest] }));
    alert(t('book_training.success_submit'));
    setActiveTab('myRequests');
    setBookingForm(null);
    resetFormData();
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{t('book_training.title')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t('book_training.subtitle')}</p>
      </div>

      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl mb-6">
        <div className="flex gap-2 p-4 border-b border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setActiveTab('request')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${activeTab === 'request' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          >
            {t('book_training.tab_request')}
          </button>
          <button
            onClick={() => setActiveTab('myRequests')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${activeTab === 'myRequests' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          >
            {t('book_training.tab_my_requests')}
          </button>
        </div>
      </div>

      {activeTab === 'request' && (
        <div>
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('book_training.sessions_label')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('book_training.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">{t('book_training.form_title')}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200 block mb-2">
                      {t('book_training.program_label')}
                    </label>
                    <select
                      value={formData.trainingProgram}
                      onChange={(e) => setFormData({ ...formData, trainingProgram: e.target.value })}
                      className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white"
                    >
                      <option value="">{t('book_training.program_placeholder')}</option>
                      {trainingPrograms.map((prog) => <option key={prog} value={prog}>{prog}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200 block mb-2">
                      {t('book_training.sessions_label')}
                    </label>
                    <input
                      type="number" min="1" max="20"
                      value={formData.sessionCount}
                      onChange={(e) => setFormData({ ...formData, sessionCount: e.target.value })}
                      placeholder={t('book_training.sessions_placeholder')}
                      className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-6">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">{t('book_training.calendar_title')}</h3>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={previousMonth} className="w-7 h-7 rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">‹</button>
                    <div className="text-sm font-bold text-gray-800 dark:text-white capitalize">{monthName}</div>
                    <button onClick={nextMonth} className="w-7 h-7 rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">›</button>
                  </div>
                  <div className="grid grid-cols-7 gap-0 mb-2">
                    {DAY_KEYS_MON.map((key) => (
                      <div key={key} className="text-xs font-bold text-gray-400 dark:text-gray-500 text-center py-2">
                        {t(`schedule.calendar.days.${key}`)}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((dayObj, idx) => {
                      const key = dayObj.isCurrentMonth ? dateKey(year, month, dayObj.day) : null;
                      const isSelected = selectedDate === key;
                      const todayObj = new Date();
                      const isToday = dayObj.isCurrentMonth && dayObj.day === todayObj.getDate() && month === todayObj.getMonth() && year === todayObj.getFullYear();
                      const isPast = dayObj.isCurrentMonth && new Date(year, month, dayObj.day) < new Date(todayObj.getFullYear(), todayObj.getMonth(), todayObj.getDate());
                      return (
                        <div
                          key={idx}
                          onClick={() => dayObj.isCurrentMonth && !isPast && selectDay(dayObj.day)}
                          className={`h-12 flex flex-col items-center justify-center rounded text-xs transition-all ${
                            isSelected ? 'bg-blue-600 text-white font-bold cursor-pointer'
                            : isPast ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                            : dayObj.isCurrentMonth ? 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-pointer'
                            : 'text-gray-300 dark:text-gray-600'
                          } ${isToday && !isSelected ? 'ring-2 ring-blue-500 ring-inset font-bold text-blue-600 dark:text-blue-400' : ''}`}
                        >
                          <span className="text-sm font-semibold">{dayObj.day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-3">
                    {t('book_training.available_days_label')}
                  </h4>
                  <div className="space-y-2">
                    {FREE_SCHEDULE_KEYS.map((row, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white min-w-16">
                          {t(`schedule.trainer_modal.days.${row.dayKey}`)}
                        </div>
                        <div className="flex flex-wrap gap-2 flex-1">
                          {row.slots.length === 0 ? (
                            <span className="text-sm text-gray-400 italic">{t('book_training.no_slots')}</span>
                          ) : (
                            row.slots.map((slot, slotIdx) => (
                              <span key={`${idx}-${slotIdx}`} className="px-2.5 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700">
                                {slot}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!formData.trainingProgram || !formData.sessionCount) {
                    alert(t('book_training.find_error'));
                    return;
                  }
                  document.getElementById('trainers-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('book_training.find_btn')}
              </button>
            </div>
          </div>

          <div id="trainers-section" className="mt-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('book_training.trainers_title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.keys(trainerInfo).map((trainerName) => (
                <div
                  key={trainerName}
                  onClick={() => setSelectedTrainer(trainerName)}
                  className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all hover:border-blue-400 dark:hover:border-blue-600"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xl font-semibold text-blue-600 dark:text-blue-400">
                        {trainerName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{trainerName}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{trainerInfo[trainerName].specialization}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {trainerInfo[trainerName].experience[0].position}
                  </p>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                    {t('book_training.view_detail_btn')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'myRequests' && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('book_training.my_requests_title')}</h2>
          {requestDates.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-3xl mx-auto mb-4">📋</div>
              <p className="text-gray-500 dark:text-gray-400">{t('book_training.no_requests')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requestDates.map((date) =>
                memberRequests[date].map((request, idx) => (
                  <div
                    key={`${date}-${idx}`}
                    onClick={() => setSelectedWorkout(request)}
                    className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all hover:border-blue-400 dark:hover:border-blue-600 relative"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{request.name}</h3>
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${getStatusBadgeClass(request.status)}`}>
                            {t(`schedule.status.${request.status}`, { defaultValue: request.status })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {request.startTime} - {request.endTime} • {request.location}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PT {request.trainer} • {t('book_training.sent_on')} {request.submittedAt}
                        </p>
                      </div>
                      <div className="text-right">
                        <div
                          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                          style={{ backgroundColor: getAccentColor(request) }}
                        />
                        {request.status === 'Rejected' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedDeniedRequest(request); }}
                            className="text-xs font-semibold px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          >
                            {t('book_training.denied_reason_btn')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Trainer Detail Modal */}
      {selectedTrainer && trainerInfo[selectedTrainer] && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-950 rounded-xl max-w-2xl w-full my-auto border border-gray-200 dark:border-gray-800">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('book_training.trainer_modal_title')}</h2>
              <button onClick={() => setSelectedTrainer(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-3xl font-semibold text-blue-600 dark:text-blue-400 border-2 border-blue-200 dark:border-blue-700 mb-4">
                    {trainerInfo[selectedTrainer].name.charAt(0)}
                  </div>
                  <div className="text-center">
                    <div className="text-base font-semibold text-gray-900 dark:text-white">{trainerInfo[selectedTrainer].name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{t('book_training.birth_year_label')}: {trainerInfo[selectedTrainer].birthYear}</div>
                    <span className="inline-block mt-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">TRAINER</span>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">{t('book_training.basic_info')}</h3>
                  <div className="space-y-3">
                    {[
                      [t('book_training.full_name_label'), trainerInfo[selectedTrainer].name],
                      [t('book_training.birth_year_label'), trainerInfo[selectedTrainer].birthYear],
                      [t('book_training.phone_label'), trainerInfo[selectedTrainer].phone],
                      [t('book_training.email_label'), trainerInfo[selectedTrainer].email],
                      [t('book_training.specialization_label'), trainerInfo[selectedTrainer].specialization],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                        <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">{t('book_training.awards_title')}</h3>
                  <div className="space-y-3">
                    {trainerInfo[selectedTrainer].awards.map((award, idx) => (
                      <div key={idx} className="flex gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-sm flex-shrink-0">{award.icon}</div>
                        <div>
                          <div className="text-sm text-gray-900 dark:text-white">{award.title}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{award.org}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">{t('book_training.experience_title')}</h3>
                  <div className="space-y-3">
                    {trainerInfo[selectedTrainer].experience.map((exp, idx) => (
                      <div key={idx} className="flex gap-2.5">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${idx === 0 ? 'bg-blue-600' : 'bg-blue-300'}`} />
                        <div>
                          <div className="text-sm text-gray-900 dark:text-white">{exp.position}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{exp.duration}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">{t('book_training.measurements_title')}</h3>
                <div className="grid grid-cols-4 gap-3">
                  {Object.entries(trainerInfo[selectedTrainer].measurements).map(([key, val]) => (
                    <div key={key} className="bg-white dark:bg-gray-800/50 rounded-lg p-3">
                      <div className="text-xs text-gray-600 dark:text-gray-400">{t(`book_training.measurements.${key}`)}</div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                        {val.value} <span className="text-xs text-gray-600 dark:text-gray-400">{val.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button onClick={() => setSelectedTrainer(null)} className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  {t('book_training.close_btn')}
                </button>
                <button
                  onClick={() => {
                    setBookingForm({ name: 'Buổi tập', type: formData.trainingProgram, trainer: selectedTrainer, requestDate: selectedDate, startTime: '10:00', endTime: '11:00', time: '10:00', location: 'Phòng tập', isBookable: true });
                    setSelectedTrainer(null);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('book_training.request_btn')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Form Modal */}
      {bookingForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-950 rounded-xl max-w-md w-full my-auto border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('book_training.booking_form_title')}</h2>
              <button onClick={closeBookingForm} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                <div className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-2">Trainer: {bookingForm.trainer}</div>
                <div className="text-xs text-blue-800 dark:text-blue-400">
                  <div>{formData.trainingProgram}</div>
                  <div>{formData.sessionCount}</div>
                </div>
              </div>

              {[
                { field: 'fullName', label: t('book_training.name_label'), placeholder: t('book_training.name_placeholder'), type: 'text', required: true },
                { field: 'phoneNumber', label: t('book_training.phone_form_label'), placeholder: t('book_training.phone_placeholder'), type: 'tel', required: true },
                { field: 'email', label: t('book_training.email_form_label'), placeholder: t('book_training.email_placeholder'), type: 'email', required: false },
                { field: 'address', label: t('book_training.address_label'), placeholder: t('book_training.address_placeholder'), type: 'text', required: false },
              ].map(({ field, label, placeholder, type, required }) => (
                <div key={field} className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={formData[field]}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    required={required}
                    className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white"
                  />
                </div>
              ))}

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('book_training.notes_label')}</label>
                <textarea
                  placeholder={t('book_training.notes_placeholder')}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button type="button" onClick={closeBookingForm} className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  {t('book_training.cancel_btn')}
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                  {t('book_training.submit_btn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Workout Detail Modal */}
      {selectedWorkout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
          <div className="bg-white dark:bg-gray-950 rounded-xl w-full max-w-md border border-gray-200 dark:border-gray-800 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('book_training.detail_title')}</h2>
              <button onClick={() => setSelectedWorkout(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">{t('book_training.detail_title')}</div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedWorkout.name}</p>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">{t('book_training.detail_status_label')}</div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded whitespace-nowrap inline-block ${getStatusBadgeClass(selectedWorkout.status)}`}>
                  {t(`schedule.status.${selectedWorkout.status}`, { defaultValue: selectedWorkout.status })}
                </span>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">{t('book_training.detail_submitted_label')}</div>
                <p className="text-sm text-gray-900 dark:text-white">{selectedWorkout.submittedAt}</p>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">{t('book_training.detail_trainer_label')}</div>
                <p className="text-sm text-gray-900 dark:text-white">{selectedWorkout.trainer}</p>
              </div>
            </div>
            <div className="flex gap-3 border-t border-gray-200 dark:border-gray-800 p-6">
              <button onClick={() => setSelectedWorkout(null)} className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                {t('book_training.close_btn')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Denied Request Modal */}
      {selectedDeniedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-950 rounded-xl max-w-sm w-full border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('book_training.denied_detail_title')}</h2>
              <button onClick={() => setSelectedDeniedRequest(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">{t('book_training.denied_request_label')}</div>
                <p className="text-base font-bold text-gray-900 dark:text-white">{selectedDeniedRequest.name}</p>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">{t('book_training.denied_reason_label')}</div>
                <p className="text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg">
                  {selectedDeniedRequest.denyReason}
                </p>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button onClick={() => setSelectedDeniedRequest(null)} className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  {t('book_training.close_btn')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookTraining;
