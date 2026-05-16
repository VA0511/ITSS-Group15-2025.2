import React from 'react';
import { CreditCard, CheckCircle2, Package } from 'lucide-react';
import { useMemberPackages } from '@/hooks/queries/usePackages';
import Loading from '@/components/Common/Loading';
import { useNavigate } from 'react-router-dom';

const PackageInfo = () => {
  const { data: rawData = [], isLoading, error } = useMemberPackages();
  const navigate = useNavigate();

  if (isLoading) {
    return <Loading />;
  }

  // API trả về cấu trúc { data: { data: [...], total, page } } hoặc { data: [...] } hoặc [...]
  const packages = Array.isArray(rawData)
    ? rawData
    : Array.isArray(rawData?.data?.data)
    ? rawData.data.data
    : Array.isArray(rawData?.data)
    ? rawData.data
    : [];

  if (error) {
    return (
      <div className="max-w-lg mx-auto md:max-w-2xl pb-20 px-4">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-900/10">
          <p className="text-red-600 dark:text-red-400">Lỗi khi tải thông tin gói tập. Vui lòng thử lại.</p>
        </div>
      </div>
    );
  }

  // If no packages, show message
  if (packages.length === 0) {
    return (
      <div className="space-y-6 max-w-lg mx-auto md:max-w-2xl pb-20 px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gói Tập Của Tôi</h1>
        
        <div className="rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 p-8 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Bạn chưa có gói tập nào</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Đăng ký một gói tập ngay hôm nay để bắt đầu tập luyện.</p>
          <button
            onClick={() => navigate('/member/register')}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Đăng Ký Gói Tập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto md:max-w-2xl pb-20 px-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gói Tập Của Tôi</h1>
      
      {/* Display all packages */}
      {packages.map((pkg) => {
        const pkgName = pkg.package_name || pkg.name;
        const isActive = pkg.status === 'active' || pkg.status === 'Active';
        const endDateStr = pkg.end_date || pkg.endDate;
        const endDate = endDateStr ? new Date(endDateStr) : null;
        const today = new Date();
        const daysRemaining = endDate && !isNaN(endDate) ? Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)) : null;
        const price = pkg.price ? (typeof pkg.price === 'number' ? pkg.price.toLocaleString('vi-VN') + ' đ' : pkg.price) : '0 đ';
        
        return (
          <div
            key={pkg.id}
            className={`rounded-2xl border-2 p-6 relative overflow-hidden shadow-sm ${
              isActive
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-600/50'
                : 'border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800'
            }`}
          >
            {isActive && (
              <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 py-1.5 text-xs font-bold rounded-bl-xl shadow-sm">
                ĐANG KÍCH HOẠT
              </div>
            )}
            
            <h2 className={`text-xl font-black ${
              isActive
                ? 'text-emerald-800 dark:text-emerald-400'
                : 'text-gray-900 dark:text-white'
            } pr-24 leading-snug`}>
              {pkgName}
            </h2>
            
            <p className={`mt-2 font-bold text-lg ${
              isActive
                ? 'text-emerald-600 dark:text-emerald-500'
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              {price}
            </p>
            
            {pkg.benefits_description && (
              <div className="mt-6 space-y-3">
                {pkg.benefits_description.split(',').slice(0, 3).map((benefit, bidx) => (
                  <div key={bidx} className={`flex items-center gap-3 ${
                    isActive
                      ? 'text-emerald-700 dark:text-emerald-300'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <span className="text-sm font-medium">{benefit.trim()}</span>
                  </div>
                ))}
              </div>
            )}

            <div className={`mt-8 pt-5 border-t flex justify-between items-end ${
              isActive
                ? 'border-emerald-200 dark:border-emerald-800/40'
                : 'border-gray-200 dark:border-gray-800'
            }`}>
              <div>
                <p className={`text-xs uppercase tracking-wider font-semibold ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-500'
                    : 'text-gray-600 dark:text-gray-500'
                }`}>
                  Ngày hết hạn
                </p>
                <p className={`font-bold text-xl mt-1 ${
                  isActive
                    ? 'text-emerald-900 dark:text-emerald-200'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {endDate ? endDate.toLocaleDateString('vi-VN') : 'Chưa xác định'}
                </p>
                <p className={`text-xs mt-1 ${
                  isActive ? 'text-emerald-600' : 'text-gray-500'
                }`}>
                  {daysRemaining === null ? '' : daysRemaining > 0 ? `(Còn ${daysRemaining} ngày)` : '(Đã hết hạn)'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className={`h-10 w-10 ${
                  isActive ? 'text-emerald-400' : 'text-gray-400'
                }`} />
              </div>
            </div>
          </div>
        );
      })}

      {/* Register new package button */}
      <div className="rounded-2xl border-2 border-dashed border-blue-300 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/10 p-6 text-center">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Muốn đăng ký thêm gói tập?</h3>
        <button
          onClick={() => navigate('/member/register')}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors mt-4"
        >
          Đăng Ký Gói Tập Mới
        </button>
      </div>
    </div>
  );
};

export default PackageInfo;
