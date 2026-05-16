import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowRight, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react';
import Button from '@/components/Common/Button';
import { useMemberPackages } from '@/hooks/queries/usePackages';
import Loading from '@/components/Common/Loading';
import { toast } from 'sonner';

const renewalMonthOptions = [1, 3, 6, 12];

const generateRandomRenewalPrice = (months) => {
  const basePrice = 500000;
  const pricePerMonth = basePrice + Math.random() * 100000;
  return Math.floor(pricePerMonth * months);
};

const RenewPackage = () => {
  const navigate = useNavigate();
  const { data: packagesRes, isLoading } = useMemberPackages();
  const packages = (() => {
    const raw = Array.isArray(packagesRes)
      ? packagesRes
      : Array.isArray(packagesRes?.data?.data)
      ? packagesRes.data.data
      : Array.isArray(packagesRes?.data)
      ? packagesRes.data
      : [];
    return raw.map(pkg => ({
      ...pkg,
      name: pkg.package_name || pkg.name || 'Gói tập',
      endDate: pkg.end_date || pkg.endDate,
      registeredDate: pkg.registration_date || pkg.registeredDate,
    }));
  })();
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [renewalMonths, setRenewalMonths] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const renewalPrice = useMemo(() => {
    if (!selectedPkg) return 0;
    return generateRandomRenewalPrice(renewalMonths);
  }, [selectedPkg, renewalMonths]);

  const calculateNewEndDate = () => {
    if (!selectedPkg) return null;
    const currentEndDate = new Date(selectedPkg.endDate);
    const newEndDate = new Date(currentEndDate);
    newEndDate.setMonth(newEndDate.getMonth() + renewalMonths);
    return newEndDate;
  };

  const newEndDate = calculateNewEndDate();

  if (isLoading) {
    return <Loading />;
  }

  if (packages.length === 0) {
    return (
      <div className="space-y-6 max-w-lg mx-auto md:max-w-2xl pb-20 px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gia hạn Gói Tập</h1>
        <div className="rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 p-8 text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Bạn chưa có gói tập nào</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Vui lòng đăng ký một gói tập trước khi gia hạn.</p>
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

  const handleRenewal = async () => {
    if (!selectedPkg || !renewalMonths) {
      toast.error('Vui lòng chọn gói tập và thời gian gia hạn');
      return;
    }

    navigate('/member/renew/checkout', {
      state: {
        renewalData: {
          packageId: selectedPkg.id,
          packageName: selectedPkg.name,
          renewalMonths,
          renewalPrice,
          currentEndDate: selectedPkg.endDate,
          newEndDate: newEndDate.toISOString()
        }
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gia hạn Gói Tập</h1>
            <p className="text-gray-500 text-sm mt-1">Chọn gói tập của bạn và thời gian gia hạn.</p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-900 dark:text-white">Chọn Gói Tập Để Gia Hạn</label>
            <div className="grid gap-3">
              {packages.map((pkg) => {
                const endDate = new Date(pkg.endDate);
                const today = new Date();
                const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
                const isExpired = daysRemaining <= 0;

                return (
                  <label
                    key={pkg.id}
                    onClick={() => setSelectedPkg(pkg)}
                    className={`rounded-xl border-2 p-4 cursor-pointer transition-all relative ${
                      selectedPkg?.id === pkg.id
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-md'
                        : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="renewal-package"
                      checked={selectedPkg?.id === pkg.id}
                      onChange={() => setSelectedPkg(pkg)}
                      className="absolute top-4 right-4 h-5 w-5"
                    />
                    <div className="pr-10">
                      <p className="font-bold text-gray-900 dark:text-white">{pkg.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {isExpired ? (
                          <span className="text-red-600 dark:text-red-400">
                            Đã hết hạn từ {Math.abs(daysRemaining)} ngày trước
                          </span>
                        ) : (
                          <span className="text-green-600 dark:text-green-400">
                            Còn {daysRemaining} ngày ({endDate.toLocaleDateString('vi-VN')})
                          </span>
                        )}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {selectedPkg && (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-900 dark:text-white">
                Chọn Thời Gian Gia Hạn (Tháng)
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-white font-medium flex items-center justify-between hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                >
                  <span>
                    {renewalMonths} {renewalMonths === 1 ? 'tháng' : 'tháng'}
                  </span>
                  <ChevronDown className={`h-5 w-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-950 border-2 border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-10">
                    {renewalMonthOptions.map((months) => (
                      <button
                        key={months}
                        onClick={() => {
                          setRenewalMonths(months);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-900 dark:text-white font-medium first:rounded-t-lg last:rounded-b-lg"
                      >
                        {months} {months === 1 ? 'tháng' : 'tháng'}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedPkg && newEndDate && (
            <div className="rounded-xl bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-200 dark:border-blue-900/30 p-6 space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Tóm tắt gia hạn
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Gói tập</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{selectedPkg.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Thời gian gia hạn</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{renewalMonths} tháng</span>
                </div>
                <div className="border-t border-blue-200 dark:border-blue-900/30 pt-3 flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Hạn kết thúc hiện tại</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {new Date(selectedPkg.endDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Hạn kết thúc mới</span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {newEndDate.toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className="border-t border-blue-200 dark:border-blue-900/30 pt-3 flex justify-between items-center">
                  <span className="text-gray-900 dark:text-white font-semibold">Giá gia hạn</span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {renewalPrice.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>
            </div>
          )}

          {selectedPkg && (
            <Button
              onClick={handleRenewal}
              className="w-full h-14 text-lg font-bold rounded-xl shadow-blue-500/25 shadow-lg"
              leftIcon={<ShoppingCart className="h-5 w-5" />}
              rightIcon={<ArrowRight className="h-5 w-5 opacity-70" />}
            >
              Thanh Toán Gia Hạn
            </Button>
          )}
        </div>

        {selectedPkg && (
          <div className="hidden lg:block">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-lg shadow-gray-200/50 dark:border-gray-800 dark:bg-gray-950 dark:shadow-none sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Chi tiết {selectedPkg.name}</h2>

              {selectedPkg.facilities && selectedPkg.facilities.length > 0 && (
                <div className="space-y-4 mt-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Quyền lợi bao gồm
                  </h3>
                  <ul className="space-y-3">
                    {selectedPkg.facilities.map((fac, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        {fac}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Ngày đăng ký:{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {new Date(selectedPkg.registeredDate).toLocaleDateString('vi-VN')}
                  </span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Giá gốc:{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {typeof selectedPkg.price === 'number' ? selectedPkg.price.toLocaleString('vi-VN') : selectedPkg.price} đ
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RenewPackage;
