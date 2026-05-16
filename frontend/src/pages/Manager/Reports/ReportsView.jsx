import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Filter } from 'lucide-react';
import Button from '@/components/Common/Button';
import Badge from '@/components/Common/Badge';

// Mock Report Data
const newMembersData = [
    { month: 'Tháng 1', members: 12 },
    { month: 'Tháng 2', members: 19 },
    { month: 'Tháng 3', members: 15 },
    { month: 'Tháng 4', members: 25 },
    { month: 'Tháng 5', members: 22 },
    { month: 'Tháng 6', members: 28 }
];

const revenueData = [
    { month: 'Tháng 1', revenue: 25000000 },
    { month: 'Tháng 2', revenue: 32000000 },
    { month: 'Tháng 3', revenue: 28000000 },
    { month: 'Tháng 4', revenue: 38000000 },
    { month: 'Tháng 5', revenue: 35000000 },
    { month: 'Tháng 6', revenue: 42000000 }
];

const packageDistribution = [
    { name: 'Gói VIP', value: 45, fill: '#3b82f6' },
    { name: 'Gói Nâng Cao', value: 28, fill: '#8b5cf6' },
    { name: 'Gói Cơ Bản', value: 18, fill: '#10b981' },
    { name: 'Lớp Nhóm', value: 9, fill: '#f59e0b' }
];

const memberStatusData = [
    { status: 'Đang hoạt động', count: 102, percentage: 79.7 },
    { status: 'Tạm dừng', count: 18, percentage: 14.1 },
    { status: 'Hết hạn', count: 8, percentage: 6.2 }
];

const ptPerformanceData = [
    { name: 'Hùng Gym', sessions: 28, rating: 4.8 },
    { name: 'Tùng PT', sessions: 24, rating: 4.7 },
    { name: 'Lan Coach', sessions: 31, rating: 4.9 },
    { name: 'Minh Trainer', sessions: 19, rating: 4.6 }
];

const ReportsView = () => {
    const [timeframe, setTimeframe] = useState('6months');

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
    const totalNewMembers = newMembersData.reduce((sum, item) => sum + item.members, 0);
    const avgRevenue = totalRevenue / revenueData.length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Báo Cáo</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Phân tích doanh thu, hội viên, và hiệu suất
                    </p>
                </div>
                <Button>
                    <Download size={16} /> Xuất báo cáo
                </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 items-center">
                <Filter size={18} className="text-gray-500" />
                <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                >
                    <option value="1month">Tháng này</option>
                    <option value="3months">3 tháng</option>
                    <option value="6months">6 tháng</option>
                    <option value="1year">1 năm</option>
                </select>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tổng doanh thu</p>
                    <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(totalRevenue)}</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Trung bình {formatCurrency(avgRevenue)}/tháng</p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Hội viên mới</p>
                    <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">{totalNewMembers}</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Trung bình {(totalNewMembers / newMembersData.length).toFixed(1)}/tháng</p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tổng hội viên</p>
                    <p className="mt-2 text-3xl font-bold text-purple-600 dark:text-purple-400">128</p>
                    <div className="mt-1 flex gap-2">
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs">79.7%</Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">đang hoạt động</span>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <p className="text-sm text-gray-500 dark:text-gray-400">PT hiệu suất cao</p>
                    <p className="mt-2 text-3xl font-bold text-orange-600 dark:text-orange-400">4</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Rating ≥ 4.5 sao</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* New Members Chart */}
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Hội viên mới theo tháng</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={newMembersData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="members" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Revenue Chart */}
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Doanh thu theo tháng</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                            <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Package Distribution */}
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Phân bổ gói tập</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={packageDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${value}`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {packageDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Member Status */}
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Trạng thái hội viên</h3>
                    <div className="space-y-3">
                        {memberStatusData.map((item, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.status}</p>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.count} ({item.percentage}%)</span>
                                </div>
                                <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                                    <div
                                        className="h-full rounded-full bg-blue-500 transition-all"
                                        style={{ width: `${item.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* PT Performance */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Hiệu suất huấn luyện viên</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Huấn luyện viên</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Lịch tập</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Đánh giá</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {ptPerformanceData.map((pt, index) => (
                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{pt.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{pt.sessions} buổi</td>
                                    <td className="px-4 py-3">
                                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                            ⭐ {pt.rating}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                            Hoạt động
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Hành động nhanh</h3>
                <div className="flex flex-wrap gap-3">
                    <Button>Xuất báo cáo hàng tháng</Button>
                    <Button variant="outline">Gửi email báo cáo</Button>
                    <Button variant="outline">In báo cáo</Button>
                </div>
            </div>
        </div>
    );
};

export default ReportsView;
