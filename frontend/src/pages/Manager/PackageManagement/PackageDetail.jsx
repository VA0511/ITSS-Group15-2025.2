import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Package, Tag } from 'lucide-react';
import { usePackageDetails } from '@/hooks/queries/usePackages';
import { useServiceCategoryDetails } from '@/hooks/queries/useServiceCategories';
import { formatPriceVND } from '@/utils/formatters';

const PackageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: packageData, isLoading, isError } = usePackageDetails(id);
  const { data: categoryData } = useServiceCategoryDetails(packageData?.category_id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Đang tải chi tiết gói tập...</div>
      </div>
    );
  }

  if (isError || !packageData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="text-red-500">Không tìm thấy gói tập</div>
        <button
          onClick={() => navigate('/manager/packages')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  // Hàm helper để chuyển đổi ngày thành "X tháng" hoặc "X ngày"
  const getDurationDisplay = (days) => {
    if (days >= 30) {
      const months = Math.round(days / 30);
      return `${months} tháng`;
    }
    return `${days} ngày`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/manager/packages')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          title="Quay lại"
        >
          <ArrowLeft size={24} className="text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{packageData.package_name}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">ID: {packageData.id}</p>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Basic Info */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <div className="bg-white dark:bg-gray-950 rounded-xl shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Thông tin giá</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Giá gói tập</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatPriceVND ? formatPriceVND(packageData.price) : `${packageData.price.toLocaleString('vi-VN')} đ`}
                </p>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">Thời hạn</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {getDurationDisplay(packageData.duration_days)}
                </p>
              </div>
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-white dark:bg-gray-950 rounded-xl shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Trạng thái</h2>
            <div className="flex items-center gap-3">
              {packageData.is_active ? (
                <>
                  <CheckCircle size={24} className="text-green-600" />
                  <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/30 dark:text-green-400">
                    ✓ Đang bán
                  </span>
                </>
              ) : (
                <>
                  <XCircle size={24} className="text-red-600" />
                  <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-700 ring-1 ring-inset ring-red-600/20 dark:bg-red-900/30 dark:text-red-400">
                    ✗ Tạm dừng bán
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Additional Info */}
        <div className="space-y-6">
          {/* Category Card */}
          <div className="bg-white dark:bg-gray-950 rounded-xl shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-800 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Tag size={20} className="text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Danh mục dịch vụ</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tên danh mục</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {categoryData?.category_name || 'Đang tải...'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Mô tả lợi ích</p>
                <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {categoryData?.benefits_description || 'Đang tải...'}
                </p>
              </div>
              {categoryData?.allowed_gender && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Giới tính cho phép</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {categoryData.allowed_gender === 'both' ? 'Nam và Nữ' : categoryData.allowed_gender}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Package Details Card */}
          <div className="bg-white dark:bg-gray-950 rounded-xl shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-800 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package size={20} className="text-purple-600 dark:text-purple-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Thông tin gói</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Mã gói</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">{packageData?.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Độ dài gói (ngày)</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">{packageData?.duration_days} ngày</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate('/manager/packages')}
          className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
        >
          Quay lại danh sách
        </button>
      </div>
    </div>
  );
};

export default PackageDetail;
