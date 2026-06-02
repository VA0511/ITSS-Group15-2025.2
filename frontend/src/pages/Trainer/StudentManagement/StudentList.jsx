import React, { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Common/Table';
import { useTrainingBookings } from '@/hooks/queries/useTraining';
import { useMembers } from '@/hooks/queries/useMembers';
import { slideUpVariants, sectionStaggerVariants, modalOverlayVariants, modalContentVariants } from '@/lib/animations';

const STATUS_BOOKING_CLS = {
  Accepted: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Pending:  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const STATUS_MEMBER_CLS = {
  active:   'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  inactive: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(`${dateStr.slice(0, 10)}T00:00:00`).toLocaleDateString('vi-VN');
};

const StudentList = () => {
  const { t } = useTranslation('trainer');
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const { data: bookingsRaw, isLoading: loadingBookings } = useTrainingBookings();
  const bookings = Array.isArray(bookingsRaw) ? bookingsRaw : [];
  const { data: membersResponse, isLoading: loadingMembers } = useMembers(1, 100);
  const members = membersResponse?.data || (Array.isArray(membersResponse) ? membersResponse : []);

  const getMemberName = (member, memberId) =>
    member?.full_name || member?.name || t('students.member_fallback', { id: memberId });

  const memberMap = useMemo(() => {
    const map = {};
    members.forEach((m) => { map[m.id] = m; });
    return map;
  }, [members]);

  const bookingsByMember = useMemo(() => {
    const map = {};
    for (const b of bookings) {
      if (!map[b.member_id]) map[b.member_id] = [];
      map[b.member_id].push(b);
    }
    return map;
  }, [bookings]);

  // Only show members who have at least 1 Accepted booking (PT actually taught them)
  const students = useMemo(() => {
    const result = [];
    for (const [memberIdStr, memberBookings] of Object.entries(bookingsByMember)) {
      const memberId = parseInt(memberIdStr);
      const acceptedBookings = memberBookings.filter((b) => b.status === 'Accepted');
      if (acceptedBookings.length === 0) continue;

      const firstAccepted = [...acceptedBookings].sort(
        (a, b) => new Date(a.requested_start) - new Date(b.requested_start),
      )[0];
      const member = memberMap[memberId];
      const roadmapGoal = member?.roadmap_goal || '';

      result.push({ memberId, member, firstSessionDate: firstAccepted.requested_start, roadmapGoal });
    }
    return result.sort((a, b) => new Date(a.firstSessionDate) - new Date(b.firstSessionDate));
  }, [bookingsByMember, memberMap]);

  const selectedStudentBookings = useMemo(() => {
    if (selectedStudentId == null) return [];
    return [...(bookingsByMember[selectedStudentId] || [])].sort(
      (a, b) => new Date(a.requested_start) - new Date(b.requested_start),
    );
  }, [selectedStudentId, bookingsByMember]);

  const selectedMember = selectedStudentId != null ? memberMap[selectedStudentId] : null;
  const isLoading = loadingBookings || loadingMembers;

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <motion.div
        className="space-y-6"
        variants={sectionStaggerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={slideUpVariants}>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{t('students.title')}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('students.subtitle')}</p>
        </motion.div>

        <motion.div variants={slideUpVariants}>
        {isLoading ? (
          <div className="py-20 text-center text-sm text-gray-500 dark:text-gray-400">{t('students.loading')}</div>
        ) : students.length === 0 ? (
          <div className="py-20 text-center text-sm text-gray-500 dark:text-gray-400">{t('students.no_data')}</div>
        ) : (
          <div className="rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-950 dark:ring-gray-800">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('students.table.name')}</TableHead>
                  <TableHead>{t('students.table.goal')}</TableHead>
                  <TableHead>{t('students.table.package')}</TableHead>
                  <TableHead>{t('students.table.expiry')}</TableHead>
                  <TableHead>{t('students.table.start_date')}</TableHead>
                  <TableHead>{t('students.table.membership')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map(({ memberId, member, firstSessionDate, roadmapGoal }) => {
                  const memberStatusCls = STATUS_MEMBER_CLS[member?.status] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300';
                  return (
                  <TableRow
                    key={memberId}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                    onClick={() => setSelectedStudentId(memberId)}
                  >
                    <TableCell className="font-semibold text-gray-900 dark:text-gray-100">
                      <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {getMemberName(member, memberId)}
                      </span>
                      <div className="text-xs text-gray-500 font-normal">{member?.phone ?? '—'}</div>
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300 max-w-[180px]">
                      <span className="line-clamp-2">{roadmapGoal || '—'}</span>
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {member?.package || '—'}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {formatDate(member?.expiryDate)}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {formatDate(firstSessionDate)}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${memberStatusCls}`}>
                        {t(`students.status.${member?.status}`, { defaultValue: member?.status || '—' })}
                      </span>
                    </TableCell>
                  </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
        </motion.div>
      </motion.div>

      <AnimatePresence>
      {selectedStudentId != null && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          variants={modalOverlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={() => setSelectedStudentId(null)}
        >
          <motion.div
            className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            variants={modalContentVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-950">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {getMemberName(selectedMember, selectedStudentId)}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t('students.modal.all_bookings')}</p>
              </div>
              <button
                onClick={() => setSelectedStudentId(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-4">
              {selectedStudentBookings.length === 0 ? (
                <div className="py-10 text-center text-sm text-gray-400 dark:text-gray-500">{t('students.modal.no_data')}</div>
              ) : (
                <div className="rounded-xl overflow-hidden ring-1 ring-gray-200 dark:ring-gray-800">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('students.modal.table.name')}</TableHead>
                        <TableHead>{t('students.modal.table.curriculum')}</TableHead>
                        <TableHead>{t('students.modal.table.date')}</TableHead>
                        <TableHead>{t('students.modal.table.status')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedStudentBookings.map((booking) => {
                        const statusCls = STATUS_BOOKING_CLS[booking.status] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300';
                        return (
                          <TableRow key={booking.id}>
                            <TableCell className="font-semibold text-gray-900 dark:text-gray-100">
                              {getMemberName(selectedMember, booking.member_id)}
                              <div className="text-xs text-gray-500 font-normal">{selectedMember?.phone ?? '—'}</div>
                            </TableCell>
                            <TableCell className="text-gray-700 dark:text-gray-300">
                              {booking.training_plan_note || '—'}
                            </TableCell>
                            <TableCell className="text-gray-600 dark:text-gray-400">
                              {formatDate(booking.requested_start)}
                            </TableCell>
                            <TableCell>
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusCls}`}>
                                {t(`students.booking_status.${booking.status}`, { defaultValue: booking.status })}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <button
                onClick={() => setSelectedStudentId(null)}
                className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('students.modal.close')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default StudentList;
