import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, PenTool, ChevronLeft, ChevronRight, Power, PowerOff } from 'lucide-react';
import { useEquipment } from '@/hooks/queries/useEquipment';
import { useDeleteEquipment, useUpdateEquipmentStatus } from '@/hooks/mutations/useEquipmentMutation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Common/Table';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import Modal from '@/components/Common/Modal';

const EquipmentList = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, equipment: null });
  const limit = 10;

  const { data: response, isLoading, isError, error } = useEquipment(page, limit);
  const deleteMutation = useDeleteEquipment();
  const statusMutation = useUpdateEquipmentStatus();

  const handleDelete = () => {
    if (deleteModal.equipment) {
      deleteMutation.mutate(deleteModal.equipment.id);
      setDeleteModal({ isOpen: false, equipment: null });
    }
  };

  const handleToggleStatus = (equipment) => {
    const newStatus = equipment.status === 'active' ? 'maintenance' : 'active';
    statusMutation.mutate({ id: equipment.id, status: newStatus });
  };
  
  // Handle API response - extract data from pagination response
  // Fallback to mock data if API fails
  const mockEquipment = [
    { id: 1, equipment_name: 'Máy chạy bộ Proform', facility_id: 1, status: 'active', origin: 'Mỹ', maintenance_deadline: '2026-06-15' },
    { id: 2, equipment_name: 'Ghế đẩy ngực', facility_id: 2, status: 'active', origin: 'Đức', maintenance_deadline: '2026-07-20' },
    { id: 3, equipment_name: 'Máy kéo xô lưng đùi', facility_id: 2, status: 'maintenance', origin: 'Trung Quốc', maintenance_deadline: '2026-05-01' },
    { id: 4, equipment_name: 'Tạ đòn Olympic 20kg', facility_id: 2, status: 'active', origin: 'Việt Nam', maintenance_deadline: '2026-12-30' },
    { id: 5, equipment_name: 'Xe đạp tập Elip', facility_id: 1, status: 'active', origin: 'Mỹ', maintenance_deadline: '2026-08-15' },
  ];

  const equipment = useMemo(() => {
    if (!response) return mockEquipment;
    if (Array.isArray(response)) return response; // Mock data format
    if (response.data && response.data.length > 0) return response.data; // Pagination response with data
    if (isError) return mockEquipment; // Fallback on error
    return mockEquipment;
  }, [response, isError]);

  const totalItems = useMemo(() => {
    if (!response) return 0;
    if (Array.isArray(response)) return response.length;
    return response.total_items || 0;
  }, [response]);

  const totalPages = useMemo(() => {
    if (!response) return 1;
    if (Array.isArray(response)) return 1;
    return response.total_pages || Math.ceil(totalItems / limit) || 1;
  }, [response, totalItems]);

  const filteredEquipment = useMemo(() => {
    const query = searchTerm.toLowerCase();
    return equipment.filter((item) =>
      item.equipment_name?.toLowerCase().includes(query) ||
      item.equipmentName?.toLowerCase().includes(query) ||
      item.origin?.toLowerCase().includes(query) ||
      item.status?.toLowerCase().includes(query)
    );
  }, [equipment, searchTerm]);

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Quản lý Thiết bị</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Theo dõi tình trạng máy móc, thiết bị và lịch bảo trì.
          </p>
        </div>
        <Link to="/owner/equipment/create">
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Thêm thiết bị
          </Button>
        </Link>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tìm kiếm thiết bị</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Tìm theo tên, loại, tình trạng hoặc ngày bảo trì.</p>
          </div>
          <div className="w-full max-w-sm">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm thiết bị..."
            />
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Đang tải danh sách thiết bị...</div>
          ) : isError ? (
            <div className="p-8 text-center text-red-500">
              Lỗi khi tải dữ liệu: {error?.message || 'Vui lòng đăng nhập lại'}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên thiết bị / Thuộc máy</TableHead>
                  <TableHead>Tên phòng tập</TableHead>
                  <TableHead>Trạng thái sửa chữa</TableHead>
                  <TableHead>Bảo trì tiếp theo</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipment.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500 h-24">
                      Không tìm thấy thiết bị phù hợp.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEquipment.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          <PenTool className="h-4 w-4 text-gray-400" />
                          {item.equipment_name || item.equipmentName || item.EquipmentName || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Xuất xứ: {item.origin || 'N/A'}</div>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-300">
                        {item.facility_name || item.FacilityName || 'Chưa xác định'}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                          item.status === 'active' || item.status === 'Operating'
                            ? 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400'
                            : item.status === 'maintenance' || item.status === 'Maintenance'
                            ? 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-gray-50 text-gray-700 ring-gray-600/20 dark:bg-gray-900/30 dark:text-gray-400'
                        }`}>
                          {item.status === 'active' || item.status === 'Operating' ? 'Hoạt động tốt' : item.status === 'maintenance' || item.status === 'Maintenance' ? 'Đang bảo trì' : item.status || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {item.maintenance_deadline || item.MaintenanceDeadline 
                          ? new Date(item.maintenance_deadline || item.MaintenanceDeadline).toLocaleDateString('vi-VN')
                          : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        <div className="flex items-center justify-end gap-1">
                          {/* Kích hoạt button removed as requested */}
                          <Link to={`/owner/equipment/${item.id}/edit`}>
                            <Button variant="ghost" size="icon" title="Chỉnh sửa" className="h-8 w-8 text-blue-500 hidden sm:inline-flex">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title="Xóa" 
                            className="h-8 w-8 text-red-500 hidden sm:inline-flex"
                            onClick={() => setDeleteModal({ isOpen: true, equipment: item })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <div className="sm:hidden text-blue-500 font-medium text-sm underline px-2 py-1">Sửa</div>
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
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Trang {page} / {totalPages} (Tổng: {totalItems} thiết bị)
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
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, equipment: null })}
        title="Xác nhận xóa thiết bị"
      >
        <div className="p-4">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Bạn có chắc chắn muốn xóa thiết bị <strong>{deleteModal.equipment?.equipment_name}</strong> không?
          </p>
          <p className="text-sm text-red-500 mb-4">Hành động này không thể hoàn tác.</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteModal({ isOpen: false, equipment: null })}>
              Hủy
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EquipmentList;
