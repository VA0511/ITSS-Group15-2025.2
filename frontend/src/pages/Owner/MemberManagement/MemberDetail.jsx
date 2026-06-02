import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Activity, DollarSign, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
import Button from '@/components/Common/Button';
import { useMemberDetails, useMemberSubscriptionHistory } from '@/hooks/queries/useMembers';

const MemberDetail = () => {
  const { t } = useTranslation('owner');
  const { id } = useParams();
  const { data: member, isLoading: memberLoading, isError: memberError } = useMemberDetails(id);
  const { data: historyResponse, isLoading: historyLoading } = useMemberSubscriptionHistory(id, 1, 5);

  if (memberLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center gap-4">
          <Link to="/owner/members">
            <Button variant="outline" size="icon" className="shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{t('member.detail.title')}</h1>
            <p className="mt-1 text-sm text-gray-500">{t('member.detail.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (memberError || !member) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center gap-4">
          <Link to="/owner/members">
            <Button variant="outline" size="icon" className="shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{t('member.detail.title')}</h1>
            <p className="mt-1 text-sm text-red-500">{t('member.detail.load_error')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link to="/owner/members">
            <Button variant="outline" size="icon" className="shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{t('member.detail.title')}</h1>
            <p className="mt-1 text-sm text-gray-500">{t('member.detail.subtitle', { name: member.full_name || t('member.detail.default_name') })}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Info Card */}
        <div className="col-span-1 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="flex flex-col items-center border-b border-gray-100 pb-6 dark:border-gray-800">
            <img
              src={member.avatar ? `${API_URL}${member.avatar}` : ((member.gender || '').toLowerCase() === 'nữ' ? '/src/assets/nu_ava.jpg' : '/src/assets/nam_ava.jpg')}
              alt="avatar"
              className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-sm dark:border-gray-900"
            />
            <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{member.full_name || 'N/A'}</h2>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">MEM-{member.id || id}</p>
            <span className={`mt-3 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
              member.status === 'active' ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {member.status === 'active' ? t('member.detail.status.active') : t('member.detail.status.inactive')}
            </span>
          </div>
          <div className="mt-6 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('member.detail.info.phone')}</p>
              <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{member.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('member.detail.info.email')}</p>
              <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{member.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('member.detail.info.join_date')}</p>
              <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {(member.joinDate || member.registered_at) ? new Date(member.joinDate || member.registered_at).toLocaleDateString('vi-VN') : 'N/A'}
              </p>
            </div>
            {member.roadmap_goal && (
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('member.detail.info.goal')}</p>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100 whitespace-pre-line">{member.roadmap_goal}</p>
              </div>
            )}
            {member.member_free_schedule && (
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('member.detail.info.free_schedule')}</p>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100 whitespace-pre-line">{member.member_free_schedule}</p>
              </div>
            )}
          </div>
        </div>

        {/* History / Package Content */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-4">
              <CalendarDays className="h-5 w-5 text-blue-500" /> {t('member.detail.package.title')}
            </h3>
            <div className="rounded-lg bg-gray-50 p-4 border border-gray-100 dark:bg-gray-900/50 dark:border-gray-800 flex justify-between items-center">
               <div>
                 <div className="flex items-center gap-3">
                   <p className="font-bold text-lg text-gray-900 dark:text-white">
                     {member.package || t('member.detail.package.no_package')}
                   </p>
                   {/* Hiển thị badge trạng thái cho gói hiện tại */}
                   {member.package && member.package !== 'Chưa đăng ký' && (
                     <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                       new Date(member.expiryDate) >= new Date() 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-700"
                     }`}>
                       {new Date(member.expiryDate) >= new Date() ? t('member.detail.package.status_active') : t('member.detail.package.status_expired')}
                     </span>
                   )}
                 </div>
                 <p className="text-sm text-gray-500 mt-1">
                   {member.package && member.package !== 'Chưa đăng ký'
                    ? t('member.detail.package.expiry', { date: new Date(member.expiryDate).toLocaleDateString('vi-VN') })
                    : t('member.detail.package.not_registered')}
                 </p>
               </div>
          
            </div>
          </div>

          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-4">
              <Activity className="h-5 w-5 text-green-500" />
              {t('member.detail.history.title')}
            </h3>

            {historyLoading ? (
              <div className="text-sm text-gray-500 text-center py-8">
                {t('member.detail.history.loading')}
              </div>
            ) : historyResponse?.data?.length > 0 ? (
              <div className="space-y-4">
                {historyResponse.data.map((item) => {
                  const isExpired = new Date(item.end_date) < new Date();
                  
                  return (
                    <div key={item.id} className="relative pl-6 border-l-2 border-gray-100 dark:border-gray-800 pb-4 last:pb-0">
                      {/* Dấu chấm mốc thời gian */}
                      <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-blue-500 border-2 border-white dark:border-gray-950"></div>
                      
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {t('member.detail.history.item', { date: new Date(item.registration_date).toLocaleDateString("vi-VN"), package: item.package_name })}
                          </p>

                          <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {t('member.detail.history.period', { start: new Date(item.start_date).toLocaleDateString("vi-VN"), end: new Date(item.end_date).toLocaleDateString("vi-VN") })}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" /> 
                              {item.price?.toLocaleString("vi-VN")} VNĐ
                            </span>
                          </div>
                        </div>

            
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-sm text-gray-500 mt-8 flex flex-col items-center justify-center">
                <Activity className="h-10 w-10 text-gray-200 dark:text-gray-700 mb-2" />
                {t('member.detail.history.no_data')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
);
};

export default MemberDetail;
