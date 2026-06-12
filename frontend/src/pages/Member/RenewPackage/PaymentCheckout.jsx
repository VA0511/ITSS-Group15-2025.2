import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  Wallet,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Landmark,
} from "lucide-react";
import Button from "@/components/Common/Button";
import { toast } from "@/utils/toast";
import { useRenewPackage } from "@/hooks/mutations/usePackageMutations";
import { useTranslation } from 'react-i18next';

const PaymentCheckout = () => {
  const { t, i18n } = useTranslation('member');
  const locale = i18n.language === 'ja' ? 'ja-JP' : i18n.language === 'en' ? 'en-US' : 'vi-VN';
  const { state } = useLocation();
  const navigate = useNavigate();
  const renewPackageMutation = useRenewPackage();

  // Check if this is a renewal or new registration
  const isRenewal = !!state?.renewalData;
  
  // Dữ liệu gói tập từ trang trước truyền sang (nếu không có thì trả về mặc định)
  const selectedPkg = isRenewal ? state.renewalData : (state?.package || {
    id: 0,
    name: "Gói tập không xác định",
    price: "0 đ",
    description: "Không có thông tin gói.",
  });

  const [paymentMethod, setPaymentMethod] = useState("vnpay");
  const [isProcessing, setIsProcessing] = useState(false);

  // Xử lý tính toán giá tiền
  const priceValue = isRenewal ? selectedPkg.renewalPrice : (parseInt(String(selectedPkg.price ?? 0).replace(/[^\d]/g, ""), 10) || 0);
  const vat = priceValue * 0.1; // VAT 10%
  const totalAmount = priceValue + vat;

  const handleCheckout = async () => {
    setIsProcessing(true);
    
    try {
      if (isRenewal) {
        // Call renewal mutation for renewals
        await renewPackageMutation.mutateAsync({
          packageId: selectedPkg.packageId,
          packageName: selectedPkg.packageName,
          renewalMonths: selectedPkg.renewalMonths,
          renewalPrice: selectedPkg.renewalPrice,
          currentEndDate: selectedPkg.currentEndDate,
          newEndDate: selectedPkg.newEndDate,
          paymentMethod,
        });
        toast.success(t('checkout.processing'));
      } else {
        // Simulate payment processing for new registrations
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success(t('checkout.processing'));
      }
      
      navigate("/member/my-package");
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(t('checkout.payment_failed'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link to={isRenewal ? "/member/renew" : "/member/register"}>
          <Button variant="outline" size="icon" className="shrink-0 h-10 w-10">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {isRenewal ? t('checkout.title_renew') : t('checkout.title_register')}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('checkout.subtitle')}
          </p>
        </div>
      </div>

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
                  {isRenewal ? t('checkout.order_renewal_label') : t('checkout.order_package_label')}
                </span>
                <span className="font-bold text-gray-900 dark:text-white text-right break-words w-1/2">
                  {selectedPkg.packageName || selectedPkg.name}
                </span>
              </div>
              {isRenewal && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('checkout.order_months')}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{t('checkout.order_months_value', { count: selectedPkg.renewalMonths })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('checkout.order_current_end')}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{new Date(selectedPkg.currentEndDate).toLocaleDateString(locale)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('checkout.order_new_end_renewal')}</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">{new Date(selectedPkg.newEndDate).toLocaleDateString(locale)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('checkout.order_subtotal')}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{priceValue.toLocaleString(locale)} đ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('checkout.order_vat')}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{vat.toLocaleString(locale)} đ</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-base font-bold text-gray-900 dark:text-white">{t('checkout.order_total')}</span>
                <span className="text-xl font-black text-blue-600 dark:text-blue-400">{totalAmount.toLocaleString(locale)} đ</span>
              </div>
            </div>

            <Button
              className="w-full font-bold shadow-lg"
              size="lg"
              onClick={handleCheckout}
              disabled={isProcessing || renewPackageMutation.isPending}
              leftIcon={isProcessing || renewPackageMutation.isPending ? undefined : <ShieldCheck className="h-5 w-5" />}
            >
              {isProcessing || renewPackageMutation.isPending ? t('checkout.processing') : t('checkout.confirm_btn')}
            </Button>

            <p className="text-xs text-center text-gray-500 mt-4 leading-relaxed">{t('checkout.legal_note')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCheckout;
