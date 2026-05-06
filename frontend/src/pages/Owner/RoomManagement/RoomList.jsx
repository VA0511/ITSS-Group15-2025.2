import React, { useMemo, useState } from 'react';
import { Plus, Users, MapPin, Edit, Eye, Trash2, ChevronLeft, ChevronRight, Power, PowerOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFacilities } from '@/hooks/queries/useFacilities';
import { useDeleteFacility, useUpdateFacilityStatus } from '@/hooks/mutations/useFacilityMutation';
import Button from '@/components/Common/Button';
import Modal from '@/components/Common/Modal';
import { toast } from '@/utils/toast';

const RoomList = () => {
  const [page, setPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, room: null });
  const limit = 10;

  const { data: facilityResponse, isLoading } = useFacilities(page, limit);
  const deleteMutation = useDeleteFacility();
  const statusMutation = useUpdateFacilityStatus();

  const handleDelete = () => {
    if (deleteModal.room) {
      deleteMutation.mutate(deleteModal.room.id);
      setDeleteModal({ isOpen: false, room: null });
    }
  };

  const handleToggleStatus = (room) => {
    // Toggle between "Operating" and "Maintenance" to match database values
    const newStatus = room.status === 'active' || room.status === 'Operating' ? 'Maintenance' : 'Operating';
    statusMutation.mutate({ id: room.id, status: newStatus });
  };

  // Mock data fallback - use "Operating" to match database
  const mockRooms = [
    { id: 1, facility_name: 'Khu vực Cardio (Tầng 1)', facility_type: 'cardio', status: 'Operating', max_capacity: 30, current_capacity: 15, description: 'Khu vực máy chạy bộ, xe đạp' },
    { id: 2, facility_name: 'Phòng Tập Tạ (Tầng 2)', facility_type: 'weights', status: 'Operating', max_capacity: 50, current_capacity: 40, description: 'Khu vực tạ tự do và máy tập' },
    { id: 3, facility_name: 'Phòng Yoga Cao Cấp', facility_type: 'yoga', status: 'Maintenance', max_capacity: 20, current_capacity: 0, description: 'Phòng yoga với trang thiết bị cao cấp' },
    { id: 4, facility_name: 'Sân Boxing & MMA', facility_type: 'boxing', status: 'Operating', max_capacity: 15, current_capacity: 5, description: 'Khu vực võ thuật' },
    { id: 5, facility_name: 'Khu vực thay đồ', facility_type: 'locker', status: 'Operating', max_capacity: 100, current_capacity: 30, description: 'Tủ khóa và phòng thay đồ' },
  ];

  // Handle API response
  const rooms = useMemo(() => {
    if (!facilityResponse) return mockRooms;
    if (Array.isArray(facilityResponse)) return facilityResponse;
    if (facilityResponse.data && facilityResponse.data.length > 0) return facilityResponse.data;
    if (isLoading === false && !facilityResponse?.data) return mockRooms;
    return mockRooms;
  }, [facilityResponse, isLoading]);

  const totalItems = useMemo(() => {
    if (!facilityResponse) return mockRooms.length;
    if (Array.isArray(facilityResponse)) return facilityResponse.length;
    return facilityResponse.total_items || mockRooms.length;
  }, [facilityResponse]);

  const totalPages = useMemo(() => {
    if (!facilityResponse) return 1;
    if (Array.isArray(facilityResponse)) return 1;
    return facilityResponse.total_pages || Math.ceil(totalItems / limit) || 1;
  }, [facilityResponse, totalItems]);

  // Map API data to display format
  const displayRooms = useMemo(() => {
    return rooms.map(room => {
      // Normalize status: "Operating" -> "active", "Maintenance" -> "maintenance"
      const rawStatus = room.status || 'active';
      const normalizedStatus = rawStatus.toLowerCase() === 'operating' ? 'active' : 
                              rawStatus.toLowerCase() === 'maintenance' ? 'maintenance' : rawStatus;
      return {
        id: room.id || room.facility_id,
        name: room.facility_name || room.facilityName || room.name || 'N/A',
        capacity: room.max_capacity || room.MaxCapacity || room.capacity || 0,
        current: room.current_capacity || room.CurrentCapacity || 0,
        status: normalizedStatus,
        description: room.description || '',
        icon: room.facility_type === 'cardio' ? '🏃' : 
              room.facility_type === 'weights' ? '🏋️' : 
              room.facility_type === 'yoga' ? '🧘' : '🏢',
      };
    });
  }, [rooms]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Quản lý Khu vực / Phòng Tập</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Theo dõi sức chứa và mật độ hiện tại của các không gian tập.
          </p>
        </div>
        <Link to="/owner/rooms/create">
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Thêm phân khu mới
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Đang tải...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayRooms.map((room) => (
          <div key={room.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col hover:border-blue-400 transition-colors dark:border-gray-800 dark:bg-gray-950 dark:hover:border-blue-500">
            <div className="text-4xl mb-4 bg-gray-50 h-16 w-16 flex items-center justify-center rounded-2xl dark:bg-gray-900">
              {room.icon}
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 flex-1 dark:text-white">
              {room.name}
            </h3>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Users className="h-4 w-4 mr-2" />
                Sức chứa: {room.capacity} người
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center text-gray-500 dark:text-gray-400"><MapPin className="h-4 w-4 mr-2" /> Hiện tại:</span>
                <span className={`font-semibold ${room.capacity > 0 && room.current / room.capacity > 0.8 ? 'text-red-500' : 'text-green-500'}`}>
                  {room.current} người
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                room.status === 'active' 
                  ? 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400' 
                  : room.status === 'maintenance'
                  ? 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-900/30 dark:text-amber-400'
                  : 'bg-gray-50 text-gray-700 ring-gray-600/20 dark:bg-gray-900/30 dark:text-gray-400'
              }`}>
                {room.status === 'active' ? 'Đang mở cửa' : room.status === 'maintenance' ? 'Bảo trì' : room.status}
              </span>
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`h-8 w-8 ${room.status === 'active' ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/50' : 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/50'}`}
                  title={room.status === 'active' ? 'Bảo trì' : 'Kích hoạt'}
                  onClick={() => handleToggleStatus(room)}
                >
                  {room.status === 'active' ? <PowerOff className="h-4 w-4"/> : <Power className="h-4 w-4"/>}
                </Button>
                <Link to={`/owner/rooms/${room.id}`}>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/50"
                    title="Xem chi tiết"
                  >
                    <Eye className="h-4 w-4"/>
                  </Button>
                </Link>
                <Link to={`/owner/rooms/${room.id}/edit`}>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/50"
                    title="Chỉnh sửa"
                  >
                    <Edit className="h-4 w-4"/>
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50"
                  title="Xóa"
                  onClick={() => setDeleteModal({ isOpen: true, room })}
                >
                  <Trash2 className="h-4 w-4"/>
                </Button>
              </div>
            </div>
          </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Trang {page} / {totalPages} (Tổng: {totalItems} phòng)
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, room: null })}
        title="Xác nhận xóa phòng tập"
      >
        <div className="p-4">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Bạn có chắc chắn muốn xóa phòng <strong>{deleteModal.room?.name}</strong> không?
          </p>
          <p className="text-sm text-red-500 mb-4">Hành động này không thể hoàn tác.</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteModal({ isOpen: false, room: null })}>
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

export default RoomList;
