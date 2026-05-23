import React, { useMemo, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CreditCard,
  Wallet,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Landmark,
  TrendingUp,
  Gift,
} from 'lucide-react';
import Button from '@/components/Common/Button';
import { toast } from '@/utils/toast';
import { useRegisterPackage, useUpgradePackage } from '@/hooks/mutations/usePackageMutations';

const RegisterGymPackageCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPackage = location.state?.package;
  const isUpgrade = location.state?.isUpgrade;
  const activePackageName = location.state?.activePackageName;
  const activeSubscription = location.state?.activeSubscription;
  const [paymentMethod, setPaymentMethod] = useState('vnpay');
  const [isProcessing, setIsProcessing] = useState(false);

  const registerPackageMutation = useRegisterPackage();
  const upgradePackageMutation = useUpgradePackage();

  // Pro-rate calculation: remaining value of old package → extra VIP days
  const upgradeCalc = useMemo(() => {
    if (!isUpgrade || !activeSubscription) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const oldEnd = new Date(activeSubscription.end_date || activeSubscription.endDate);
    const remainingDays = Math.max(0, Math.ceil((oldEnd - today) / (1000 * 60 * 60 * 24)));
    const oldStart = new Date(activeSubscription.start_date || activeSubscription.startDate || activeSubscription.registration_date);
    const oldDuration = Math.max(1, Math.ceil((oldEnd - oldStart) / (1000 * 60 * 60 * 24)));
    const oldDailyRate = (activeSubscription.price || 0) / oldDuration;
    const remainingValue = remainingDays * oldDailyRate;
    const vipDuration = selectedPackage?.duration_days || selectedPackage?.duration || 30;
    const vipPrice = selectedPackage?.price || 0;
    const vipDailyRate = vipDuration > 0 ? vipPrice / vipDuration : 0;
    const extraDays = vipDailyRate > 0 ? Math.floor(remainingValue / vipDailyRate) : remainingDays;
    const newEnd = new Date();
    newEnd.setDate(newEnd.getDate() + vipDuration + extraDays);
    return { remainingDays, remainingValue: Math.round(remainingValue), extraDays, newEndDate: newEnd, vipDuration };
  }, [isUpgrade, activeSubscription, selectedPackage]);

  // Xử lý tính toán giá tiền
  const priceValue = parseInt(String(selectedPackage?.price ?? 0).replace(/[^\d]/g, ""), 10) || 0;
  const vat = priceValue * 0.1; // VAT 10%
  const totalAmount = priceValue + vat;

  if (!selectedPackage) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-900/10">
          <p className="text-red-600 dark:text-red-400">Vui lòng chọn gói tập trước khi thanh toán.</p>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    if (isProcessing || registerPackageMutation.isPending || upgradePackageMutation.isPending) return;
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isUpgrade && activeSubscription && upgradeCalc) {
        await upgradePackageMutation.mutateAsync({
          subscriptionId: activeSubscription.id,
          newPackageId: selectedPackage.id,
          newEndDate: upgradeCalc.newEndDate.toISOString(),
        });
        toast.success(`Nâng cấp thành công! Gói VIP có hiệu lực đến ${upgradeCalc.newEndDate.toLocaleDateString('vi-VN')}.`);
      } else {
        await registerPackageMutation.mutateAsync({
          ...selectedPackage,
          paymentMethod,
          registrationDate: new Date().toISOString(),
        });
        toast.success("Thanh toán thành công! Gói tập đã được kích hoạt.");
      }
      navigate("/member/my-package");
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Thanh toán thất bại. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/member/register">
          <Button variant="outline" size="icon" className="shrink-0 h-10 w-10">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Thanh toán gói tập
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Vui lòng kiểm tra thông tin đơn hàng và chọn phương thức thanh toán.
          </p>
        </div>
      </div>

      {isUpgrade && activePackageName && (
        <div className="mb-6 rounded-xl border border-blue-300 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-700 p-4 flex items-start gap-3">
          <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">Nâng cấp gói tập</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Nâng cấp từ <strong>{activePackageName}</strong> lên <strong>{selectedPackage?.name}</strong>.
              {upgradeCalc && upgradeCalc.extraDays > 0 && (
                <> {upgradeCalc.remainingDays} ngày còn lại được quy đổi thành <strong>{upgradeCalc.extraDays} ngày VIP</strong> cộng thêm.</>
              )}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Payment Methods */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              Chọn phương thức thanh toán
            </h2>

            <div className="space-y-4">
              {/* VNPay Option */}
              <label
                className={`relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none dark:bg-gray-950 ${
                  paymentMethod === "vnpay"
                    ? "border-blue-500 ring-1 ring-blue-500"
                    : "border-gray-300 dark:border-gray-800"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="vnpay"
                  className="sr-only"
                  checked={paymentMethod === "vnpay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-sm flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                        <Smartphone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Thanh toán qua VNPAY-QR
                        </p>
                        <p className="text-gray-500 text-xs">
                          Quét mã QR qua ứng dụng ngân hàng
                        </p>
                      </div>
                    </div>
                  </div>
                  {paymentMethod === "vnpay" && (
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  )}
                </div>
              </label>

              {/* MoMo Option */}
              <label
                className={`relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none dark:bg-gray-950 ${
                  paymentMethod === "momo"
                    ? "border-pink-500 ring-1 ring-pink-500"
                    : "border-gray-300 dark:border-gray-800"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="momo"
                  className="sr-only"
                  checked={paymentMethod === "momo"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-sm flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center text-pink-600">
                        <Wallet className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Ví điện tử MoMo
                        </p>
                        <p className="text-gray-500 text-xs">
                          Thanh toán liền tay bằng ứng dụng MoMo
                        </p>
                      </div>
                    </div>
                  </div>
                  {paymentMethod === "momo" && (
                    <CheckCircle2 className="h-5 w-5 text-pink-600" />
                  )}
                </div>
              </label>

              {/* Credit Card Option */}
              <label
                className={`relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none dark:bg-gray-950 ${
                  paymentMethod === "card"
                    ? "border-indigo-500 ring-1 ring-indigo-500"
                    : "border-gray-300 dark:border-gray-800"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  className="sr-only"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-sm flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Thẻ tín dụng / Thẻ ghi nợ
                        </p>
                        <p className="text-gray-500 text-xs">
                          Hỗ trợ VISA, MasterCard, JCB
                        </p>
                      </div>
                    </div>
                  </div>
                  {paymentMethod === "card" && (
                    <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                  )}
                </div>
              </label>

              {/* Online Banking Option */}
              <label
                className={`relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none dark:bg-gray-950 ${
                  paymentMethod === "bank"
                    ? "border-green-500 ring-1 ring-green-500"
                    : "border-gray-300 dark:border-gray-800"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank"
                  className="sr-only"
                  checked={paymentMethod === "bank"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-sm flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                        <Landmark className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Chuyển khoản Ngân Hàng
                        </p>
                        <p className="text-gray-500 text-xs">
                          Chuyển tiền vào tài khoản ngân hàng
                        </p>
                      </div>
                    </div>
                  </div>
                  {paymentMethod === "bank" && (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                </div>
              </label>
            </div>

            {/* Dynamic UI depending on selection (Mock QR / Form) */}
            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center">
              {paymentMethod === "vnpay" && (
                <div className="text-center space-y-4">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                    alt="VNPay QR"
                    className="w-40 h-40 mx-auto bg-white p-2 rounded-lg shadow-sm"
                  />
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mã QR VNPAY (Demo)
                  </p>
                  <p className="text-xs text-gray-500">
                    Dùng ứng dụng ngân hàng quét mã để thanh toán ngay.
                  </p>
                </div>
              )}
              {paymentMethod === "momo" && (
                <div className="text-center space-y-4">
                  <div className="w-40 h-40 mx-auto bg-pink-100 dark:bg-pink-900/20 rounded-xl flex items-center justify-center border-2 border-pink-200 dark:border-pink-800 shadow-sm p-2">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                      alt="MoMo QR"
                      className="w-full h-full rounded-lg mix-blend-multiply"
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mã QR MoMo (Demo)
                  </p>
                  <p className="text-xs text-gray-500">
                    Mở ứng dụng MoMo và chọn mục Quét Mã.
                  </p>
                </div>
              )}
              {paymentMethod === "card" && (
                <div className="w-full max-w-sm space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 flex justify-between">
                      <span>Số thẻ</span>
                    </label>
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 p-2 border"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                        Ngày hết hạn
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 p-2 border"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                        CVC/CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 p-2 border"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                      Tên in trên thẻ
                    </label>
                    <input
                      type="text"
                      placeholder="NGUYEN VAN A"
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 p-2 border uppercase"
                    />
                  </div>
                </div>
              )}
              {paymentMethod === "bank" && (
                <div className="w-full max-w-sm space-y-4 text-center">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-green-200 dark:border-green-900/30 space-y-4">
                    <p className="font-semibold text-gray-900 dark:text-white">Thông tin chuyển khoản</p>
                    <div className="space-y-3 text-sm bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Tên ngân hàng:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">VietComBank</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Số tài khoản:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">0123456789</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Chủ tài khoản:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">Active Gym</span>
                      </div>
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Nội dung chuyển:</span>
                        <span className="font-semibold text-gray-900 dark:text-white text-xs">GYM-[Mã HV]</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                      Vui lòng nhập mã hội viên vào nội dung chuyển để xác nhân thanh toán
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b pb-4 dark:border-gray-800">
              Tóm tắt đơn hàng
            </h2>

            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between items-start">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  {isUpgrade ? 'Nâng cấp lên:' : 'Gói tập:'}
                </span>
                <span className="font-bold text-gray-900 dark:text-white text-right break-words w-1/2">
                  {selectedPackage?.name}
                </span>
              </div>

              {isUpgrade && upgradeCalc ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Thời hạn VIP mới:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{upgradeCalc.vipDuration} ngày</span>
                  </div>
                  {upgradeCalc.extraDays > 0 && (
                    <div className="flex justify-between items-center p-2.5 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800">
                      <span className="text-green-700 dark:text-green-400 flex items-center gap-1.5">
                        <Gift className="h-3.5 w-3.5" />
                        Cộng thêm ({upgradeCalc.remainingDays} ngày cũ):
                      </span>
                      <span className="font-bold text-green-700 dark:text-green-400">+{upgradeCalc.extraDays} ngày</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-600 dark:text-gray-400">Tổng thời hạn:</span>
                    <span className="text-blue-600 dark:text-blue-400">{upgradeCalc.vipDuration + upgradeCalc.extraDays} ngày</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Hết hạn mới:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{upgradeCalc.newEndDate.toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Thanh toán:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{priceValue.toLocaleString("vi-VN")} đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Thuế (VAT 10%):</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{vat.toLocaleString("vi-VN")} đ</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tạm tính:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{priceValue.toLocaleString("vi-VN")} đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Thuế (VAT 10%):</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{vat.toLocaleString("vi-VN")} đ</span>
                  </div>
                </>
              )}

              <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-base font-bold text-gray-900 dark:text-white">
                  Tổng thanh toán:
                </span>
                <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                  {totalAmount.toLocaleString("vi-VN")} đ
                </span>
              </div>
            </div>

            <Button
              className="w-full font-bold shadow-lg"
              size="lg"
              onClick={handlePayment}
              disabled={isProcessing || registerPackageMutation.isPending || upgradePackageMutation.isPending}
              leftIcon={
                isProcessing || registerPackageMutation.isPending || upgradePackageMutation.isPending
                  ? undefined : <ShieldCheck className="h-5 w-5" />
              }
            >
              {isProcessing || registerPackageMutation.isPending || upgradePackageMutation.isPending
                ? "Đang xử lý..." : isUpgrade ? "Xác nhận Nâng Cấp" : "Xác nhận & Hoàn tất"}
            </Button>

            <p className="text-xs text-center text-gray-500 mt-4 leading-relaxed">
              Bằng việc nhấn "Xác nhận & Hoàn tất", bạn đồng ý với Điều khoản
              dịch vụ & Chính sách bảo mật của chúng tôi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterGymPackageCheckout;
