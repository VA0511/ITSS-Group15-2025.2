import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ChevronRight } from 'lucide-react';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import Badge from '@/components/Common/Badge';
import { useMembers } from '@/hooks/queries/useMembers';

const statusConfig = {
    active: { label: 'Đang hoạt động', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    paused: { label: 'Tạm dừng', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
    expired: { label: 'Hết hạn', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
    inactive: { label: 'Không hoạt động', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' }
};

const MemberListView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch data from API
    const { data: apiResponse = {}, isLoading, isError } = useMembers(currentPage, 10);

    // Handle both paginated response and direct array
    const members = Array.isArray(apiResponse.data) ? apiResponse.data : (Array.isArray(apiResponse) ? apiResponse : []);

    // Filter members
    const filteredMembers = members.filter(member => {
        // Guard against undefined values
        if (!member) return false;

        const name = member.name || '';
        const phone = member.phone || '';
        const id = member.id || 0;

        const matchSearch =
            name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            phone.toString().includes(searchTerm) ||
            id.toString().includes(searchTerm);

        const matchStatus = statusFilter === 'all' || member.status === statusFilter;

        return matchSearch && matchStatus;
    });

    // Show loading state
    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Quản Lý Hội Viên</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Danh sách tất cả hội viên tại phòng gym</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <p className="text-gray-500 dark:text-gray-400">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (isError) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Quản Lý Hội Viên</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Danh sách tất cả hội viên tại phòng gym</p>
                </div>
                <div className="rounded-xl border border-red-100 bg-red-50 p-6 dark:border-red-900 dark:bg-red-900/20">
                    <p className="text-red-600 dark:text-red-400">Lỗi khi tải dữ liệu. Vui lòng thử lại sau.</p>
                </div>
            </div>
        );
    }

    const getStatusBadge = (status) => {
        const config = statusConfig[status] || statusConfig.inactive;
        return (
            <Badge className={config.color}>
                {config.label}
            </Badge>
        );
    };

    // Safe value getters with defaults
    const getMemberName = (member) => member?.name || 'N/A';
    const getMemberPhone = (member) => member?.phone || 'N/A';
    const getMemberPackage = (member) => member?.package || 'Chưa đăng ký';
    const getMemberSessions = (member) => member?.sessionsRemaining ?? 0;
    const getMemberExpiry = (member) => member?.expiryDate || 'N/A';
    const getMemberStatus = (member) => member?.status || 'inactive';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Quản Lý Hội Viên</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Danh sách tất cả hội viên tại phòng gym
                    </p>
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
                                placeholder="Tìm theo tên, SĐT hoặc ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="flex gap-2 items-center">
                        <Filter size={18} className="text-gray-500" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="active">Đang hoạt động</option>
                            <option value="paused">Tạm dừng</option>
                            <option value="expired">Hết hạn</option>
                            <option value="inactive">Không hoạt động</option>
                        </select>
                    </div>
                </div>

                {/* Result count */}
                <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                    Hiển thị <span className="font-medium">{filteredMembers.length}</span> trong <span className="font-medium">{members.length}</span> hội viên
                </div>
            </div>

            {/* Members List */}
            <div className="space-y-3">
                {filteredMembers.length === 0 ? (
                    <div className="rounded-xl border border-gray-100 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-950">
                        <p className="text-gray-500 dark:text-gray-400">Không tìm thấy hội viên nào</p>
                    </div>
                ) : (
                    filteredMembers.map((member) => (
                        <Link key={member.id} to={`/manager/members/${member.id}`}>
                            <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-gray-200 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <img 
                                              src={(member.gender || '').toLowerCase() === 'nữ' ? '/src/assets/nu_ava.jpg' : '/src/assets/nam_ava.jpg'} 
                                              alt="avatar" 
                                              className="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-medium text-gray-900 dark:text-white">{getMemberName(member)}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{getMemberPhone(member)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hidden sm:flex sm:items-center sm:gap-4">
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{getMemberPackage(member)}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{getMemberSessions(member)} buổi còn lại</p>
                                        </div>

                                        <div className="text-right">
                                            {getStatusBadge(getMemberStatus(member))}
                                        </div>

                                        <div className="text-right">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Hết hạn</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{getMemberExpiry(member)}</p>
                                        </div>
                                    </div>

                                    <ChevronRight className="ml-2 text-gray-400" size={20} />
                                </div>

                                {/* Mobile view */}
                                <div className="mt-3 flex flex-wrap gap-3 sm:hidden">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Gói</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{getMemberPackage(member)}</p>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Hết hạn</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{getMemberExpiry(member)}</p>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        {getStatusBadge(getMemberStatus(member))}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default MemberListView;
