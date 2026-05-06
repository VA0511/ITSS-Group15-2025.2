import React, { useMemo, useState } from 'react';
import { Search, Eye } from 'lucide-react';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import Badge from '@/components/Common/Badge';
import Modal from '@/components/Common/Modal';
import { useTransactions } from '@/hooks/queries/useTransactions';

const transactionTypeConfig = {
    registration: { label: 'Đăng ký mới', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
    renewal: { label: 'Gia hạn', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    unknown: { label: 'Không xác định', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' }
};

const statusConfig = {
    completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
    failed: { label: 'Thất bại', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
    unknown: { label: 'Không xác định', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' }
};

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

const normalizeTransaction = (transaction) => {
    const normalizedStatus = normalizeStatus(transaction.status);
    const normalizedType = normalizeType(transaction.type);

    return {
        ...transaction,
        amount: Number(transaction.amount || 0),
        customerName: transaction.customerName || 'N/A',
        phone: transaction.phone || 'N/A',
        package: transaction.package || 'Chưa có gói',
        paymentMethod: transaction.paymentMethod || 'N/A',
        notes: transaction.notes || 'Không có ghi chú',
        rawStatus: transaction.status || '',
        rawType: transaction.type || '',
        status: normalizedStatus,
        type: normalizedType,
        date: transaction.date || null,
    };
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
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const { data: apiTransactions = [], isLoading, isError, error } = useTransactions();

    const transactions = useMemo(() => {
        const list = Array.isArray(apiTransactions?.data)
            ? apiTransactions.data
            : Array.isArray(apiTransactions)
                ? apiTransactions
                : [];

        return list.map(normalizeTransaction);
    }, [apiTransactions]);

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

    const getTypeConfig = (type) => transactionTypeConfig[type] || transactionTypeConfig.unknown;
    const getStatusConfig = (status) => statusConfig[status] || statusConfig.unknown;

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Quản lý giao dịch</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Danh sách đăng ký mới và gia hạn gói tập</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <p className="text-gray-500 dark:text-gray-400">Đang tải dữ liệu giao dịch...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Quản lý giao dịch</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Danh sách đăng ký mới và gia hạn gói tập</p>
                </div>
                <div className="rounded-xl border border-red-100 bg-red-50 p-6 dark:border-red-900 dark:bg-red-900/20">
                    <p className="font-medium text-red-700 dark:text-red-300">Không tải được dữ liệu giao dịch.</p>
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error?.message || 'Vui lòng kiểm tra backend và thử lại.'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Quản lý giao dịch</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Dữ liệu thanh toán từ bảng Invoice, liên kết hội viên và gói tập
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tổng giao dịch</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Hoàn thành</p>
                    <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
                </div>
                <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tổng doanh thu</p>
                    <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">{formatAmount(stats.revenue)}</p>
                </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <Input
                                type="text"
                                placeholder="Tìm theo tên, SĐT, ID hoặc gói tập..."
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
                        <option value="all">Tất cả loại</option>
                        <option value="registration">Đăng ký mới</option>
                        <option value="renewal">Gia hạn</option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="pending">Chờ xác nhận</option>
                        <option value="failed">Thất bại</option>
                    </select>
                </div>

                <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                    Hiển thị <span className="font-medium">{filteredTransactions.length}</span> trong <span className="font-medium">{transactions.length}</span> giao dịch
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <table className="w-full">
                    <thead className="border-b border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">ID</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Khách hàng</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Loại</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Gói</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Số tiền</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Ngày</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Trạng thái</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Hành động</th>
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
                            filteredTransactions.map((txn) => {
                                const typeConfig = getTypeConfig(txn.type);
                                const currentStatusConfig = getStatusConfig(txn.status);

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
            </div>

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
                                <p className="text-sm text-gray-500 dark:text-gray-400">Ngày</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatDate(selectedTransaction.date)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Khách hàng</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedTransaction.customerName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Điện thoại</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedTransaction.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Loại giao dịch</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{getTypeConfig(selectedTransaction.type).label}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Gói tập</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedTransaction.package}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Số tiền</p>
                                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{formatAmount(selectedTransaction.amount)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Phương thức thanh toán</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedTransaction.paymentMethod}</p>
                            </div>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Ghi chú</p>
                            <p className="mt-1 text-gray-900 dark:text-white">{selectedTransaction.notes}</p>
                        </div>

                        <div className="flex gap-2">
                            <Badge className={getStatusConfig(selectedTransaction.status).color}>
                                {getStatusConfig(selectedTransaction.status).label}
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
