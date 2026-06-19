import React, { useMemo, useState } from 'react';
import {
  Plus, Trash2, Eye, EyeOff, ChevronLeft, ChevronRight,
  KeyRound, ShieldCheck, UserCheck, Info,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAccounts } from '@/hooks/queries/useAccounts';
import { useCreateAccount, useDeleteAccount, useRevealPassword } from '@/hooks/mutations/useAccountMutation';
import { useUpdateEmployee } from '@/hooks/mutations/useEmployeeMutation';
import { useEmployees } from '@/hooks/queries/useEmployees';
import Button from '@/components/Common/Button';
import Modal from '@/components/Common/Modal';
import Input from '@/components/Common/Input';
import { toast } from '@/utils/toast';
import { slideUpVariants } from '@/lib/animations';

const ROLE_MAP = { 1: 'OWNER', 2: 'MANAGER', 3: 'PT', 4: 'MEMBER' };
const ROLE_BADGE = {
  OWNER: 'bg-purple-100 text-purple-700 ring-purple-600/20 dark:bg-purple-900/30 dark:text-purple-300',
  MANAGER: 'bg-blue-100 text-blue-700 ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-300',
  PT: 'bg-green-100 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-300',
  MEMBER: 'bg-gray-100 text-gray-700 ring-gray-600/20 dark:bg-gray-900/30 dark:text-gray-300',
};

