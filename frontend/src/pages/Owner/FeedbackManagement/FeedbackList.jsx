import React, { useMemo, useState } from 'react';
import { Star, MessageSquare, ChevronLeft, ChevronRight, Edit } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useFeedbacks } from '@/hooks/queries/useFeedbacks';
import { useUpdateFeedbackStatus } from '@/hooks/mutations/useFeedbackMutations';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Common/Table';
import Input from '@/components/Common/Input';
import Button from '@/components/Common/Button';
import Modal from '@/components/Common/Modal';
import { slideUpVariants, sectionStaggerVariants } from '@/lib/animations';

const FeedbackList = () => {
  const { t } = useTranslation('owner');
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('');
  const limit = 10;

  const { data: feedbackResponse, isLoading, isError } = useFeedbacks(page, limit, statusFilter);
  const updateMutation = useUpdateFeedbackStatus();

  const [editModal, setEditModal] = useState({ isOpen: false, feedback: null });
  const [editStatus, setEditStatus] = useState('Pending');
  const [editResponseText, setEditResponseText] = useState('');

  const handleEditClick = (fb) => {
    setEditModal({ isOpen: true, feedback: fb });
    setEditStatus(fb.status || 'Pending');
    setEditResponseText(fb.resolution_note || fb.response_text || fb.responseText || '');
  };

  const handleSaveEdit = () => {
    if (editModal.feedback) {
      updateMutation.mutate({
        id: editModal.feedback.id,
        status: editStatus,
        responseText: editResponseText
      });
      setEditModal({ isOpen: false, feedback: null });
    }
  };

  // Mock data fallback
  const mockFeedbacks = [
    { id: 1, member_name: 'Nguyễn Văn A', content: 'PT nhiệt tình, chuyên môn cao', rating: 5, sent_at: '2026-03-20', status: 'resolved', feedback_type: 'trainer' },
    { id: 2, member_name: 'Trần Thị B', content: 'Máy chạy số 3 bị kẹt thảm', rating: 2, sent_at: '2026-03-22', status: 'pending', feedback_type: 'equipment' },
    { id: 3, member_name: 'Lê Văn C', content: 'Phòng thay đồ mùi ẩm mốc', rating: 3, sent_at: '2026-03-21', status: 'processing', feedback_type: 'service' },
    { id: 4, member_name: 'Phạm Thị D', content: 'Dịch vụ rất tốt, nhân viên thân thiện', rating: 5, sent_at: '2026-03-18', status: 'resolved', feedback_type: 'service' },
    { id: 5, member_name: 'Hoàng Văn E', content: 'Máy kéo xô bị hỏng cần sửa', rating: 1, sent_at: '2026-03-25', status: 'pending', feedback_type: 'equipment' },
  ];

  // Handle API response
  const feedbacks = useMemo(() => {
    if (!feedbackResponse) return mockFeedbacks;
    if (Array.isArray(feedbackResponse)) return feedbackResponse;
    if (feedbackResponse.data && feedbackResponse.data.length > 0) return feedbackResponse.data;
    if (isError) return mockFeedbacks;
    return mockFeedbacks;
  }, [feedbackResponse, isError]);

  const totalItems = useMemo(() => {
    if (!feedbackResponse) return mockFeedbacks.length;
    if (Array.isArray(feedbackResponse)) return feedbackResponse.length;
    return feedbackResponse.total_items || mockFeedbacks.length;
  }, [feedbackResponse]);

  const totalPages = useMemo(() => {
    if (!feedbackResponse) return 1;
    if (Array.isArray(feedbackResponse)) return 1;
    return feedbackResponse.total_pages || Math.ceil(totalItems / limit) || 1;
  }, [feedbackResponse, totalItems]);

  const filteredFeedbacks = useMemo(() => {
    const query = searchTerm.toLowerCase();
    const now = new Date();
    return feedbacks.filter((fb) => {
      const matchSearch =
        (fb.member_name || fb.memberName || '').toLowerCase().includes(query) ||
        (fb.content || fb.Content || '').toLowerCase().includes(query);
      const matchRating = ratingFilter === 'all' || (fb.rating || fb.Rating || 0).toString() === ratingFilter;
      const matchStatus = !statusFilter || (fb.status || '').toLowerCase() === statusFilter.toLowerCase();
      const feedbackDate = new Date(fb.sent_at || fb.created_at || fb.createdAt || fb.date || '2024-01-01');
      let matchDate = true;

      if (dateFilter === 'last7') {
        const cutoff = new Date(now);
        cutoff.setDate(cutoff.getDate() - 7);
        matchDate = feedbackDate >= cutoff;
      }
      if (dateFilter === 'last30') {
        const cutoff = new Date(now);
        cutoff.setDate(cutoff.getDate() - 30);
        matchDate = feedbackDate >= cutoff;
      }
      if (dateFilter === 'thisMonth') {
        matchDate = feedbackDate.getMonth() === now.getMonth() && feedbackDate.getFullYear() === now.getFullYear();
      }
      if (dateFilter === 'thisYear') {
        matchDate = feedbackDate.getFullYear() === now.getFullYear();
      }

      return matchSearch && matchRating && matchDate && matchStatus;
    });
  }, [feedbacks, searchTerm, ratingFilter, dateFilter, statusFilter]);

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      className="space-y-6"
      variants={sectionStaggerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={slideUpVariants} className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{t('feedback.title')}</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('feedback.subtitle')}</p>
          </div>
          <div className="w-full max-w-sm">
            <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={t('feedback.search_placeholder')} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('feedback.filter.rating')}</label>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-slate-400 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            >
              <option value="all">{t('feedback.rating_options.all')}</option>
              <option value="5">{t('feedback.rating_options.5star')}</option>
              <option value="4">{t('feedback.rating_options.4star')}</option>
              <option value="3">{t('feedback.rating_options.3star')}</option>
              <option value="2">{t('feedback.rating_options.2star')}</option>
              <option value="1">{t('feedback.rating_options.1star')}</option>
            </select>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('feedback.filter.status')}</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-slate-400 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            >
              <option value="">{t('feedback.status_options.all')}</option>
              <option value="Pending">{t('feedback.status_options.pending')}</option>
              <option value="Processing">{t('feedback.status_options.processing')}</option>
              <option value="Resolved">{t('feedback.status_options.resolved')}</option>
            </select>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('feedback.filter.date')}</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-slate-400 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            >
              <option value="all">{t('feedback.date_options.all')}</option>
              <option value="last7">{t('feedback.date_options.7days')}</option>
              <option value="last30">{t('feedback.date_options.30days')}</option>
              <option value="thisMonth">{t('feedback.date_options.this_month')}</option>
              <option value="thisYear">{t('feedback.date_options.this_year')}</option>
            </select>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('feedback.filter.total')}</label>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{totalItems}</p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={slideUpVariants} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">{t('feedback.loading')}</div>
        ) : isError ? (
          <div className="p-8 text-center text-red-500">{t('feedback.load_error')}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('feedback.table.member')}</TableHead>
                <TableHead>{t('feedback.table.type')}</TableHead>
                <TableHead className="w-[35%]">{t('feedback.table.content')}</TableHead>
                <TableHead>{t('feedback.table.status')}</TableHead>
                <TableHead className="text-right">{t('feedback.table.date_action')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFeedbacks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 h-24">
                    {t('feedback.no_data')}
                  </TableCell>
                </TableRow>
              ) : (
                filteredFeedbacks.map((fb) => (
                  <TableRow key={fb.id}>
                    <TableCell className="font-semibold text-gray-900 dark:text-gray-100">
                      {fb.member_name || fb.memberName || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded dark:bg-blue-900/30 dark:text-blue-400 mb-2 inline-block">
                        {fb.feedback_type || fb.feedbackType || fb.type === 'trainer' ? t('feedback.type.trainer') : fb.type === 'equipment' ? t('feedback.type.equipment') : fb.type === 'service' ? t('feedback.type.service') : fb.type || t('feedback.type.other')}
                      </span>
                      {renderStars(fb.rating || fb.Rating || 0)}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 mt-0.5 text-gray-400" />
                        <span className="line-clamp-2 leading-relaxed">{fb.content || fb.Content || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                        fb.status === 'Resolved' || fb.status === 'resolved'
                          ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400'
                          : fb.status === 'Pending' || fb.status === 'pending'
                          ? 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-900/30 dark:text-amber-400'
                          : 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {fb.status === 'Resolved' || fb.status === 'resolved' ? t('feedback.status.resolved') :
                         fb.status === 'Pending' || fb.status === 'pending' ? t('feedback.status.pending') :
                         fb.status === 'Processing' || fb.status === 'processing' ? t('feedback.status.processing') : fb.status || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-sm text-gray-500">
                      <div className="flex items-center justify-end gap-2">
                        <span>
                          {fb.sent_at ? new Date(fb.sent_at).toLocaleDateString('vi-VN') : 
                           fb.created_at || fb.createdAt || fb.date || 'N/A'}
                        </span>
                        <Button variant="ghost" size="icon" title={t('feedback.tooltip.update')} className="h-8 w-8 text-blue-500" onClick={(e) => { e.stopPropagation(); handleEditClick(fb); }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {t('feedback.pagination', { page, total: totalPages, count: totalItems })}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Edit Feedback Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, feedback: null })}
        title={t('feedback.modal.title')}
      >
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{t('feedback.modal.status_label')}</label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            >
              <option value="Pending">{t('feedback.status_options.pending')}</option>
              <option value="Processing">{t('feedback.status_options.processing')}</option>
              <option value="Resolved">{t('feedback.status_options.resolved')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{t('feedback.modal.note_label')}</label>
            <textarea
              value={editResponseText}
              onChange={(e) => setEditResponseText(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              rows={3}
              placeholder={t('feedback.modal.note_placeholder')}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setEditModal({ isOpen: false, feedback: null })}>
              {t('feedback.btn.cancel')}
            </Button>
            <Button onClick={handleSaveEdit} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? t('feedback.btn.saving') : t('feedback.btn.save')}
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default FeedbackList;
