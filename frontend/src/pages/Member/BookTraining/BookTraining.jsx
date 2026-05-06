import React, { useState } from 'react';
import { X } from 'lucide-react';

const BookTraining = () => {
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

  const DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  const [trainingPrograms] = useState([
    'Yoga', 'Strength Training', 'Cardio', 'HIIT', 'Pilates', 'CrossFit', 'Zumba', 'Boxing', 'Personal Training'
  ]);

  const [availableBookings] = useState({
    '2026-04-07': [
      { time: '07:00', startTime: '07:00', endTime: '08:30', name: 'Lớp Aerobic', type: 'Aerobic', location: 'Studio B', trainer: 'Lê Thị B', isBookable: true },
      { time: '10:00', startTime: '10:00', endTime: '11:00', name: 'PT cá nhân', type: 'Personal Training', location: 'Phòng A1', trainer: 'Nguyễn Minh', isBookable: false },
      { time: '15:00', startTime: '15:00', endTime: '16:30', name: 'Lớp Zumba', type: 'Zumba', location: 'Studio A', trainer: 'Hoàng Văn E', isBookable: true }
    ],
    '2026-04-09': [
      { time: '06:30', startTime: '06:30', endTime: '07:30', name: 'Lớp Yoga sáng', type: 'Yoga', location: 'Phòng A2', trainer: 'Trần Văn C', isBookable: true },
      { time: '09:00', startTime: '09:00', endTime: '10:30', name: 'PT cá nhân', type: 'Personal Training', location: 'Phòng B2', trainer: 'Phạm Thị D', isBookable: false },
      { time: '18:00', startTime: '18:00', endTime: '19:30', name: 'Lớp CrossFit', type: 'CrossFit', location: 'Studio CrossFit', trainer: 'Lê Thị B', isBookable: true }
    ],
    '2026-04-11': [
      { time: '07:00', startTime: '07:00', endTime: '08:30', name: 'Lớp HIIT sáng', type: 'HIIT', location: 'Studio A', trainer: 'Hoàng Văn E', isBookable: true },
      { time: '14:00', startTime: '14:00', endTime: '15:00', name: 'PT cá nhân', type: 'Personal Training', location: 'Phòng C1', trainer: 'Nguyễn Minh', isBookable: false }
    ],
    '2026-04-14': [
      { time: '08:00', startTime: '08:00', endTime: '09:30', name: 'Lớp Strength', type: 'Strength Training', location: 'Phòng B1', trainer: 'Trần Văn C', isBookable: true },
      { time: '11:00', startTime: '11:00', endTime: '12:00', name: 'PT cá nhân', type: 'Personal Training', location: 'Phòng A1', trainer: 'Phạm Thị D', isBookable: false }
    ],
    '2026-04-17': [
      { time: '07:30', startTime: '07:30', endTime: '08:30', name: 'Lớp Pilates', type: 'Pilates', location: 'Phòng A3', trainer: 'Lê Thị B', isBookable: true },
      { time: '13:00', startTime: '13:00', endTime: '14:00', name: 'PT cá nhân', type: 'Personal Training', location: 'Phòng B1', trainer: 'Hoàng Văn E', isBookable: false },
      { time: '16:00', startTime: '16:00', endTime: '17:30', name: 'Lớp Boxing', type: 'Boxing', location: 'Studio B', trainer: 'Nguyễn Minh', isBookable: true }
    ],
    '2026-04-21': [
      { time: '06:00', startTime: '06:00', endTime: '07:30', name: 'Lớp Cardio', type: 'Cardio', location: 'Studio A', trainer: 'Phạm Thị D', isBookable: true },
      { time: '10:00', startTime: '10:00', endTime: '11:00', name: 'PT cá nhân', type: 'Personal Training', location: 'Phòng C2', trainer: 'Trần Văn C', isBookable: false }
    ],
    '2026-04-23': [
      { time: '18:00', startTime: '18:00', endTime: '19:30', name: 'Lớp Zumba tối', type: 'Zumba', location: 'Studio B', trainer: 'Lê Thị B', isBookable: true },
      { time: '19:30', startTime: '19:30', endTime: '20:30', name: 'PT cá nhân', type: 'Personal Training', location: 'Phòng A2', trainer: 'Hoàng Văn E', isBookable: false }
    ],
    '2026-04-25': [
      { time: '07:00', startTime: '07:00', endTime: '08:30', name: 'Lớp Yoga', type: 'Yoga', location: 'Phòng B2', trainer: 'Nguyễn Minh', isBookable: true }
    ],
    '2026-04-29': [
      { time: '09:00', startTime: '09:00', endTime: '10:30', name: 'Lớp Strength nâng cao', type: 'Strength Training', location: 'Phòng B1', trainer: 'Phạm Thị D', isBookable: true },
      { time: '15:00', startTime: '15:00', endTime: '16:00', name: 'PT cá nhân', type: 'Personal Training', location: 'Phòng C1', trainer: 'Lê Thị B', isBookable: false }
    ]
  });

  const [memberRequests, setMemberRequests] = useState({
    '2026-04-12': [
      {
        time: '18:00',
        startTime: '18:00',
        endTime: '19:30',
        name: 'Lớp Zumba tối',
        type: 'Zumba',
        location: 'Studio B',
        trainer: 'Lê Thị B',
        status: 'Chờ xác nhận',
        submittedAt: '2026-04-09',
        requestDetails: {
          fullName: 'Nguyễn Tuấn A',
          phoneNumber: '090 123 4567',
          email: 'tuana@gym.com',
          address: 'Số 123 Đường B, Phường C, Quận 1, TPHCM',
          curriculum: 'Zumba',
          notes: 'Muốn tham gia lớp buổi tối sau giờ làm.'
        }
      }
    ],
    '2026-04-18': [
      {
        time: '07:30',
        startTime: '07:30',
        endTime: '08:30',
        name: 'Lớp Pilates',
        type: 'Pilates',
        location: 'Phòng A3',
        trainer: 'Lê Thị B',
        status: 'Duyệt',
        submittedAt: '2026-04-15',
        requestDetails: {
          fullName: 'Nguyễn Tuấn A',
          phoneNumber: '090 123 4567',
          email: 'tuana@gym.com',
          address: 'Số 123 Đường B, Phường C, Quận 1, TPHCM',
          curriculum: 'Pilates',
          notes: 'Cần buổi tập nhẹ để cải thiện độ linh hoạt.'
        }
      }
    ],
    '2026-04-20': [
      {
        time: '16:00',
        startTime: '16:00',
        endTime: '17:00',
        name: 'PT cá nhân',
        type: 'Personal Training',
        location: 'Phòng B1',
        trainer: 'Phạm Thị D',
        status: 'Từ chối',
        submittedAt: '2026-04-17',
        denyReason: 'Khung giờ này đã kín lịch cho huấn luyện viên. Vui lòng chọn buổi khác trong tuần.',
        requestDetails: {
          fullName: 'Nguyễn Tuấn A',
          phoneNumber: '090 123 4567',
          email: 'tuana@gym.com',
          address: 'Số 123 Đường B, Phường C, Quận 1, TPHCM',
          curriculum: 'Personal Training',
          notes: 'Ưu tiên buổi chiều để tiện theo lịch làm việc.'
        }
      }
    ]
  });

  const trainerInfo = {
    'Nguyễn Minh': {
      name: 'Nguyễn Minh',
      birthYear: 1992,
      specialization: 'Strength Training, Powerlifting',
      phone: '+84 912 345 678',
      email: 'nguyen.minh@gym.com',
      awards: [
        { icon: '🥇', title: 'HCV Bodybuilding Championship', org: 'VNBF 2023' },
        { icon: '🥈', title: "Á quân Men's Physique", org: 'WBPF 2022' },
        { icon: '🏆', title: 'Top 3 PT of the Year', org: 'ActiveGym 2024' }
      ],
      experience: [
        { position: 'Senior PT — ActiveGym Hà Nội', duration: '2021 – nay · 4 năm' },
        { position: 'Personal Trainer — California Fitness', duration: '2018 – 2021 · 3 năm' },
        { position: 'Chứng chỉ ACE-CPT, ISSN-SNS', duration: '2018' }
      ],
      measurements: {
        height: { value: 180, unit: 'cm' },
        weight: { value: 82, unit: 'kg' },
        chest: { value: 105, unit: 'cm' },
        arm: { value: 40, unit: 'cm' },
        waist: { value: 78, unit: 'cm' },
        forearm: { value: 32, unit: 'cm' },
        thigh: { value: 60, unit: 'cm' },
        calf: { value: 42, unit: 'cm' }
      }
    },
    'Lê Thị B': {
      name: 'Lê Thị B',
      birthYear: 1995,
      specialization: 'Cardio, HIIT, CrossFit',
      phone: '+84 912 345 679',
      email: 'le.thib@gym.com',
      awards: [
        { icon: '🥇', title: 'CrossFit Regional Champion', org: 'Asia 2023' },
        { icon: '🏆', title: 'Best HIIT Instructor', org: 'ActiveGym 2024' }
      ],
      experience: [
        { position: 'Head Instructor — ActiveGym Hà Nội', duration: '2020 – nay · 5 năm' },
        { position: 'Fitness Coach — Pure Gym', duration: '2017 – 2020 · 3 năm' },
        { position: 'Chứng chỉ CrossFit Level 2, ISSN-SNS', duration: '2017' }
      ],
      measurements: {
        height: { value: 165, unit: 'cm' },
        weight: { value: 58, unit: 'kg' },
        chest: { value: 88, unit: 'cm' },
        arm: { value: 28, unit: 'cm' },
        waist: { value: 68, unit: 'cm' },
        forearm: { value: 24, unit: 'cm' },
        thigh: { value: 52, unit: 'cm' },
        calf: { value: 36, unit: 'cm' }
      }
    },
    'Phạm Thị D': {
      name: 'Phạm Thị D',
      birthYear: 1993,
      specialization: 'Personal Training, Core Training',
      phone: '+84 912 345 680',
      email: 'pham.thid@gym.com',
      awards: [
        { icon: '🥇', title: 'Personal Trainer of the Year', org: 'Vietnam Fitness 2023' },
        { icon: '🏆', title: 'Client Transformation Champion', org: 'ActiveGym 2024' }
      ],
      experience: [
        { position: 'Senior PT Manager — ActiveGym Hà Nội', duration: '2019 – nay · 6 năm' },
        { position: 'Personal Trainer — Diamond Fitness', duration: '2016 – 2019 · 3 năm' },
        { position: 'Chứng chỉ ACE-CPT, CES, FMS Level 2', duration: '2016' }
      ],
      measurements: {
        height: { value: 168, unit: 'cm' },
        weight: { value: 62, unit: 'kg' },
        chest: { value: 92, unit: 'cm' },
        arm: { value: 30, unit: 'cm' },
        waist: { value: 70, unit: 'cm' },
        forearm: { value: 26, unit: 'cm' },
        thigh: { value: 55, unit: 'cm' },
        calf: { value: 38, unit: 'cm' }
      }
    },
    'Hoàng Văn E': {
      name: 'Hoàng Văn E',
      birthYear: 1998,
      specialization: 'Zumba, Yoga, Flexibility',
      phone: '+84 912 345 681',
      email: 'hoang.vane@gym.com',
      awards: [
        { icon: '🏆', title: 'Best Group Class Instructor', org: 'ActiveGym 2024' },
        { icon: '⭐', title: 'Highest Client Satisfaction', org: 'Vietnam Fitness 2023' }
      ],
      experience: [
        { position: 'Group Fitness Instructor — ActiveGym Hà Nội', duration: '2021 – nay · 4 năm' },
        { position: 'Yoga Instructor — Zen Fitness', duration: '2019 – 2021 · 2 năm' },
        { position: 'Chứng chỉ Yoga Alliance, Zumba License', duration: '2019' }
      ],
      measurements: {
        height: { value: 172, unit: 'cm' },
        weight: { value: 70, unit: 'kg' },
        chest: { value: 96, unit: 'cm' },
        arm: { value: 32, unit: 'cm' },
        waist: { value: 75, unit: 'cm' },
        forearm: { value: 28, unit: 'cm' },
        thigh: { value: 56, unit: 'cm' },
        calf: { value: 40, unit: 'cm' }
      }
    },
    'Trần Văn C': {
      name: 'Trần Văn C',
      birthYear: 1990,
      specialization: 'Pilates, Flexibility, Rehabilitation',
      phone: '+84 912 345 682',
      email: 'tran.vanc@gym.com',
      awards: [
        { icon: '🥇', title: 'Master Instructor Award', org: 'Pilates Association 2023' },
        { icon: '🏆', title: 'Client Recovery Excellence', org: 'ActiveGym 2024' }
      ],
      experience: [
        { position: 'Pilates Master Instructor — ActiveGym Hà Nội', duration: '2018 – nay · 7 năm' },
        { position: 'Rehabilitation Specialist — Health Clinic', duration: '2015 – 2018 · 3 năm' },
        { position: 'Chứng chỉ Pilates Reformer, FMS Level 3, PTA', duration: '2015' }
      ],
      measurements: {
        height: { value: 175, unit: 'cm' },
        weight: { value: 75, unit: 'kg' },
        chest: { value: 100, unit: 'cm' },
        arm: { value: 36, unit: 'cm' },
        waist: { value: 77, unit: 'cm' },
        forearm: { value: 30, unit: 'cm' },
        thigh: { value: 58, unit: 'cm' },
        calf: { value: 41, unit: 'cm' }
      }
    }
  };

  const freeScheduleData = [
    { day: 'Thứ 2', slots: ['08:00-09:30', '14:00-15:30'] },
    { day: 'Thứ 3', slots: ['06:30-08:00', '17:00-18:30'] },
    { day: 'Thứ 4', slots: ['07:00-08:30', '18:00-19:30'] },
    { day: 'Thứ 5', slots: ['09:00-10:30', '15:00-16:30'] },
    { day: 'Thứ 6', slots: ['07:30-09:00', '13:00-14:30'] },
    { day: 'Thứ 7', slots: ['06:00-07:30', '10:00-11:30'] },
    { day: 'Chủ nhật', slots: ['09:00-10:30', '16:00-17:30'] }
  ];

  const dateKey = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const buildCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const first = new Date(year, month, 1).getDay();
    const offset = first === 0 ? 6 : first - 1;
    const dim = new Date(year, month + 1, 0).getDate();
    const prev = new Date(year, month, 0).getDate();

    const days = [];
    for (let i = offset - 1; i >= 0; i--) {
      days.push({ day: prev - i, isCurrentMonth: false });
    }
    for (let d = 1; d <= dim; d++) {
      days.push({ day: d, isCurrentMonth: true });
    }
    let nx = 1;
    const tot = offset + dim;
    const rem = tot % 7 === 0 ? 0 : 7 - (tot % 7);
    for (let i = 0; i < rem; i++) {
      days.push({ day: nx++, isCurrentMonth: false });
    }

    return days;
  };

  const calendarDays = buildCalendar();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const selectDay = (d) => {
    const key = dateKey(year, month, d);
    setSelectedDate(key);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const dayNames = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const monthName = currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
  const selectedWorkouts = selectedDate ? availableBookings[selectedDate] || [] : [];
  const selectedDateObject = selectedDate ? new Date(`${selectedDate}T00:00:00`) : null;
  const requestDates = Object.keys(memberRequests).sort();

  const resetFormData = () => {
    setFormData({
      trainingProgram: '',
      sessionCount: '',
      fullName: '',
      phoneNumber: '',
      email: '',
      address: '',
      notes: ''
    });
  };

  const getStatusBadgeClass = (status) => {
    if (status === 'Duyệt' || status === 'Đã xác nhận' || status === 'Completed') {
      return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300';
    }
    if (status === 'Đang chờ') {
      return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300';
    }
    if (status === 'Từ chối') {
      return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300';
    }
    return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
  };

  const getAccentColor = (item) => {
    if (item.status === 'Duyệt' || item.status === 'Đã xác nhận' || item.status === 'Completed') return '#16A34A';
    if (item.status === 'Đang chờ') return '#EAB308';
    return '#EF4444';
  };

  const closeBookingForm = () => {
    setBookingForm(null);
    resetFormData();
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();

    if (!formData.trainingProgram || !formData.sessionCount) {
      alert('Vui lòng chọn giáo trình và số buổi!');
      return;
    }

    const requestDate = bookingForm.requestDate || selectedDate;
    const nextRequest = {
      time: bookingForm.time,
      startTime: bookingForm.startTime,
      endTime: bookingForm.endTime,
      name: bookingForm.name,
      type: bookingForm.type,
      location: bookingForm.location,
      trainer: bookingForm.trainer,
      status: 'Đang chờ',
      submittedAt: new Date().toISOString().slice(0, 10),
      requestDetails: {
        ...formData,
        curriculum: formData.trainingProgram
      }
    };

    setMemberRequests((prev) => ({
      ...prev,
      [requestDate]: [...(prev[requestDate] || []), nextRequest]
    }));

    alert('Yêu cầu đặt lịch của bạn đã được gửi thành công!');
    setActiveTab('myRequests');
    setBookingForm(null);
    resetFormData();
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full pb-20">
      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Đặt buổi tập</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Chọn lịch và tìm huấn luyện viên phù hợp</p>
      </div>

      {/* Tab Bar */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl mb-6">
        <div className="flex gap-2 p-4 border-b border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setActiveTab('request')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              activeTab === 'request'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Đặt yêu cầu
          </button>
          <button
            onClick={() => setActiveTab('myRequests')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              activeTab === 'myRequests'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Yêu cầu của tôi
          </button>
        </div>
      </div>

      {/* Request Tab Content */}
      {activeTab === 'request' && (
        <div>
          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Chọn lịch và thời gian bạn mong muốn về việc tập luyện
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Điền thông tin và chọn lịch trống để tìm trainer phù hợp
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Side: Form */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Thông tin yêu cầu</h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200 block mb-2">
                      Giáo trình muốn tập *
                    </label>
                    <select
                      value={formData.trainingProgram}
                      onChange={(e) => setFormData({ ...formData, trainingProgram: e.target.value })}
                      className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white"
                    >
                      <option value="">Chọn giáo trình</option>
                      {trainingPrograms.map((prog) => (
                        <option key={prog} value={prog}>
                          {prog}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200 block mb-2">
                      Thời gian muốn tập (số buổi) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={formData.sessionCount}
                      onChange={(e) => setFormData({ ...formData, sessionCount: e.target.value })}
                      placeholder="Nhập số buổi..."
                      className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Side: Calendar */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-6">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Lịch hỗ trợ luyện tập</h3>

                <div className="mb-4">
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
                      <div
                        key={day}
                        className="text-xs font-bold text-gray-400 dark:text-gray-500 text-center py-2"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((dayObj, idx) => {
                      const key = dayObj.isCurrentMonth ? dateKey(year, month, dayObj.day) : null;
                      const evs = key ? availableBookings[key] || [] : [];
                      const isSelected = selectedDate === key;

                      return (
                        <div
                          key={idx}
                          onClick={() => dayObj.isCurrentMonth && selectDay(dayObj.day)}
                          className={`h-12 flex flex-col items-center justify-center rounded text-xs cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-blue-600 text-white font-bold'
                              : dayObj.isCurrentMonth
                              ? 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        >
                          <span className="text-sm font-semibold">{dayObj.day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Available Time Slots */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-3">Các ngày rảnh:</h4>
                  <div className="space-y-2">
                    {freeScheduleData.map((row, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white min-w-16">{row.day}</div>
                        <div className="flex flex-wrap gap-2 flex-1">
                          {row.slots.length === 0 ? (
                            <span className="text-sm text-gray-400 italic">Không có ca rảnh</span>
                          ) : (
                            row.slots.map((slot, slotIdx) => (
                              <span
                                key={`${idx}-${slotIdx}`}
                                className="px-2.5 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700"
                              >
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

              {/* Find Button */}
              <button
                onClick={() => {
                  if (!formData.trainingProgram || !formData.sessionCount) {
                    alert('Vui lòng chọn giáo trình và số buổi!');
                    return;
                  }
                  // Scroll to trainers section
                  document.getElementById('trainers-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tìm trainer phù hợp
              </button>
            </div>
          </div>

          {/* Trainers Section */}
          <div id="trainers-section" className="mt-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Trainer phù hợp</h2>
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
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {trainerInfo[trainerName].specialization}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {trainerInfo[trainerName].experience[0].position}
                  </p>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                    Xem chi tiết
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* My Requests Tab Content */}
      {activeTab === 'myRequests' && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Yêu cầu của tôi</h2>

          {requestDates.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-3xl mx-auto mb-4">
                📋
              </div>
              <p className="text-gray-500 dark:text-gray-400">Chưa có yêu cầu nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requestDates.map((date) =>
                memberRequests[date].map((request, idx) => (
                  <div
                    key={`${date}-${idx}`}
                    onClick={() => setSelectedWorkout(request)}
                    className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all hover:border-blue-400 dark:hover:border-blue-600"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{request.name}</h3>
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${getStatusBadgeClass(
                              request.status
                            )}`}
                          >
                            {request.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {request.startTime} - {request.endTime} • {request.location}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PT {request.trainer} • Gửi ngày {request.submittedAt}
                        </p>
                      </div>
                      <div className="text-right">
                        <div
                          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                          style={{ backgroundColor: getAccentColor(request) }}
                        />
                        {request.status === 'Từ chối' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDeniedRequest(request);
                            }}
                            className="text-xs font-semibold px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          >
                            Xem lý do
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Thông tin huấn luyện viên</h2>
              <button
                onClick={() => setSelectedTrainer(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
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
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Năm sinh: {trainerInfo[selectedTrainer].birthYear}</div>
                    <span className="inline-block mt-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">
                      TRAINER
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Thông tin cơ bản</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Họ và tên</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{trainerInfo[selectedTrainer].name}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Năm sinh</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{trainerInfo[selectedTrainer].birthYear}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Số điện thoại</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{trainerInfo[selectedTrainer].phone}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Email</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{trainerInfo[selectedTrainer].email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Chuyên môn</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{trainerInfo[selectedTrainer].specialization}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Giải thưởng</h3>
                  <div className="space-y-3">
                    {trainerInfo[selectedTrainer].awards.map((award, idx) => (
                      <div key={idx} className="flex gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-sm flex-shrink-0">
                          {award.icon}
                        </div>
                        <div>
                          <div className="text-sm text-gray-900 dark:text-white">{award.title}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{award.org}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Kinh nghiệm</h3>
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
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Số đo thể hình</h3>
                <div className="grid grid-cols-4 gap-3">
                  {Object.entries(trainerInfo[selectedTrainer].measurements).map(([key, val]) => {
                    const labels = {
                      height: 'Chiều cao',
                      weight: 'Cân nặng',
                      chest: 'Ngực',
                      arm: 'Bắp tay',
                      waist: 'Bụng',
                      forearm: 'Cẳng tay',
                      thigh: 'Đùi',
                      calf: 'Bắp chuối'
                    };
                    return (
                      <div key={key} className="bg-white dark:bg-gray-800/50 rounded-lg p-3">
                        <div className="text-xs text-gray-600 dark:text-gray-400">{labels[key]}</div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                          {val.value} <span className="text-xs text-gray-600 dark:text-gray-400">{val.unit}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => setSelectedTrainer(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    setBookingForm({
                      name: 'Buổi tập',
                      type: formData.trainingProgram,
                      trainer: selectedTrainer,
                      requestDate: selectedDate,
                      startTime: '10:00',
                      endTime: '11:00',
                      time: '10:00',
                      location: 'Phòng tập',
                      isBookable: true
                    });
                    setSelectedTrainer(null);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Yêu cầu
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Yêu cầu đặt lịch</h2>
              <button
                onClick={closeBookingForm}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                <div className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-2">Trainer: {bookingForm.trainer}</div>
                <div className="text-xs text-blue-800 dark:text-blue-400">
                  <div>Giáo trình: {formData.trainingProgram}</div>
                  <div>Số buổi: {formData.sessionCount}</div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Họ và tên *</label>
                <input
                  type="text"
                  placeholder="Nhập họ và tên..."
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Số điện thoại *</label>
                <input
                  type="tel"
                  placeholder="Nhập số điện thoại..."
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  required
                  className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
                <input
                  type="email"
                  placeholder="Nhập email..."
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Địa chỉ</label>
                <input
                  type="text"
                  placeholder="Nhập địa chỉ..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Ghi chú thêm</label>
                <textarea
                  placeholder="Nhập thông tin hoặc nhu cầu thêm..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={closeBookingForm}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Gửi yêu cầu
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Chi tiết yêu cầu</h2>
              <button
                onClick={() => setSelectedWorkout(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">Tên yêu cầu</div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedWorkout.name}</p>
              </div>

              <div>
                <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">Trạng thái</div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded whitespace-nowrap inline-block ${getStatusBadgeClass(
                    selectedWorkout.status
                  )}`}
                >
                  {selectedWorkout.status}
                </span>
              </div>

              <div>
                <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">Ngày gửi</div>
                <p className="text-sm text-gray-900 dark:text-white">{selectedWorkout.submittedAt}</p>
              </div>

              <div>
                <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">Trainer</div>
                <p className="text-sm text-gray-900 dark:text-white">{selectedWorkout.trainer}</p>
              </div>
            </div>

            <div className="flex gap-3 border-t border-gray-200 dark:border-gray-800 p-6">
              <button
                onClick={() => setSelectedWorkout(null)}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Đóng
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
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Chi tiết từ chối</h2>
              <button
                onClick={() => setSelectedDeniedRequest(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">Yêu cầu</div>
                <p className="text-base font-bold text-gray-900 dark:text-white">{selectedDeniedRequest.name}</p>
              </div>

              <div>
                <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">Lý do từ chối</div>
                <p className="text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg">
                  {selectedDeniedRequest.denyReason}
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => setSelectedDeniedRequest(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Đóng
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
