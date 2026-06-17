import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useMembers } from '@/hooks/queries/useMembers';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Common/Table';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import { slideUpVariants, sectionStaggerVariants } from '@/lib/animations';

const MemberList = () => {
  const { t } = useTranslation('owner');
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 10;

  const { data: memberResponse, isLoading, isError } = useMembers(page, limit);

  // Mock data fallback
  const mockMembers = [
    { id: 1, full_name: 'Nguyá»…n VÄƒn A', phone: '0912345678', email: 'vana@gmail.com', package_name: 'GÃ³i VIP', status: 'active', registered_at: '2026-01-15' },
    { id: 2, full_name: 'Tráº§n Thá»‹ B', phone: '0923456789', email: 'thib@gmail.com', package_name: 'GÃ³i Basic', status: 'active', registered_at: '2026-02-20' },
    { id: 3, full_name: 'LÃª VÄƒn C', phone: '0934567890', email: 'vanc@gmail.com', package_name: 'GÃ³i Premium', status: 'inactive', registered_at: '2025-12-10' },
    { id: 4, full_name: 'Pháº¡m Thá»‹ D', phone: '0945678901', email: 'thid@gmail.com', package_name: 'GÃ³i VIP', status: 'active', registered_at: '2026-03-05' },
    { id: 5, full_name: 'HoÃ ng VÄƒn E', phone: '0956789012', email: 'vane@gmail.com', package_name: 'GÃ³i Basic', status: 'active', registered_at: '2026-03-15' },
  ];

  // Handle API response
  const members = useMemo(() => {
    if (!memberResponse) return mockMembers;
    if (Array.isArray(memberResponse)) return memberResponse;
    if (memberResponse.data && memberResponse.data.length > 0) return memberResponse.data;
    if (isError) return mockMembers;
    return mockMembers;
  }, [memberResponse, isError]);

  const totalMemberItems = useMemo(() => {
    if (!memberResponse) return mockMembers.length;
    if (Array.isArray(memberResponse)) return memberResponse.length;
    return memberResponse.total_items || mockMembers.length;
  }, [memberResponse]);

  const totalMemberPages = useMemo(() => {
    if (!memberResponse) return 1;
    if (Array.isArray(memberResponse)) return 1;
    return memberResponse.total_pages || Math.ceil(totalMemberItems / limit) || 1;
  }, [memberResponse, totalMemberItems]);

  const sortedMembers = useMemo(() => {
    return (members || []).slice().sort((a, b) => {
      const dateA = new Date(a.created_at || a.createdAt || a.registeredAt || a.expiredAt || 0).getTime();
      const dateB = new Date(b.created_at || b.createdAt || b.registeredAt || b.expiredAt || 0).getTime();
      return dateB - dateA;
    });
  }, [members]);

  const filteredMembers = useMemo(() => {
    const value = searchTerm.toLowerCase();
    return sortedMembers.filter((member) =>
      (member.full_name || member.FullName || member.name || '').toLowerCase().includes(value) ||
      (member.package_name || member.packageName || member.package || '').toLowerCase().includes(value) ||
      (member.phone || member.Phone || '').includes(value) ||
      (member.email || member.Email || '').toLowerCase().includes(value)
    );
  }, [searchTerm, sortedMembers]);

  return (
    <div className="space-y-6 relative">
      <motion.div variants={slideUpVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{t('member.title')}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('member.subtitle')}</p>
        </div>

      </motion.div>

      <motion.div variants={slideUpVariants} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('member.search.title')}</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('member.search.subtitle')}</p>
          </div>
          <div className="w-full max-w-sm">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('member.search.placeholder')}
            />
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">{t('member.loading')}</div>
          ) : isError ? (
            <div className="p-8 text-center text-red-500">{t('member.load_error')}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('member.table.name')}</TableHead>
                  <TableHead>{t('member.table.package')}</TableHead>
                  <TableHead>{t('member.table.phone')}</TableHead>
                  <TableHead>Hạn / Số buổi</TableHead>
                  <TableHead>{t('member.table.status')}</TableHead>
                  <TableHead className="text-right">{t('member.table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500 h-24">
                      {t('member.no_data')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => (
                    <TableRow
                      key={member.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
                      onClick={() => navigate(`/owner/members/${member.id}`)}
                    >
                      <TableCell className="font-semibold text-gray-900 dark:text-gray-100">
                        <div className="flex items-center gap-3">
                          <img 
                            src={(member.gender || '').toLowerCase() === 'ná»¯' ? '/src/assets/nu_ava.jpg' : '/src/assets/nam_ava.jpg'} 
                            alt="avatar" 
                            className="h-8 w-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                          />
                          <span>{member.full_name || member.FullName || member.name || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-300">
                        {member.package_name || member.packageName || member.package || 'N/A'}
                      </TableCell>
                      <TableCell>{member.phone || member.Phone || 'N/A'}</TableCell>
                      <TableCell>
                        {member.pricingType === 'session_based'
                          ? <span>{member.sessionsRemaining || 0} buổi</span>
                          : (member.expiryDate && member.expiryDate !== '0001-01-01'
                            ? new Date(member.expiryDate).toLocaleDateString('vi-VN')
                            : 'N/A')
                        }
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                          member.status === 'active' || member.Status === 'active'
                            ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {member.status === 'active' || member.Status === 'active' ? t('member.status.active') : t('member.status.expired')}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link to={`/owner/members/${member.id}`} onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" title={t('member.tooltip.view')} className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link to={`/owner/members/${member.id}/edit`} onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" title={t('member.tooltip.edit')} className="h-8 w-8 text-blue-500">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Pagination */}
        {totalMemberPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {t('member.pagination', { page, total: totalMemberPages, count: totalMemberItems })}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalMemberPages, p + 1))}
                disabled={page === totalMemberPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MemberList;
