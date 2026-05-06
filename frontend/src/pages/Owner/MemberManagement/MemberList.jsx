import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMembers } from '@/hooks/queries/useMembers';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Common/Table';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';

const MemberList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 10;

  const { data: memberResponse, isLoading, isError } = useMembers(page, limit);

  // Mock data fallback
  const mockMembers = [
    { id: 1, full_name: 'Nguyễn Văn A', phone: '0912345678', email: 'vana@gmail.com', package_name: 'Gói VIP', status: 'active', registered_at: '2026-01-15' },
    { id: 2, full_name: 'Trần Thị B', phone: '0923456789', email: 'thib@gmail.com', package_name: 'Gói Basic', status: 'active', registered_at: '2026-02-20' },
    { id: 3, full_name: 'Lê Văn C', phone: '0934567890', email: 'vanc@gmail.com', package_name: 'Gói Premium', status: 'inactive', registered_at: '2025-12-10' },
    { id: 4, full_name: 'Phạm Thị D', phone: '0945678901', email: 'thid@gmail.com', package_name: 'Gói VIP', status: 'active', registered_at: '2026-03-05' },
    { id: 5, full_name: 'Hoàng Văn E', phone: '0956789012', email: 'vane@gmail.com', package_name: 'Gói Basic', status: 'active', registered_at: '2026-03-15' },
  ];

  // Handle API response
  const members = useMemo(() => {
    if (!memberResponse) return mockMembers;
    if (Array.isArray(memberResponse)) return memberResponse;
    if (memberResponse.data && memberResponse.data.length > 0) return memberResponse.data;
    if (isError) return mockMembers;
    return mockMembers;
  }, [memberResponse, isError]);

  const totalMemberItems = useMemo(() => {
    if (!memberResponse) return mockMembers.length;
    if (Array.isArray(memberResponse)) return memberResponse.length;
    return memberResponse.total_items || mockMembers.length;
  }, [memberResponse]);

  const totalMemberPages = useMemo(() => {
    if (!memberResponse) return 1;
    if (Array.isArray(memberResponse)) return 1;
    return memberResponse.total_pages || Math.ceil(totalMemberItems / limit) || 1;
  }, [memberResponse, totalMemberItems]);

  const sortedMembers = useMemo(() => {
    return (members || []).slice().sort((a, b) => {
      const dateA = new Date(a.created_at || a.createdAt || a.registeredAt || a.expiredAt || 0).getTime();
      const dateB = new Date(b.created_at || b.createdAt || b.registeredAt || b.expiredAt || 0).getTime();
      return dateB - dateA;
    });
  }, [members]);

  const filteredMembers = useMemo(() => {
    const value = searchTerm.toLowerCase();
    return sortedMembers.filter((member) =>
      (member.full_name || member.FullName || member.name || '').toLowerCase().includes(value) ||
      (member.package_name || member.packageName || member.package || '').toLowerCase().includes(value) ||
      (member.phone || member.Phone || '').includes(value) ||
      (member.email || member.Email || '').toLowerCase().includes(value)
    );
  }, [searchTerm, sortedMembers]);

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Danh sách Hội viên</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Quản lý tất cả danh sách người tập tại hệ thống của bạn.
          </p>
        </div>
        <Link to="/owner/members/create">
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Thêm hội viên
          </Button>
        </Link>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tìm kiếm hội viên</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Tìm theo tên, mã, số điện thoại hoặc email.</p>
          </div>
          <div className="w-full max-w-sm">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm hội viên..."
            />
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>
          ) : isError ? (
            <div className="p-8 text-center text-red-500">Lỗi khi tải dữ liệu hội viên. Vui lòng thử lại.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Họ Tên</TableHead>
                  <TableHead>Gói tập</TableHead>
                  <TableHead>SĐT</TableHead>
                  <TableHead>Ngày đăng ký</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500 h-24">
                      Không tìm thấy hội viên phù hợp.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => (
                    <TableRow
                      key={member.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
                      onClick={() => navigate(`/owner/members/${member.id}`)}
                    >
                      <TableCell className="font-semibold text-gray-900 dark:text-gray-100">
                        <div className="flex items-center gap-3">
                          <img 
                            src={(member.gender || '').toLowerCase() === 'nữ' ? '/src/assets/nu_ava.jpg' : '/src/assets/nam_ava.jpg'} 
                            alt="avatar" 
                            className="h-8 w-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                          />
                          <span>{member.full_name || member.FullName || member.name || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-300">
                        {member.package_name || member.packageName || member.package || 'N/A'}
                      </TableCell>
                      <TableCell>{member.phone || member.Phone || 'N/A'}</TableCell>
                      <TableCell>
                        {member.joinDate
                          ? new Date(member.joinDate).toLocaleDateString('vi-VN')
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                          member.status === 'active' || member.Status === 'active'
                            ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {member.status === 'active' || member.Status === 'active' ? 'Đang tập' : 'Hết hạn'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link to={`/owner/members/${member.id}`} onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" title="Xem chi tiết" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link to={`/owner/members/${member.id}/edit`} onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" title="Chỉnh sửa" className="h-8 w-8 text-blue-500">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Pagination */}
        {totalMemberPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Trang {page} / {totalMemberPages} (Tổng: {totalMemberItems} hội viên)
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
                onClick={() => setPage(p => Math.min(totalMemberPages, p + 1))}
                disabled={page === totalMemberPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberList;
