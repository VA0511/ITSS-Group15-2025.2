import React, { useMemo, useState, useEffect } from 'react';
import { Search, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import Badge from '@/components/Common/Badge';
import Modal from '@/components/Common/Modal';
import { useTransactions } from '@/hooks/queries/useTransactions';
import { slideUpVariants, cardVariants, staggerContainerVariants, sectionStaggerVariants } from '@/lib/animations';

import { useTranslation } from 'react-i18next';

const getTransactionTypeConfig = (t) => ({
    registration: { label: t('transactions.type_registration'), color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
    renewal: { label: t('transactions.type_renewal'), color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    unknown: { label: t('transactions.type_unknown'), color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' }
});

const getStatusConfig = (t) => ({
    completed: { label: t('transactions.status_completed'), color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    pending: { label: t('transactions.status_pending'), color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
    failed: { label: t('transactions.status_failed'), color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
    unknown: { label: t('transactions.type_unknown'), color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' }
});

const normalizeStatus = (status) => {
    const value = String(status || '').trim().toLowerCase();

    if (['paid', 'completed', 'complete', 'success', 'successful'].includes(value)) return 'completed';
    if (['pending', 'waiting', 'processing'].includes(value)) return 'pending';
    if (['cancelled', 'canceled', 'failed', 'fail', 'rejected'].includes(value)) return 'failed';

    return 'unknown';
};

const normalizeType = (type) => {
    const value = String(type || '').trim().toLowerCase();
    return ['registration', 'renewal'].includes(value) ? value : 'unknown';
};

const formatAmount = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount || 0));
};

const formatDate = (date) => {
    if (!date) return 'N/A';

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return 'N/A';

    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(parsedDate);
};

const TransactionsView = () => {
    const { t } = useTranslation('manager');
    const transactionTypeConfig = getTransactionTypeConfig(t);
    const statusConfig = getStatusConfig(t);

    const normalizeTransaction = (transaction) => {
        const normalizedStatus = normalizeStatus(transaction.status);
        const normalizedType = normalizeType(transaction.type);

        return {
            ...transaction,
            amount: Number(transaction.amount || 0),
            customerName: transaction.customerName || 'N/A',
            phone: transaction.phone || 'N/A',
            package: transaction.package || t('transactions.no_package'),
            paymentMethod: transaction.paymentMethod || 'N/A',
            notes: transaction.notes || t('transactions.no_note'),
            rawStatus: transaction.status || '',
            rawType: transaction.type || '',
            status: normalizedStatus,
            type: normalizedType,
            date: transaction.date || null,
        };
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [page, setPage] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        setPage(1);
    }, [searchTerm, typeFilter, statusFilter]);

    const { data: apiTransactions = [], isLoading, isError, error } = useTransactions();

    const transactions = useMemo(() => {
        const list = Array.isArray(apiTransactions?.data)
            ? apiTransactions.data
            : Array.isArray(apiTransactions)
                ? apiTransactions
                : [];

        return list.map(normalizeTransaction);
    }, [apiTransactions, t]);


    const filteredTransactions = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();

        return transactions.filter((txn) => {
            const matchSearch = !keyword
                || txn.customerName.toLowerCase().includes(keyword)
                || String(txn.phone).toLowerCase().includes(keyword)
                || String(txn.id).includes(keyword)
                || txn.package.toLowerCase().includes(keyword);

            const matchType = typeFilter === 'all' || txn.type === typeFilter;
            const matchStatus = statusFilter === 'all' || txn.status === statusFilter;

            return matchSearch && matchType && matchStatus;
        });
    }, [transactions, searchTerm, typeFilter, statusFilter]);

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const paginatedTransactions = useMemo(() => {
        const start = (page - 1) * itemsPerPage;
        return filteredTransactions.slice(start, start + itemsPerPage);
    }, [filteredTransactions, page]);

    const stats = useMemo(() => {
        const completedTransactions = transactions.filter((txn) => txn.status === 'completed');

        return {
            total: transactions.length,
            completed: completedTransactions.length,
            revenue: completedTransactions.reduce((sum, txn) => sum + txn.amount, 0),
        };
    }, [transactions]);

    const handleViewDetail = (transaction) => {
        setSelectedTransaction(transaction);
        setShowDetailModal(true);
    };

    const resolveTypeConfig = (type) => transactionTypeConfig[type] || transactionTypeConfig.unknown;
    const resolveStatusConfig = (status) => statusConfig[status] || statusConfig.unknown;

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{t('transactions.title')}</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('transactions.subtitle')}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <p className="text-gray-500 dark:text-gray-400">{t('transactions.loading')}</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{t('transactions.title')}</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('transactions.subtitle')}</p>
                </div>
                <div className="rounded-xl border border-red-100 bg-red-50 p-6 dark:border-red-900 dark:bg-red-900/20">
                    <p className="font-medium text-red-700 dark:text-red-300">{t('transactions.error')}</p>
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error?.message || t('transactions.error_hint')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <motion.div variants={slideUpVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{t('transactions.title')}</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('transactions.subtitle')}</p>
                </div>
            </motion.div>

            <motion.div variants={staggerContainerVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                    { label: t('transactions.total_transactions'), value: stats.total, color: 'text-gray-900 dark:text-white' },
                    { label: t('transactions.status_completed'), value: stats.completed, color: 'text-green-600 dark:text-green-400' },
                    { label: t('transactions.total_revenue'), value: formatAmount(stats.revenue), color: 'text-blue-600 dark:text-blue-400' },
                ].map(({ label, value, color }, i) => (
                    <motion.div key={label} variants={cardVariants} custom={i} whileHover={{ scale: 1.03, y: -2 }} className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                        <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div variants={slideUpVariants} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <Input
                                type="text"
                                placeholder={t('transactions.search_placeholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                    >
                        <option value="all">{t('transactions.filter_all_types')}</option>
                        <option value="registration">{t('transactions.filter_registration')}</option>
                        <option value="renewal">{t('transactions.filter_renewal')}</option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                    >
                        <option value="all">{t('transactions.filter_all_status')}</option>
                        <option value="completed">{t('transactions.filter_completed')}</option>
                        <option value="pending">{t('transactions.filter_pending')}</option>
                        <option value="failed">{t('transactions.filter_failed')}</option>
                    </select>
                </div>

                <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                    {t('transactions.showing')} <span className="font-medium">{filteredTransactions.length}</span> {t('transactions.in')} <span className="font-medium">{transactions.length}</span> {t('dashboard.transactions')}
                </div>
            </motion.div>

            <motion.div variants={slideUpVariants} className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <table className="w-full">
                    <thead className="border-b border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">{t('transactions.id')}</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">{t('transactions.customer')}</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">{t('transactions.type')}</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">{t('transactions.package')}</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">{t('transactions.amount')}</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">{t('transactions.date')}</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">{t('transactions.status')}</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">{t('transactions.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {filteredTransactions.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                    Không tìm thấy giao dịch nào
                                </td>
                            </tr>
                        ) : (
                            paginatedTransactions.map((txn) => {
                                const typeConfig = resolveTypeConfig(txn.type);
                                const currentStatusConfig = resolveStatusConfig(txn.status);

                                return (
                                    <tr key={txn.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">#{txn.id}</td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{txn.customerName}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{txn.phone}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className={typeConfig.color}>{typeConfig.label}</Badge>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{txn.package}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{formatAmount(txn.amount)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{formatDate(txn.date)}</td>
                                        <td className="px-6 py-4">
                                            <Badge className={currentStatusConfig.color}>{currentStatusConfig.label}</Badge>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleViewDetail(txn)}
                                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                <Eye size={16} />
                                                <span className="text-sm">Chi tiết</span>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
                
                {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 dark:border-gray-800">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Hiển thị từ <span className="font-medium">{(page - 1) * itemsPerPage + 1}</span> đến <span className="font-medium">{Math.min(page * itemsPerPage, filteredTransactions.length)}</span> trong tổng số <span className="font-medium">{filteredTransactions.length}</span> giao dịch
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm text-gray-700 dark:text-gray-300 mx-2">
                                Trang {page} / {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </motion.div>

            {showDetailModal && selectedTransaction && (
                <Modal
                    isOpen={showDetailModal}
                    onClose={() => setShowDetailModal(false)}
                    title="Chi tiết giao dịch"
                >
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">ID giao dịch</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">#{selectedTransaction.id}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('transactions.date')}</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatDate(selectedTransaction.date)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('transactions.customer')}</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedTransaction.customerName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Điện thoại</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedTransaction.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Loại giao dịch</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{resolveTypeConfig(selectedTransaction.type).label}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Gói tập</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedTransaction.package}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('transactions.amount')}</p>
                                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{formatAmount(selectedTransaction.amount)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('transactions.payment_method')}</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedTransaction.paymentMethod}</p>
                            </div>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('transactions.note')}</p>
                            <p className="mt-1 text-gray-900 dark:text-white">{selectedTransaction.notes}</p>
                        </div>

                        <div className="flex gap-2">
                            <Badge className={resolveStatusConfig(selectedTransaction.status).color}>
                                {resolveStatusConfig(selectedTransaction.status).label}
                            </Badge>
                        </div>

                        <div className="flex justify-end gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
                            <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                                Đóng
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default TransactionsView;
