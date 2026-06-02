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
import { useTranslation } from 'react-i18next';

const RegisterGymPackageCheckout = () => {
  const { t, i18n } = useTranslation('member');
  const locale = i18n.language === 'ja' ? 'ja-JP' : i18n.language === 'en' ? 'en-US' : 'vi-VN';
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
          <p className="text-red-600 dark:text-red-400">{t('checkout.no_package_error')}</p>
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
        toast.success(`Nâng cấp thành công! Gói VIP có hiệu lực đến ${upgradeCalc.newEndDate.toLocaleDateString(locale)}.`);
      } else {
        await registerPackageMutation.mutateAsync({
          ...selectedPackage,
          paymentMethod,
          registrationDate: new Date().toISOString(),
        });
        toast.success(t('checkout.processing'));
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
            {t('checkout.title_register')}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('checkout.subtitle')}
          </p>
        </div>
      </div>

      {isUpgrade && activePackageName && (
        <div className="mb-6 rounded-xl border border-blue-300 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-700 p-4 flex items-start gap-3">
          <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">{t('checkout.upgrade_banner_title')}</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              {t('checkout.upgrade_banner_from_to', { from: activePackageName, to: selectedPackage?.name })}
              {upgradeCalc && upgradeCalc.extraDays > 0 && (
                <> {t('checkout.upgrade_extra_days', { remaining: upgradeCalc.remainingDays, extra: upgradeCalc.extraDays })}</>
              )}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Payment Methods */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">{t('checkout.payment_section_title')}</h2>

            <div className="space-y-4">
              <label className={`relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-950 ${paymentMethod === "vnpay" ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-300 dark:border-gray-800"}`}>
                <input type="radio" name="paymentMethod" value="vnpay" className="sr-only" checked={paymentMethod === "vnpay"} onChange={(e) => setPaymentMethod(e.target.value)} />
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600"><Smartphone className="h-5 w-5" /></div>
                    <div><p className="font-medium text-sm text-gray-900 dark:text-white">{t('checkout.vnpay_name')}</p><p className="text-gray-500 text-xs">{t('checkout.vnpay_desc')}</p></div>
                  </div>
                  {paymentMethod === "vnpay" && <CheckCircle2 className="h-5 w-5 text-blue-600" />}
                </div>
              </label>

              <label className={`relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-950 ${paymentMethod === "momo" ? "border-pink-500 ring-1 ring-pink-500" : "border-gray-300 dark:border-gray-800"}`}>
                <input type="radio" name="paymentMethod" value="momo" className="sr-only" checked={paymentMethod === "momo"} onChange={(e) => setPaymentMethod(e.target.value)} />
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center text-pink-600"><Wallet className="h-5 w-5" /></div>
                    <div><p className="font-medium text-sm text-gray-900 dark:text-white">{t('checkout.momo_name')}</p><p className="text-gray-500 text-xs">{t('checkout.momo_desc')}</p></div>
                  </div>
                  {paymentMethod === "momo" && <CheckCircle2 className="h-5 w-5 text-pink-600" />}
                </div>
              </label>

              <label className={`relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-950 ${paymentMethod === "card" ? "border-indigo-500 ring-1 ring-indigo-500" : "border-gray-300 dark:border-gray-800"}`}>
                <input type="radio" name="paymentMethod" value="card" className="sr-only" checked={paymentMethod === "card"} onChange={(e) => setPaymentMethod(e.target.value)} />
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600"><CreditCard className="h-5 w-5" /></div>
                    <div><p className="font-medium text-sm text-gray-900 dark:text-white">{t('checkout.card_name')}</p><p className="text-gray-500 text-xs">{t('checkout.card_desc')}</p></div>
                  </div>
                  {paymentMethod === "card" && <CheckCircle2 className="h-5 w-5 text-indigo-600" />}
                </div>
              </label>

              <label className={`relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-950 ${paymentMethod === "bank" ? "border-green-500 ring-1 ring-green-500" : "border-gray-300 dark:border-gray-800"}`}>
                <input type="radio" name="paymentMethod" value="bank" className="sr-only" checked={paymentMethod === "bank"} onChange={(e) => setPaymentMethod(e.target.value)} />
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600"><Landmark className="h-5 w-5" /></div>
                    <div><p className="font-medium text-sm text-gray-900 dark:text-white">{t('checkout.bank_name')}</p><p className="text-gray-500 text-xs">{t('checkout.bank_desc')}</p></div>
                  </div>
                  {paymentMethod === "bank" && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                </div>
              </label>
            </div>

            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center">
              {paymentMethod === "vnpay" && (
                <div className="text-center space-y-4">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="VNPay QR" className="w-40 h-40 mx-auto bg-white p-2 rounded-lg shadow-sm" />
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('checkout.vnpay_qr_label')}</p>
                  <p className="text-xs text-gray-500">{t('checkout.vnpay_scan')}</p>
                </div>
              )}
              {paymentMethod === "momo" && (
                <div className="text-center space-y-4">
                  <div className="w-40 h-40 mx-auto bg-pink-100 dark:bg-pink-900/20 rounded-xl flex items-center justify-center border-2 border-pink-200 dark:border-pink-800 shadow-sm p-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="MoMo QR" className="w-full h-full rounded-lg mix-blend-multiply" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('checkout.momo_qr_label')}</p>
                  <p className="text-xs text-gray-500">{t('checkout.momo_scan')}</p>
                </div>
              )}
              {paymentMethod === "card" && (
                <div className="w-full max-w-sm space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">{t('checkout.card_number')}</label>
                    <input type="text" placeholder="0000 0000 0000 0000" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm sm:text-sm dark:bg-gray-800 p-2 border" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">{t('checkout.card_expiry')}</label>
                      <input type="text" placeholder="MM/YY" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm sm:text-sm dark:bg-gray-800 p-2 border" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">{t('checkout.card_cvc')}</label>
                      <input type="text" placeholder="123" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm sm:text-sm dark:bg-gray-800 p-2 border" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">{t('checkout.card_holder')}</label>
                    <input type="text" placeholder="NGUYEN VAN A" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm sm:text-sm dark:bg-gray-800 p-2 border uppercase" />
                  </div>
                </div>
              )}
              {paymentMethod === "bank" && (
                <div className="w-full max-w-sm space-y-4 text-center">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-green-200 dark:border-green-900/30 space-y-4">
                    <p className="font-semibold text-gray-900 dark:text-white">{t('checkout.bank_info_title')}</p>
                    <div className="space-y-3 text-sm bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                      <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">{t('checkout.bank_name_label')}</span><span className="font-semibold text-gray-900 dark:text-white">VietComBank</span></div>
                      <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">{t('checkout.bank_account_label')}</span><span className="font-semibold text-gray-900 dark:text-white">0123456789</span></div>
                      <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">{t('checkout.bank_owner_label')}</span><span className="font-semibold text-gray-900 dark:text-white">Active Gym</span></div>
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between"><span className="text-gray-600 dark:text-gray-400">{t('checkout.bank_content_label')}</span><span className="font-semibold text-gray-900 dark:text-white text-xs">GYM-[Mã HV]</span></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">{t('checkout.bank_note')}</p>
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
              {t('checkout.order_summary_title')}
            </h2>

            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between items-start">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  {isUpgrade ? t('checkout.order_upgrade_label') : t('checkout.order_package_label')}
                </span>
                <span className="font-bold text-gray-900 dark:text-white text-right break-words w-1/2">{selectedPackage?.name}</span>
              </div>

              {isUpgrade && upgradeCalc ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('checkout.order_vip_duration')}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{upgradeCalc.vipDuration} {t('checkout.days_label')}</span>
                  </div>
                  {upgradeCalc.extraDays > 0 && (
                    <div className="flex justify-between items-center p-2.5 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800">
                      <span className="text-green-700 dark:text-green-400 flex items-center gap-1.5">
                        <Gift className="h-3.5 w-3.5" />
                        {t('checkout.order_extra_days', { remaining: upgradeCalc.remainingDays })}
                      </span>
                      <span className="font-bold text-green-700 dark:text-green-400">+{upgradeCalc.extraDays} {t('checkout.days_label')}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-600 dark:text-gray-400">{t('checkout.order_total_duration')}</span>
                    <span className="text-blue-600 dark:text-blue-400">{upgradeCalc.vipDuration + upgradeCalc.extraDays} {t('checkout.days_label')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('checkout.order_new_end')}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{upgradeCalc.newEndDate.toLocaleDateString(locale)}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('checkout.order_payment')}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{priceValue.toLocaleString(locale)} đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('checkout.order_vat')}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{vat.toLocaleString(locale)} đ</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('checkout.order_subtotal')}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{priceValue.toLocaleString(locale)} đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('checkout.order_vat')}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{vat.toLocaleString(locale)} đ</span>
                  </div>
                </>
              )}

              <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-base font-bold text-gray-900 dark:text-white">{t('checkout.order_total')}</span>
                <span className="text-xl font-black text-blue-600 dark:text-blue-400">{totalAmount.toLocaleString(locale)} đ</span>
              </div>
            </div>

            <Button
              className="w-full font-bold shadow-lg"
              size="lg"
              onClick={handlePayment}
              disabled={isProcessing || registerPackageMutation.isPending || upgradePackageMutation.isPending}
              leftIcon={isProcessing || registerPackageMutation.isPending || upgradePackageMutation.isPending ? undefined : <ShieldCheck className="h-5 w-5" />}
            >
              {isProcessing || registerPackageMutation.isPending || upgradePackageMutation.isPending
                ? t('checkout.processing')
                : isUpgrade ? t('checkout.confirm_upgrade_btn') : t('checkout.confirm_btn')}
            </Button>

            <p className="text-xs text-center text-gray-500 mt-4 leading-relaxed">{t('checkout.legal_note')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterGymPackageCheckout;
