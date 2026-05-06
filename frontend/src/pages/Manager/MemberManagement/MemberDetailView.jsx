import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Phone, Mail, Calendar, Pause, Play, AlertCircle } from 'lucide-react';
import { useMemberDetails } from '@/hooks/queries/useMembers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '@/components/Common/Button';
import Badge from '@/components/Common/Badge';
import { memberService } from '@/services/memberService';
import { toast } from '@/utils/toast';

const Tabs = {
    INFO: 'info',
    PACKAGE: 'package'
};

// Safe getter functions for member data
const getMemberName = (member) => member?.full_name || 'N/A';
const getMemberPhone = (member) => member?.phone || 'N/A';
const getMemberEmail = (member) => member?.email || 'N/A';
const getMemberGender = (member) => member?.gender || 'N/A';
const getMemberDOB = (member) => member?.dob || 'N/A';
const getMemberAddress = (member) => member?.address || 'N/A';
const getMemberStatus = (member) => member?.is_active ? 'Đang hoạt động' : 'Tạm dừng';
const getMemberPackage = (member) => member?.package || 'Chưa đăng ký';
const getMemberExpiryDate = (member) => member?.expiryDate || 'N/A';
const getMemberJoinDate = (member) => member?.joinDate || 'N/A';

const MemberDetailView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState(Tabs.INFO);

    // Fetch member details from API
    const { data: member, isLoading, isError, error } = useMemberDetails(parseInt(id));

    const toggleStatusMutation = useMutation({
        mutationFn: (isActive) => memberService.updateMemberStatus(parseInt(id), isActive),
        onSuccess: () => {
            toast.success(member?.is_active ? 'Đã tạm dừng hội viên' : 'Đã kích hoạt lại hội viên');
            queryClient.invalidateQueries({ queryKey: ['member', parseInt(id)] });
            queryClient.invalidateQueries({ queryKey: ['members'] });
        },
        onError: (err) => {
            toast.error(err?.response?.data || err?.message || 'Cập nhật trạng thái thất bại');
        },
    });

    const handleToggleStatus = () => {
        toggleStatusMutation.mutate(!member?.is_active);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                    <p className="text-red-600 dark:text-red-400">Lỗi khi tải dữ liệu: {error?.message || 'Vui lòng thử lại'}</p>
                </div>
            </div>
        );
    }

    // No data
    if (!member) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-600 dark:text-gray-400">Không tìm thấy thông tin hội viên</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <button
                    onClick={() => navigate('/manager/members')}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                >
                    <ChevronLeft size={20} />
                    <span>Quay lại</span>
                </button>
                <div className="flex gap-2">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleToggleStatus}
                        disabled={toggleStatusMutation.isPending}
                        title={member?.is_active ? 'Tạm dừng tài khoản' : 'Kích hoạt tài khoản'}
                        leftIcon={member?.is_active ? <Pause size={16} /> : <Play size={16} />}
                    >
                        {member?.is_active ? 'Tạm dừng tài khoản' : 'Kích hoạt tài khoản'}
                    </Button>
                </div>
            </div>

            {/* Member Card */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
                    <img
                        src={(getMemberGender(member) || '').toLowerCase() === 'nữ' ? '/src/assets/nu_ava.jpg' : '/src/assets/nam_ava.jpg'}
                        alt="avatar"
                        className="h-32 w-32 rounded-lg object-cover border border-gray-200 dark:border-gray-700 flex-shrink-0"
                    />

                    <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{getMemberName(member)}</h1>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {member?.is_active ? (
                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                            ✓ {getMemberStatus(member)}
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                            X {getMemberStatus(member)}
                                        </Badge>
                                    )}
                                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                        {getMemberPackage(member)}
                                    </Badge>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Thành viên từ</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{getMemberJoinDate(member)}</p>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <div className="flex items-center gap-2">
                                <Phone size={16} className="text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Điện thoại</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{getMemberPhone(member)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail size={16} className="text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{getMemberEmail(member)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Ngày sinh</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{getMemberDOB(member)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Package Overview */}
                        <div className="mt-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Gói hiện tại hết hạn vào</p>
                            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{getMemberExpiryDate(member)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
                {[
                    { key: Tabs.INFO, label: 'Thông tin' },
                    { key: Tabs.PACKAGE, label: 'Gói tập' }
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === tab.key
                            ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400'
                            : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">

                {/* Info Tab */}
                {activeTab === Tabs.INFO && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Họ tên</p>
                                <p className="mt-1 font-medium text-gray-900 dark:text-white">{getMemberName(member)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Giới tính</p>
                                <p className="mt-1 font-medium text-gray-900 dark:text-white">{getMemberGender(member)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Ngày sinh</p>
                                <p className="mt-1 font-medium text-gray-900 dark:text-white">{getMemberDOB(member)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Điện thoại</p>
                                <p className="mt-1 font-medium text-gray-900 dark:text-white">{getMemberPhone(member)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                <p className="mt-1 font-medium text-gray-900 dark:text-white">{getMemberEmail(member)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Địa chỉ</p>
                                <p className="mt-1 font-medium text-gray-900 dark:text-white">{getMemberAddress(member)}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Package Tab */}
                {activeTab === Tabs.PACKAGE && (
                    <div className="space-y-6">
                        <div className="rounded-lg border-2 border-blue-200 p-4 dark:border-blue-900/30">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{getMemberPackage(member)}</h3>
                            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Từ</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{getMemberJoinDate(member)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Đến</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{getMemberExpiryDate(member)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemberDetailView;
