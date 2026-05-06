import React, { useState } from 'react';
import { Search, Star, CheckCircle, Clock } from 'lucide-react';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import Badge from '@/components/Common/Badge';
import Modal from '@/components/Common/Modal';
import { useFeedbacks } from '@/hooks/queries/useFeedbacks';
import { useUpdateFeedbackStatus } from '@/hooks/mutations/useFeedbackMutations';

const statusConfig = {
    pending: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
    resolved: { label: 'Đã xử lý', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' }
};

const normalizeStatus = (status) => (status || '').toString().trim().toLowerCase();

const FeedbacksView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showProcessModal, setShowProcessModal] = useState(false);
    const [processingNote, setProcessingNote] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const { mutate: updateFeedback } = useUpdateFeedbackStatus();
    const { data: response, isLoading } = useFeedbacks(1, 10);

    const feedbacks = response?.data || [];

    // Filter feedbacks by member name and selected status for the lower list only
    const filteredFeedbacks = feedbacks.filter(fb => {
        const matchSearch = (fb.member_name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === 'all' || normalizeStatus(fb.status) === statusFilter;
        return matchSearch && matchStatus;
    });

    const handleViewDetail = (feedback) => {
        setSelectedFeedback(feedback);
        setShowDetailModal(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const getStatusStats = () => {
        return {
            total: feedbacks.length,
            pending: feedbacks.filter(f => normalizeStatus(f.status) === 'pending').length,
            resolved: feedbacks.filter(f => normalizeStatus(f.status) === 'resolved').length
        };
    };

    const renderStars = (rating) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                    <Star
                        key={star}
                        size={16}
                        className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                ))}
            </div>
        );
    };

    const stats = getStatusStats();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Phản Hồi Của Hội Viên</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Quản lý các phản hồi và đánh giá từ hội viên
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tổng phản hồi</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Chưa xử lý</p>
                    <p className="mt-1 text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
                </div>
                <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Đã xử lý</p>
                    <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">{stats.resolved}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <Input
                                type="text"
                                placeholder="Tìm theo tên hội viên hoặc nội dung..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="pending">Chưa xử lý</option>
                        <option value="resolved">Đã xử lý</option>
                    </select>
                </div>

                <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                    Hiển thị <span className="font-medium">{filteredFeedbacks.length}</span> phản hồi {isLoading && '(Đang tải...)'}
                </div>
            </div>

            {/* Feedbacks List */}
            <div className="space-y-3">
                {isLoading ? (
                    <div className="rounded-xl border border-gray-100 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-950">
                        <p className="text-gray-500 dark:text-gray-400">Đang tải dữ liệu...</p>
                    </div>
                ) : filteredFeedbacks.length === 0 ? (
                    <div className="rounded-xl border border-gray-100 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-950">
                        <p className="text-gray-500 dark:text-gray-400">Không có phản hồi nào</p>
                    </div>
                ) : (
                    filteredFeedbacks.map((feedback) => (
                        <div
                            key={feedback.id}
                            onClick={() => handleViewDetail(feedback)}
                            className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md hover:border-gray-200 transition-all dark:border-gray-800 dark:bg-gray-950 dark:hover:border-gray-700 cursor-pointer"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="mb-2 flex flex-wrap items-center gap-2">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{feedback.member_name}</h3>
                                        <div>{renderStars(feedback.rating)}</div>
                                        <Badge className={statusConfig[normalizeStatus(feedback.status)]?.color || 'bg-gray-100'}>
                                            {statusConfig[normalizeStatus(feedback.status)]?.label || feedback.status}
                                        </Badge>
                                    </div>

                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{feedback.content}</p>

                                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                        <span>{formatDate(feedback.sent_at)}</span>
                                        {feedback.resolution_note && <span>Ghi chú: {feedback.resolution_note.substring(0, 50)}...</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedFeedback && (
                <Modal
                    isOpen={showDetailModal}
                    onClose={() => setShowDetailModal(false)}
                    title="Chi tiết phản hồi"
                >
                    <div className="space-y-4">
                        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{selectedFeedback.member_name}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{selectedFeedback.content}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Hội viên</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedFeedback.member_name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Đánh giá</p>
                                <div>{renderStars(selectedFeedback.rating)}</div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Ngày gửi</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatDate(selectedFeedback.sent_at)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Trạng thái</p>
                                <Badge className={statusConfig[normalizeStatus(selectedFeedback.status)]?.color || 'bg-gray-100'}>
                                    {statusConfig[normalizeStatus(selectedFeedback.status)]?.label || selectedFeedback.status}
                                </Badge>
                            </div>
                        </div>

                        {selectedFeedback.resolution_note && (
                            <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Ghi chú xử lý</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedFeedback.resolution_note}</p>
                            </div>
                        )}

                        <div className="flex justify-end gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
                            {normalizeStatus(selectedFeedback.status) === 'pending' && (
                                <Button onClick={() => setShowProcessModal(true)}>Xử lý</Button>
                            )}
                            <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                                Đóng
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Process Modal */}
            {showProcessModal && selectedFeedback && (
                <Modal
                    isOpen={showProcessModal}
                    onClose={() => {
                        setShowProcessModal(false);
                        setProcessingNote('');
                    }}
                    title="Xử lý phản hồi"
                >
                    <div className="space-y-4">
                        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{selectedFeedback.member_name}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{selectedFeedback.content}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                Ghi chú xử lý
                            </label>
                            <textarea
                                value={processingNote}
                                onChange={(e) => setProcessingNote(e.target.value)}
                                placeholder="Nhập ghi chú về cách xử lý phản hồi này..."
                                rows="4"
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 focus:border-blue-500 focus:outline-none dark:focus:border-blue-500"
                            />
                        </div>

                        <div className="flex justify-end gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowProcessModal(false);
                                    setProcessingNote('');
                                }}
                                disabled={isProcessing}
                            >
                                Hủy
                            </Button>
                            <Button
                                onClick={() => {
                                    if (!processingNote.trim()) {
                                        alert('Vui lòng nhập ghi chú xử lý');
                                        return;
                                    }
                                    setIsProcessing(true);
                                    updateFeedback(
                                        { id: selectedFeedback.id, status: 'Resolved', responseText: processingNote },
                                        {
                                            onSuccess: () => {
                                                setShowProcessModal(false);
                                                setShowDetailModal(false);
                                                setProcessingNote('');
                                                setIsProcessing(false);
                                                setSelectedFeedback(null);
                                            },
                                            onError: () => {
                                                setIsProcessing(false);
                                            }
                                        }
                                    );
                                }}
                                disabled={isProcessing}
                            >
                                {isProcessing ? 'Đang xử lý...' : 'Gửi'}
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default FeedbacksView;
