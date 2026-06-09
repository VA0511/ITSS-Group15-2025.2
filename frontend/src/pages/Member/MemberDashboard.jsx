import React, { useEffect, useState } from 'react';
import { QrCode, Calendar, Activity, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import useAuthStore from '@/store/useAuthStore';
import { memberService } from '@/services/memberService';
import { packageService } from '@/services/packageService';
import { trainingService } from '@/services/trainingService';
import { toast } from '@/utils/toast';
import {
  slideUpVariants, cardVariants, staggerContainerVariants,
  fadeInVariants, sectionStaggerVariants,
} from '@/lib/animations';

const MemberDashboard = () => {
  const { t, i18n } = useTranslation('member');
  const { user } = useAuthStore();
  const [member, setMember] = useState(null);
  const [activePackage, setActivePackage] = useState(null);
  const [nextWorkout, setNextWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  const locale = i18n.language === 'ja' ? 'ja-JP' : i18n.language === 'en' ? 'en-US' : 'vi-VN';

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const memberRes = await memberService.getMemberByAccountId(user.id);
        setMember(memberRes);

        const packagesRes = await packageService.getMemberPackages();
        const packages = Array.isArray(packagesRes)
          ? packagesRes
          : Array.isArray(packagesRes?.data?.data)
          ? packagesRes.data.data
          : Array.isArray(packagesRes?.data)
          ? packagesRes.data
          : [];
        const active = packages.find(pkg => pkg.status === 'active' || pkg.status === 'Active');
        setActivePackage(active);

        try {
          const sessionsRes = await trainingService.getSessions();
          const sessions = Array.isArray(sessionsRes?.data) ? sessionsRes.data : [];
          const now = new Date();
          const upcoming = sessions
            .filter(s => new Date(s.session_time) > now)
            .sort((a, b) => new Date(a.session_time) - new Date(b.session_time));
          if (upcoming.length > 0) setNextWorkout(upcoming[0]);
        } catch {
          // Training sessions optional
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error(t('dashboard.error_load'));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }) + ' ' +
           date.toLocaleDateString(locale, { weekday: 'long', day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto md:max-w-full pb-20">
      {user?.isFirstLogin && (
        <motion.div
          variants={fadeInVariants}
          className="flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20"
        >
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">{t('dashboard.temp_password_warning')}</p>
            <p className="mt-0.5 text-sm text-yellow-700 dark:text-yellow-400">{t('dashboard.temp_password_desc')}</p>
          </div>
          <Link
            to="/member/change-password"
            className="flex-shrink-0 rounded-lg bg-yellow-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-yellow-700"
          >
            {t('dashboard.temp_password_btn')}
          </Link>
        </motion.div>
      )}

      <motion.div variants={slideUpVariants} className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {t('dashboard.greeting', { name: member?.full_name || user?.username })}
        </h1>

      </motion.div>

      <motion.div
        variants={slideUpVariants}
        whileHover={{ scale: 1.01 }}
        className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 shadow-lg text-white text-center relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
        <h2 className="font-medium text-blue-100 mb-4 tracking-wider text-sm">{t('dashboard.member_card_title')}</h2>
        <div className="bg-white p-4 rounded-xl inline-block mx-auto mb-4 shadow-sm">
          <QrCode className="h-40 w-40 text-gray-900" />
        </div>
        <p className="font-mono text-xl tracking-widest font-bold">MEM-{member?.id || '000000'}</p>
        <p className="text-sm text-blue-200 mt-2">{t('dashboard.member_card_hint')}</p>
      </motion.div>

      <motion.div
        variants={staggerContainerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <motion.div
          variants={cardVariants}
          custom={0}
          whileHover={{ scale: 1.02, y: -3 }}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950"
        >
          <Calendar className="h-8 w-8 text-blue-500 mb-3" />
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">{t('dashboard.package_card_label')}</p>
          <p className="font-bold text-gray-900 dark:text-white text-base mb-3 line-clamp-2">
            {activePackage?.package_name || activePackage?.name || t('dashboard.package_none')}
          </p>
          {activePackage && (
            <div className="mb-4">
              <p className="text-xs text-gray-600 dark:text-gray-400">{t('dashboard.package_expiry')}</p>
              <p className="font-bold text-gray-900 dark:text-white text-lg">
                {new Date(activePackage.end_date).toLocaleDateString(locale)}
              </p>
            </div>
          )}
          <Link
            to={activePackage ? '/member/renew' : '/member/register'}
            className="inline-block text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-semibold underline"
          >
            {activePackage ? t('dashboard.package_renew') : t('dashboard.package_register')}
          </Link>
        </motion.div>

        <motion.div
          variants={cardVariants}
          custom={1}
          whileHover={{ scale: 1.02, y: -3 }}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950"
        >
          <Activity className="h-8 w-8 text-green-500 mb-3" />
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">{t('dashboard.next_workout_label')}</p>
          {nextWorkout ? (
            <>
              <p className="font-bold text-gray-900 dark:text-white text-base mb-2">
                {formatDateTime(nextWorkout.session_time)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {nextWorkout.pt_feedback ? t('dashboard.next_workout_guide') : t('dashboard.next_workout_personal')}
              </p>
              {nextWorkout.member_confirmed ? (
                <div className="flex items-center gap-2 text-xs text-green-600 font-bold bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg w-fit mb-3">
                  <CheckCircle2 className="h-4 w-4" /> {t('dashboard.next_workout_confirmed')}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-amber-600 font-bold bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-lg w-fit">
                    <Activity className="h-4 w-4" /> {t('dashboard.next_workout_pending')}
                  </div>
                  <Link
                    to="/member/schedule"
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-lg transition-colors shadow-sm"
                  >
                    {t('dashboard.next_workout_confirm_btn')}
                  </Link>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-500 mb-4 italic">{t('dashboard.no_upcoming')}</p>
          )}
          <Link
            to="/member/schedule"
            className="inline-block text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-semibold underline"
          >
            {t('dashboard.view_schedule')}
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MemberDashboard;
