import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Eye, EyeOff } from 'lucide-react';
import { usePackages } from '@/hooks/queries/usePackages';
import { useUpdatePackageStatus } from '@/hooks/mutations/usePackageMutation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Common/Table';
import Button from '@/components/Common/Button';
import Modal from '@/components/Common/Modal';
import { formatPriceVND } from '@/utils/formatters';

const PackageList = () => {
  const { data: packages, isLoading, isError } = usePackages();
  const [toggleModal, setToggleModal] = useState({ isOpen: false, pkg: null });
  const statusMutation = useUpdatePackageStatus();

  // Lưu ý: Nếu bạn muốn dùng deleteMutation, bạn cần import hook tương ứng ở đây
  // const deleteMutation = useDeletePackage(); 

  const handleToggleStatus = (pkg) => {
    setToggleModal({ isOpen: true, pkg });
  };

  const handleConfirmToggle = () => {
    if (toggleModal.pkg) {
      const newIsActive = !toggleModal.pkg.is_active;
      statusMutation.mutate({ id: toggleModal.pkg.id, isActive: newIsActive }, {
        onSuccess: () => setToggleModal({ isOpen: false, pkg: null })
      });
    }
  };

  const mockPackages = packages || [
    { id: 1, name: "Gói Cơ Bản", duration: 1, durationUnit: "Tháng", price: 300000, is_active: true, features: ["Phòng gym cơ bản", "Yoga"] },
    { id: 2, name: "Gói Nâng Cao", duration: 3, durationUnit: "Tháng", price: 800000, is_active: true, features: ["Tất cả khu vực", "Tủ đồ cá nhân"] },
    { id: 3, name: "Gói VIP (1 Năm)", duration: 12, durationUnit: "Tháng", price: 3000000, is_active: true, features: ["HLV cá nhân 2 buổi", "Massge", "Sauna"] },
    { id: 4, name: "Gói Trải Nghiệm", duration: 7, durationUnit: "Ngày", price: 100000, is_active: false, features: ["Dùng thử giới hạn"] },
  ];

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Danh sách Gói tập</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Quản lý và cấu hình các dịch vụ gói tập do Gym cung cấp.
          </p>
        </div>
        <Link to="/owner/packages/create">
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Thêm gói mới
          </Button>
        </Link>
      </div>

      <div className="rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-950 dark:ring-gray-800">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Đang tải biểu giá...</div>
        ) : isError && !packages ? (
          <div className="p-8 text-center text-red-500">Lỗi lấy dữ liệu Gói tập.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên Gói</TableHead>
                <TableHead>Thời lượng</TableHead>
                <TableHead>Giá (VND)</TableHead>
                <TableHead>Mô tả ngắn</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPackages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 h-24">
                    Chưa có cấu hình gói tập nào. Bấm "Thêm gói mới" để thiết lập.
                  </TableCell>
                </TableRow>
              ) : (
                mockPackages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell className="font-semibold text-gray-900 dark:text-gray-100">{pkg.package_name || pkg.name}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      {pkg.duration_days ? `${pkg.duration_days} Ngày` : `${pkg.duration} ${pkg.durationUnit}`}
                    </TableCell>
                    <TableCell className="font-medium text-emerald-600 dark:text-emerald-400">
                      {formatPriceVND ? formatPriceVND(pkg.price) : `${pkg.price.toLocaleString('vi-VN')} đ`}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500 max-w-[200px] truncate">
                      {pkg.description || pkg.features?.join(", ") || 'Chưa có mô tả'}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                        (pkg.is_active === true || pkg.status === 'active')
                          ? 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400' 
                          : 'bg-gray-50 text-gray-600 ring-gray-600/20 dark:bg-gray-800/50 dark:text-gray-400'
                      }`}>
                        {(pkg.is_active === true || pkg.status === 'active') ? 'Đang bán' : 'Bị ẩn'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title={pkg.is_active ? 'Ẩn gói' : 'Hiển thị gói'}
                          className={`h-8 w-8 ${pkg.is_active ? 'text-green-500' : 'text-amber-500'} hidden sm:inline-flex`}
                          onClick={() => handleToggleStatus(pkg)}
                        >
                          {pkg.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                        <Link to={`/owner/packages/${pkg.id}/edit`}>
                          <Button variant="ghost" size="icon" title="Chỉnh sửa" className="h-8 w-8 text-blue-500 hidden sm:inline-flex">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
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

      <Modal
        isOpen={toggleModal.isOpen}
        onClose={() => setToggleModal({ isOpen: false, pkg: null })}
        title={toggleModal.pkg?.is_active ? 'Ẩn gói tập' : 'Hiển thị gói tập'}
      >
        <div className="p-4">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Bạn có chắc chắn muốn {toggleModal.pkg?.is_active ? 'ẩn' : 'hiển thị'} gói tập <strong>{toggleModal.pkg?.package_name || toggleModal.pkg?.name}</strong> không?
          </p>
          {toggleModal.pkg?.is_active && (
            <p className="text-sm text-amber-600 dark:text-amber-400 mb-4">
              💡 Gói tập sẽ bị ẩn, member không thể mua.
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setToggleModal({ isOpen: false, pkg: null })}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleConfirmToggle} disabled={statusMutation.isPending}>
              {statusMutation.isPending ? 'Đang xử lý...' : toggleModal.pkg?.is_active ? 'Ẩn' : 'Hiển thị'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PackageList;