const AccountList = () => {
  const { t } = useTranslation('owner');
  const [page, setPage] = useState(1);
  const limit = 10;

  // ─── modal state ──────────────────────────────────────────────────────────
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, account: null });
  const [createModal, setCreateModal] = useState(false);
  const [revealModal, setRevealModal] = useState({ isOpen: false, account: null });

  // ─── PT account creation form ─────────────────────────────────────────────
  // selectedEmployeeId: the PT employee to link; 0 = none selected yet
  const [createForm, setCreateForm] = useState({
    selectedEmployeeId: '',
    username: '',
    password: '',
  });
  const [createErrors, setCreateErrors] = useState({});

  // ─── reveal modal state ───────────────────────────────────────────────────
  const [ownerPassword, setOwnerPassword] = useState('');
  const [revealedPassword, setRevealedPassword] = useState(null);
  const [showRevealedPwd, setShowRevealedPwd] = useState(false);

  // ─── data ─────────────────────────────────────────────────────────────────
  const { data: accountResponse, isLoading } = useAccounts(page, limit);
  const { data: employeesRaw } = useEmployees(1, 1000);

  const createMutation = useCreateAccount();
  const deleteMutation = useDeleteAccount();
  const revealMutation = useRevealPassword();
  const updateEmployeeMutation = useUpdateEmployee();

  const accounts = useMemo(() => {
    const raw = !accountResponse
      ? []
      : Array.isArray(accountResponse)
        ? accountResponse
        : accountResponse.data || [];
    return raw.filter((acc) => acc.role_id !== 1);
  }, [accountResponse]);

  const totalPages = useMemo(() => {
    if (!accountResponse || Array.isArray(accountResponse)) return 1;
    return accountResponse.total_pages || 1;
  }, [accountResponse]);

  const totalItems = useMemo(() => {
    if (!accountResponse || Array.isArray(accountResponse)) return accounts.length;
    return accountResponse.total_items || accounts.length;
  }, [accountResponse, accounts]);

  /**
   * PT employees who do NOT yet have an account (account_id falsy / 0)
   * and whose position contains "trainer" (case-insensitive).
   */
  const unlinkedPTs = useMemo(() => {
    const raw = !employeesRaw
      ? []
      : Array.isArray(employeesRaw)
        ? employeesRaw
        : employeesRaw.data?.data || employeesRaw.data || [];
    return raw.filter((e) => {
      const pos = (e.position || '').toLowerCase();
      const isTrainer = pos === 'trainer' || pos === 'pt';
      const noAccount = !e.account_id || e.account_id === 0;
      return isTrainer && noAccount;
    });
  }, [employeesRaw]);

  // The currently selected employee object (for preview)
  const selectedEmployee = useMemo(
    () => unlinkedPTs.find((e) => String(e.id) === String(createForm.selectedEmployeeId)) || null,
    [unlinkedPTs, createForm.selectedEmployeeId]
  );

  // ─── helpers ──────────────────────────────────────────────────────────────
  const resetCreateModal = () => {
    setCreateModal(false);
    setCreateForm({ selectedEmployeeId: '', username: '', password: '' });
    setCreateErrors({});
  };

  const handleSelectEmployee = (empId) => {
    setCreateForm((prev) => ({
      ...prev,
      selectedEmployeeId: empId,
    }));
  };

  // ─── delete ───────────────────────────────────────────────────────────────
  const handleDelete = () => {
    if (deleteModal.account) {
      deleteMutation.mutate(deleteModal.account.id);
      setDeleteModal({ isOpen: false, account: null });
    }
  };

  // ─── create PT account ────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!createForm.selectedEmployeeId) errs.selectedEmployeeId = t('account.create_pt.emp_required');
    if (!createForm.username.trim()) errs.username = t('account.validation.username_required');
    if (createForm.password.length < 6) errs.password = t('account.validation.password_min');
    setCreateErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;

    createMutation.mutate(
      { username: createForm.username, password: createForm.password, role_id: 3 /* PT */ },
      {
        onSuccess: (res) => {
          // Get the newly created account's ID
          const newAccountId =
            res?.data?.id || res?.id || res?.data?.data?.id;

          if (newAccountId && createForm.selectedEmployeeId) {
            // Link the selected PT employee to this new account
            updateEmployeeMutation.mutate(
              { id: parseInt(createForm.selectedEmployeeId), data: { account_id: newAccountId } },
              {
                onError: () => {
                  toast.error(t('account.create_pt.link_failed'));
                },
              }
            );
          }
          resetCreateModal();
        },
      }
    );
  };

  // ─── reveal password ──────────────────────────────────────────────────────
  const handleReveal = () => {
    if (!ownerPassword) { toast.error(t('account.error.enter_password')); return; }
    revealMutation.mutate(
      { id: revealModal.account.id, ownerPassword },
      {
        onSuccess: (res) => setRevealedPassword(res?.data?.password || res?.password),
        onError: () => toast.error(t('account.error.wrong_password')),
      }
    );
  };

  const openRevealModal = (account) => {
    setRevealModal({ isOpen: true, account });
    setOwnerPassword('');
    setRevealedPassword(null);
    setShowRevealedPwd(false);
  };

  const closeRevealModal = () => {
    setRevealModal({ isOpen: false, account: null });
    setOwnerPassword('');
    setRevealedPassword(null);
    setShowRevealedPwd(false);
  };

  // ─── render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div variants={slideUpVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{t('account.title')}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('account.subtitle', { count: totalItems })}
          </p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setCreateModal(true)}>
          {t('account.add_btn')}
        </Button>
      </motion.div>

      {/* Table */}
      <motion.div variants={slideUpVariants}>
        {isLoading ? (
          <div className="text-center py-10 text-gray-500">{t('account.loading')}</div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden dark:border-gray-800 dark:bg-gray-950">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400 w-12">{t('account.table.id')}</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">{t('account.table.username')}</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">{t('account.table.role')}</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">{t('account.table.password')}</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-400">{t('account.table.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {accounts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">{t('account.no_data')}</td>
                  </tr>
                ) : (
                  accounts.map((account) => {
                    const roleName = ROLE_MAP[account.role_id] || `Role ${account.role_id}`;
                    const badgeClass = ROLE_BADGE[roleName] || ROLE_BADGE.MEMBER;
                    return (
                      <tr key={account.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{account.id}</td>
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{account.username}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${badgeClass}`}>
                            {roleName}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 font-mono tracking-widest">**********</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost" size="icon"
                              className="h-8 w-8 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/50"
                              title={t('account.tooltip.view_password')}
                              onClick={() => openRevealModal(account)}
                            >
                              <KeyRound className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost" size="icon"
                              className="h-8 w-8 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50"
                              title={t('account.tooltip.delete')}
                              onClick={() => setDeleteModal({ isOpen: true, account })}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">{t('account.pagination', { page, total: totalPages })}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      {/* ─── Modal: Tạo tài khoản PT ──────────────────────────────────────── */}
      <Modal
        isOpen={createModal}
        onClose={resetCreateModal}
        title={t('account.modal.add_title')}
        description={t('account.modal.add_desc')}
      >
        <div className="p-4 space-y-4">

          {/* Info banner */}
          <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30 p-3 text-sm text-blue-700 dark:text-blue-300">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{t('account.modal.pt_only_hint')}</span>
          </div>

          {/* Select PT employee */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {t('account.create_pt.select_emp_label')}
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            {unlinkedPTs.length === 0 ? (
              <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 px-3 py-2 text-sm text-amber-700 dark:text-amber-300">
                <UserCheck className="h-4 w-4 shrink-0" />
                {t('account.create_pt.no_unlinked_pt')}
              </div>
            ) : (
              <select
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-950 dark:border-gray-700 dark:text-white"
                value={createForm.selectedEmployeeId}
                onChange={(e) => handleSelectEmployee(e.target.value)}
              >
                <option value="">{t('account.create_pt.select_placeholder')}</option>
                {unlinkedPTs.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.full_name || emp.FullName || `PT #${emp.id}`}
                    {emp.phone ? ` · ${emp.phone}` : ''}
                  </option>
                ))}
              </select>
            )}
            {createErrors.selectedEmployeeId && (
              <span className="text-xs text-red-500">{createErrors.selectedEmployeeId}</span>
            )}
          </div>

          {/* Selected employee preview */}
          {selectedEmployee && (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 px-4 py-3 text-sm space-y-1">
              <p className="font-semibold text-gray-900 dark:text-white">{selectedEmployee.full_name}</p>
              {selectedEmployee.phone && (
                <p className="text-gray-500 dark:text-gray-400">📞 {selectedEmployee.phone}</p>
              )}
              {selectedEmployee.email && (
                <p className="text-gray-500 dark:text-gray-400">✉️ {selectedEmployee.email}</p>
              )}
              {selectedEmployee.address && (
                <p className="text-gray-500 dark:text-gray-400">📍 {selectedEmployee.address}</p>
              )}
            </div>
          )}

          {/* Username */}
          <Input
            label={t('account.form.username_label')}
            placeholder={t('account.form.username_placeholder')}
            value={createForm.username}
            onChange={(e) => setCreateForm(f => ({ ...f, username: e.target.value }))}
            error={createErrors.username}
          />

          {/* Password */}
          <Input
            label={t('account.form.password_label')}
            type="password"
            placeholder={t('account.form.password_placeholder')}
            value={createForm.password}
            onChange={(e) => setCreateForm(f => ({ ...f, password: e.target.value }))}
            error={createErrors.password}
          />

          <div className="flex justify-end gap-2 pt-2 border-t dark:border-gray-800">
            <Button variant="outline" onClick={resetCreateModal}>{t('account.btn.cancel')}</Button>
            <Button
              onClick={handleCreate}
              disabled={unlinkedPTs.length === 0}
              isLoading={createMutation.isPending || updateEmployeeMutation.isPending}
            >
              {t('account.btn.create')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Xác nhận xóa */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, account: null })}
        title={t('account.modal.delete_title')}
      >
        <div className="p-4">
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            {t('account.delete.confirm_pre')}<strong>{deleteModal.account?.username}</strong>{t('account.delete.confirm_post')}
          </p>
          <p className="text-sm text-red-500 mb-4">{t('account.delete.warning')}</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteModal({ isOpen: false, account: null })}>{t('account.btn.cancel')}</Button>
            <Button variant="danger" onClick={handleDelete} isLoading={deleteMutation.isPending}>{t('account.btn.delete')}</Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Xem mật khẩu */}
      <Modal isOpen={revealModal.isOpen} onClose={closeRevealModal} title={t('account.modal.reveal_title')}>
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3">
            <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {t('account.reveal.info_pre')}<strong>{revealModal.account?.username}</strong>{t('account.reveal.info_post')}
            </p>
          </div>
          {revealedPassword === null ? (
            <>
              <Input
                label={t('account.reveal.your_password_label')}
                type="password"
                placeholder={t('account.reveal.your_password_placeholder')}
                value={ownerPassword}
                onChange={(e) => setOwnerPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleReveal()}
              />
              <div className="flex justify-end gap-2 pt-2 border-t dark:border-gray-800">
                <Button variant="outline" onClick={closeRevealModal}>{t('account.btn.cancel')}</Button>
                <Button onClick={handleReveal} isLoading={revealMutation.isPending}>{t('account.btn.confirm')}</Button>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('account.reveal.account_password_label')}</label>
              <div className="flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2">
                <span className="flex-1 font-mono text-gray-900 dark:text-white">
                  {showRevealedPwd ? revealedPassword : '•'.repeat(revealedPassword.length || 8)}
                </span>
                <button type="button" onClick={() => setShowRevealedPwd(v => !v)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  {showRevealedPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="flex justify-end pt-2 border-t dark:border-gray-800">
                <Button variant="outline" onClick={closeRevealModal}>{t('account.btn.close')}</Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AccountList;
