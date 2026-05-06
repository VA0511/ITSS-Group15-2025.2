import { create } from 'zustand';

// ─── helpers ─────────────────────────────────────────────────────────────────

const DAY_TO_DOW = {
  'Thứ 2': 1,
  'Thứ 3': 2,
  'Thứ 4': 3,
  'Thứ 5': 4,
  'Thứ 6': 5,
  'Thứ 7': 6,
  'Chủ nhật': 0,
};

const pad2 = (n) => String(n).padStart(2, '0');

/** Format a Date object to 'YYYY-MM-DD' */
function dateToKey(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

/** Add durationMinutes to a 'HH:MM' string → new 'HH:MM' string */
function addMinutes(timeStr, minutes) {
  const [h, m] = timeStr.split(':').map(Number);
  const total = h * 60 + m + minutes;
  return `${pad2(Math.floor(total / 60) % 24)}:${pad2(total % 60)}`;
}

/** Parse slot string '18:00 – 19:00' → { start: '18:00', end: '19:00' } */
function slotToStartEnd(slot) {
  const parts = slot.replace(/[–—]/g, '-').split('-').map((s) => s.trim());
  return { start: parts[0] || '00:00', end: parts[1] || '01:00' };
}

function timesOverlap(s1, e1, s2, e2) {
  return s1 < e2 && s2 < e1;
}

/**
 * Generate ALL session dates based on the preferred weekly schedule.
 *
 * Algorithm:
 *   1. Sort preferred days chronologically starting from `refDate`.
 *   2. Cycle through those days week by week until `totalSessions` are filled.
 *
 * Returns an array of { dateKey, day, slot, start, end } objects,
 * one entry per training session.
 */
function generateAllSessions(preferredSchedule, totalSessions, sessionDurationMinutes, refDate) {
  const todayDOW = refDate.getDay(); // 0=Sun … 6=Sat

  // Flatten (day, slot) pairs
  const daySlotPairs = [];
  for (const dayObj of preferredSchedule) {
    const dow = DAY_TO_DOW[dayObj.day];
    if (dow === undefined) continue;
    for (const slot of dayObj.slots) {
      daySlotPairs.push({ day: dayObj.day, dow, slot });
    }
  }

  if (daySlotPairs.length === 0) return [];

  // Sort pairs so the next-upcoming day comes first
  daySlotPairs.sort((a, b) => {
    const da = (a.dow - todayDOW + 7) % 7 || 7;
    const db = (b.dow - todayDOW + 7) % 7 || 7;
    return da - db;
  });

  const sessions = [];
  let weekOffset = 0; // 0 = current week, 1 = next week, …

  while (sessions.length < totalSessions) {
    for (const pair of daySlotPairs) {
      if (sessions.length >= totalSessions) break;

      // Days until this DOW from refDate (always forward)
      const baseOffset = (pair.dow - todayDOW + 7) % 7 || 7;
      const totalOffset = baseOffset + weekOffset * 7;

      const date = new Date(refDate);
      date.setDate(refDate.getDate() + totalOffset);

      const { start: slotStart } = slotToStartEnd(pair.slot);
      const start = slotStart;
      const end = addMinutes(start, sessionDurationMinutes);

      sessions.push({
        dateKey: dateToKey(date),
        day: pair.day,
        slot: pair.slot,
        start,
        end,
        sessionNumber: sessions.length + 1,
      });
    }
    weekOffset++;
  }

  return sessions;
}

// ─── initial data ─────────────────────────────────────────────────────────────

const initialStudents = [
  {
    id: 1,
    name: 'Nguyễn Tuấn A',
    phone: '0901xxx',
    goal: 'Giảm mỡ',
    package: 'PT 1:1 - 36 Buổi',
    remaining: 12,
    avatar: 'NA',
    birthDate: '12/05/1998',
    inbody: [
      { date: '2026-01-10', weight: 72, bodyFat: 26, muscle: 30 },
      { date: '2026-02-10', weight: 70, bodyFat: 24, muscle: 31 },
      { date: '2026-03-10', weight: 68, bodyFat: 22, muscle: 32 },
      { date: '2026-04-10', weight: 67, bodyFat: 21, muscle: 32.5 },
    ],
  },
  {
    id: 2,
    name: 'Lê Thị B',
    phone: '0902xxx',
    goal: 'Tăng cơ, độ mông',
    package: 'PT 1:1 - 12 Buổi',
    remaining: 3,
    avatar: 'LB',
    birthDate: '20/08/2000',
    inbody: [
      { date: '2026-02-15', weight: 55, bodyFat: 28, muscle: 22 },
      { date: '2026-03-15', weight: 54, bodyFat: 26, muscle: 23 },
    ],
  },
];

const initialEvents = {
  '2026-04-17': [
    { start: '08:25', end: '10:05', name: 'Buổi tập Skinny fat', curriculum: 'Skinny fat', room: 'Phòng B1', student: 'Nguyễn Tuấn A', studentId: 1, done: false, confirmed: false, absent: false },
    { start: '10:15', end: '11:45', name: 'Buổi tập Strength', curriculum: 'Strength Basic', room: 'Phòng B2', student: 'Trần Thị B', studentId: 2, done: false, confirmed: false, absent: false },
  ],
  '2026-04-14': [
    { start: '07:00', end: '08:30', name: 'Buổi tập Cardio Mix', curriculum: 'Cardio Mix', room: 'Phòng A1', student: 'Lê Văn C', studentId: null, done: true, confirmed: true, absent: false },
  ],
  '2026-04-10': [
    { start: '09:00', end: '10:30', name: 'Buổi tập Core', curriculum: 'Core Training', room: 'Phòng B1', student: 'Phạm Thị D', studentId: null, done: true, confirmed: true, absent: false },
    { start: '14:00', end: '15:30', name: 'Buổi tập Skinny fat', curriculum: 'Skinny fat', room: 'Phòng C2', student: 'Hoàng Văn E', studentId: null, done: true, confirmed: true, absent: false },
  ],
  '2026-04-07': [
    { start: '08:00', end: '09:30', name: 'Buổi tập Strength', curriculum: 'Strength Basic', room: 'Phòng B1', student: 'Nguyễn Tuấn A', studentId: 1, done: true, confirmed: true, absent: false },
  ],
  '2026-04-22': [
    { start: '10:00', end: '11:30', name: 'Buổi tập Skinny fat', curriculum: 'Skinny fat', room: 'Phòng B1', student: 'Nguyễn Tuấn A', studentId: 1, done: false, confirmed: false, absent: false },
  ],
  '2026-04-24': [
    { start: '15:00', end: '16:30', name: 'Buổi tập Cardio', curriculum: 'Cardio Mix', room: 'Phòng A2', student: 'Trần Thị B', studentId: 2, done: false, confirmed: false, absent: false },
  ],
};

/**
 * Trainer's free schedule – shared state so TrainerProfile can read/write it.
 * Slots MUST exactly match preferredSchedule values in training requests.
 */
const initialFreeSchedule = [
  { day: 'Thứ 2', slots: ['06:00 – 07:00', '08:00 – 09:00', '18:00 – 19:00'] },
  { day: 'Thứ 3', slots: ['09:00 – 10:00', '17:00 – 18:00', '19:00 – 20:00'] },
  { day: 'Thứ 4', slots: ['06:00 – 07:00', '08:00 – 09:00', '18:00 – 19:00'] },
  { day: 'Thứ 5', slots: ['18:00 – 19:00', '20:00 – 21:00'] },
  { day: 'Thứ 6', slots: ['06:00 – 07:00', '08:00 – 09:00', '18:00 – 19:00'] },
  { day: 'Thứ 7', slots: ['07:00 – 08:00', '09:00 – 10:00'] },
  { day: 'Chủ nhật', slots: [] },
];

/**
 * Training requests.
 * - totalSessions:       total number of PT sessions in the program
 * - sessionDurationMinutes: length of each individual session (minutes)
 * - preferredSchedule:  which days/slots the client wants (must match freeSchedule)
 */
const initialRequests = [
  {
    id: 1,
    date: '11/04/2026',
    name: 'Nguyễn Tuấn A',
    studentId: 1,
    time: '10:00',
    status: 'pending',
    curriculum: 'Skinny Fat',
    totalSessions: 12,           // 12-session PT program
    sessionDurationMinutes: 60,  // standard 60-minute session
    birthDate: '12/05/1998',
    measurements: { height: '170', weight: '68', bodyFat: '24%', shoulder: '45' },
    notes: 'Có chấn thương vai, dây chằng yếu.',
    preferredSchedule: [
      { day: 'Thứ 2', slots: ['18:00 – 19:00'] },
      { day: 'Thứ 4', slots: ['18:00 – 19:00'] },
      { day: 'Thứ 6', slots: ['18:00 – 19:00'] },
    ],
    rejectionReason: '',
  },
  {
    id: 2,
    date: '11/04/2026',
    name: 'Trần Minh B',
    studentId: null,
    time: '14:30',
    status: 'accepted',
    curriculum: 'Core Training',
    totalSessions: 8,
    sessionDurationMinutes: 60,
    birthDate: '15/03/1997',
    measurements: { height: '175', weight: '72', bodyFat: '20%', shoulder: '48' },
    notes: 'Không có chấn thương.',
    preferredSchedule: [
      { day: 'Thứ 3', slots: ['19:00 – 20:00'] },
      { day: 'Thứ 5', slots: ['18:00 – 19:00'] },
    ],
    rejectionReason: '',
  },
  {
    id: 3,
    date: '10/04/2026',
    name: 'Lê Thị C',
    studentId: null,
    time: '18:20',
    status: 'rejected',
    curriculum: 'Cardio Mix',
    totalSessions: 10,
    sessionDurationMinutes: 60,
    birthDate: '22/07/1999',
    measurements: { height: '162', weight: '55', bodyFat: '25%', shoulder: '40' },
    notes: 'Mong muốn tập giảm cân.',
    preferredSchedule: [
      { day: 'Thứ 2', slots: ['06:00 – 07:00'] },
      { day: 'Thứ 4', slots: ['06:00 – 07:00'] },
      { day: 'Thứ 6', slots: ['06:00 – 07:00'] },
    ],
    rejectionReason: 'Lịch đã kín trong thời gian này.',
  },
];

// Reference "today" used for all schedule calculations (April 17 2026 = demo date)
const DEMO_TODAY = new Date(2026, 3, 17);

// ─── store ────────────────────────────────────────────────────────────────────

const useTrainerStore = create((set, get) => ({
  students: initialStudents,
  scheduleEvents: initialEvents,
  trainingRequests: initialRequests,
  freeSchedule: initialFreeSchedule,

  // ── Add an InBody entry for a student  ────────────────────────────────────
  addInBodyEntry: (studentId, entry) => {
    set((state) => ({
      students: state.students.map((s) =>
        s.id === studentId
          ? { ...s, inbody: [...s.inbody, { date: new Date().toISOString().slice(0, 10), ...entry }] }
          : s
      ),
    }));
  },

  // ── Confirm attendance for a session  ─────────────────────────────────────
  confirmAttendance: (dateKey, idx) => {
    set((state) => {
      const events = JSON.parse(JSON.stringify(state.scheduleEvents));
      if (events[dateKey]?.[idx]) {
        events[dateKey][idx].confirmed = true;
      }
      return { scheduleEvents: events };
    });
  },

  // ── Report absence for a session  ─────────────────────────────────────────
  reportAbsence: (dateKey, idx, reason) => {
    set((state) => {
      const events = JSON.parse(JSON.stringify(state.scheduleEvents));
      if (events[dateKey]?.[idx]) {
        events[dateKey][idx].absent = true;
        events[dateKey][idx].absenceReason = reason;
      }
      return { scheduleEvents: events };
    });
  },

  // ── Add / remove a free schedule slot (for TrainerProfile) ────────────────
  addFreeSlot: (dayIndex, slot) => {
    set((state) => {
      const updated = state.freeSchedule.map((row, i) =>
        i === dayIndex ? { ...row, slots: [...row.slots, slot] } : row
      );
      return { freeSchedule: updated };
    });
  },

  removeFreeSlot: (dayIndex, slotIndex) => {
    set((state) => {
      const updated = state.freeSchedule.map((row, i) =>
        i === dayIndex
          ? { ...row, slots: row.slots.filter((_, si) => si !== slotIndex) }
          : row
      );
      return { freeSchedule: updated };
    });
  },

  // ── Accept a training request  ────────────────────────────────────────────
  // Generates ALL sessions across multiple weeks on the trainer's calendar.
  // Returns { ok: true, totalAdded: N } or { ok: false, conflicts: [...] }
  acceptRequest: (requestId) => {
    const state = get();
    const req = state.trainingRequests.find((r) => r.id === requestId);
    if (!req) return { ok: false, conflicts: [] };

    const totalSessions = req.totalSessions || 10;
    const sessionDurationMinutes = req.sessionDurationMinutes || 60;

    // Generate all session dates
    const allSessions = generateAllSessions(
      req.preferredSchedule,
      totalSessions,
      sessionDurationMinutes,
      DEMO_TODAY
    );

    if (allSessions.length === 0) return { ok: false, conflicts: [] };

    // Check every proposed session against existing schedule
    const conflicts = [];
    const events = state.scheduleEvents;
    for (const s of allSessions) {
      const dayEvents = events[s.dateKey] || [];
      for (const ev of dayEvents) {
        if (timesOverlap(s.start, s.end, ev.start, ev.end)) {
          conflicts.push({
            day: s.day,
            slot: s.slot,
            date: s.dateKey,
            sessionNumber: s.sessionNumber,
            existingStudent: ev.student,
            existingTime: `${ev.start} – ${ev.end}`,
          });
        }
      }
    }

    if (conflicts.length > 0) {
      return { ok: false, conflicts };
    }

    // No conflicts – inject ALL sessions into the calendar
    set((state) => {
      const newEvents = JSON.parse(JSON.stringify(state.scheduleEvents));

      for (const s of allSessions) {
        if (!newEvents[s.dateKey]) newEvents[s.dateKey] = [];
        newEvents[s.dateKey].push({
          start: s.start,
          end: s.end,
          name: `Buổi ${s.sessionNumber}/${totalSessions} – ${req.curriculum}`,
          curriculum: req.curriculum,
          room: 'Phòng TBD',
          student: req.name,
          studentId: req.studentId,
          totalSessions,
          sessionNumber: s.sessionNumber,
          done: false,
          confirmed: false,
          absent: false,
        });
        // Keep events sorted by start time within each day
        newEvents[s.dateKey].sort((a, b) => a.start.localeCompare(b.start));
      }

      // Remove accepted time slots from the free schedule
      let newFreeSchedule = JSON.parse(JSON.stringify(state.freeSchedule));
      for (const dayObj of req.preferredSchedule) {
        for (const slot of dayObj.slots) {
          newFreeSchedule = newFreeSchedule.map((row) =>
            row.day === dayObj.day
              ? { ...row, slots: row.slots.filter((s) => s !== slot) }
              : row
          );
        }
      }

      return {
        scheduleEvents: newEvents,
        freeSchedule: newFreeSchedule,
        trainingRequests: state.trainingRequests.map((r) =>
          r.id === requestId ? { ...r, status: 'accepted' } : r
        ),
      };
    });

    return { ok: true, totalAdded: allSessions.length };
  },

  // ── Reject a training request  ────────────────────────────────────────────
  rejectRequest: (requestId, reason) => {
    set((state) => ({
      trainingRequests: state.trainingRequests.map((r) =>
        r.id === requestId ? { ...r, status: 'rejected', rejectionReason: reason } : r
      ),
    }));
  },
}));

export default useTrainerStore;
