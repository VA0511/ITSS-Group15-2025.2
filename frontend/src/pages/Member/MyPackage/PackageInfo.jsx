import React from 'react';
import { CreditCard, CheckCircle2, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMemberPackages } from '@/hooks/queries/usePackages';
import Loading from '@/components/Common/Loading';
import { useNavigate } from 'react-router-dom';

const PackageInfo = () => {
  const { t, i18n } = useTranslation('member');
  const { data: rawData = [], isLoading, error } = useMemberPackages();
  const navigate = useNavigate();

  const locale = i18n.language === 'ja' ? 'ja-JP' : i18n.language === 'en' ? 'en-US' : 'vi-VN';

  if (isLoading) {
    return <Loading />;
  }

  const allPackages = Array.isArray(rawData)
    ? rawData
    : Array.isArray(rawData?.data?.data)
    ? rawData.data.data
    : Array.isArray(rawData?.data)
    ? rawData.data
    : [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const packages = allPackages.filter(p => {
    const isActive = p.status === 'active' || p.status === 'Active';
    const endDateStr = p.end_date || p.endDate;
    const notExpired = !endDateStr || new Date(endDateStr) >= today;
    return isActive && notExpired;
  });

  if (error) {
    return (
      <div className="max-w-lg mx-auto md:max-w-2xl pb-20 px-4">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-900/10">
          <p className="text-red-600 dark:text-red-400">{t('package.error_load')}</p>
        </div>
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className="space-y-6 max-w-lg mx-auto md:max-w-2xl pb-20 px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('package.title')}</h1>

        <div className="rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 p-8 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('package.no_package')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{t('package.no_package_desc')}</p>
          <button
            onClick={() => navigate('/member/register')}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            {t('package.register_btn')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto md:max-w-2xl pb-20 px-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('package.title')}</h1>

      {packages.map((pkg) => {
        const pkgName = pkg.package_name || pkg.name;
        const isActive = pkg.status === 'active' || pkg.status === 'Active';
        const endDateStr = pkg.end_date || pkg.endDate;
        const endDate = endDateStr ? new Date(endDateStr) : null;
        const now = new Date();
        const daysRemaining = endDate && !isNaN(endDate) ? Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)) : null;
        const price = pkg.price ? (typeof pkg.price === 'number' ? pkg.price.toLocaleString(locale) + ' đ' : pkg.price) : '0 đ';

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
                {t('package.active_badge')}
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
                  {t('package.expiry_label')}
                </p>
                <p className={`font-bold text-xl mt-1 ${
                  isActive
                    ? 'text-emerald-900 dark:text-emerald-200'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {endDate ? endDate.toLocaleDateString(locale) : t('package.expiry_unknown')}
                </p>
                <p className={`text-xs mt-1 ${
                  isActive ? 'text-emerald-600' : 'text-gray-500'
                }`}>
                  {daysRemaining === null
                    ? ''
                    : daysRemaining > 0
                    ? t('package.days_remaining', { count: daysRemaining })
                    : t('package.days_expired')}
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
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t('package.more_packages')}</h3>
        <button
          onClick={() => navigate('/member/register')}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors mt-4"
        >
          {t('package.register_new_btn')}
        </button>
      </div>
    </div>
  );
};

export default PackageInfo;
