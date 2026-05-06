import React, { useMemo, useState } from 'react';
import { Plus, Trash2, Eye, EyeOff, ChevronLeft, ChevronRight, KeyRound, ShieldCheck } from 'lucide-react';
import { useAccounts } from '@/hooks/queries/useAccounts';
import { useCreateAccount, useDeleteAccount, useRevealPassword } from '@/hooks/mutations/useAccountMutation';
import Button from '@/components/Common/Button';
import Modal from '@/components/Common/Modal';
import Input from '@/components/Common/Input';
import { toast } from '@/utils/toast';

const ROLE_MAP = { 1: 'OWNER', 2: 'MANAGER', 3: 'PT', 4: 'MEMBER' };
const ROLE_BADGE = {
  OWNER: 'bg-purple-100 text-purple-700 ring-purple-600/20 dark:bg-purple-900/30 dark:text-purple-300',
  MANAGER: 'bg-blue-100 text-blue-700 ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-300',
  PT: 'bg-green-100 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-300',
  MEMBER: 'bg-gray-100 text-gray-700 ring-gray-600/20 dark:bg-gray-900/30 dark:text-gray-300',
};

const AccountList = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  // Modals state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, account: null });
  const [createModal, setCreateModal] = useState(false);
  const [revealModal, setRevealModal] = useState({ isOpen: false, account: null });

  // Create form state
  const [createForm, setCreateForm] = useState({ username: '', password: '', role_id: 2 });
  const [createErrors, setCreateErrors] = useState({});

  // Reveal state
  const [ownerPassword, setOwnerPassword] = useState('');
  const [revealedPassword, setRevealedPassword] = useState(null);
  const [showRevealedPwd, setShowRevealedPwd] = useState(false);

  const { data: accountResponse, isLoading } = useAccounts(page, limit);
  const createMutation = useCreateAccount();
  const deleteMutation = useDeleteAccount();
  const revealMutation = useRevealPassword();

  const accounts = useMemo(() => {
    if (!accountResponse) return [];
    if (Array.isArray(accountResponse)) return accountResponse;
    return accountResponse.data || [];
  }, [accountResponse]);

  const totalPages = useMemo(() => {
    if (!accountResponse || Array.isArray(accountResponse)) return 1;
    return accountResponse.total_pages || 1;
  }, [accountResponse]);

  const totalItems = useMemo(() => {
    if (!accountResponse || Array.isArray(accountResponse)) return accounts.length;
    return accountResponse.total_items || accounts.length;
  }, [accountResponse, accounts]);

  // Delete
  const handleDelete = () => {
    if (deleteModal.account) {
      deleteMutation.mutate(deleteModal.account.id);
      setDeleteModal({ isOpen: false, account: null });
    }
  };

  // Create
  const validateCreate = () => {
    const errs = {};
    if (!createForm.username.trim()) errs.username = 'Vui lòng nhập tên đăng nhập';
    if (createForm.password.length < 6) errs.password = 'Mật khẩu tối thiểu 6 ký tự';
    if (!createForm.role_id) errs.role_id = 'Vui lòng chọn vai trò';
    setCreateErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreate = () => {
    if (!validateCreate()) return;
    createMutation.mutate(
      { username: createForm.username, password: createForm.password, role_id: parseInt(createForm.role_id) },
      {
        onSuccess: () => {
          setCreateModal(false);
          setCreateForm({ username: '', password: '', role_id: 2 });
          setCreateErrors({});
        },
      }
    );
  };

  // Reveal password
  const handleReveal = () => {
    if (!ownerPassword) {
      toast.error('Vui lòng nhập mật khẩu của bạn');
      return;
    }
    revealMutation.mutate(
      { id: revealModal.account.id, ownerPassword },
      {
        onSuccess: (res) => {
          const pwd = res?.data?.password || res?.password;
          setRevealedPassword(pwd);
        },
        onError: () => {
          toast.error('Mật khẩu không đúng hoặc không có quyền truy cập');
        },
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Quản lý Tài khoản Nhân viên</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Tổng: {totalItems} tài khoản
          </p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setCreateModal(true)}>
          Thêm tài khoản
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-10 text-gray-500">Đang tải...</div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden dark:border-gray-800 dark:bg-gray-950">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400 w-12">ID</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Tên đăng nhập</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Vai trò</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Mật khẩu</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-400">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {accounts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">Không có dữ liệu</td>
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
                      <td className="px-4 py-3 text-gray-400 font-mono tracking-widest">••••••••</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/50"
                            title="Xem mật khẩu"
                            onClick={() => openRevealModal(account)}
                          >
                            <KeyRound className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50"
                            title="Xóa"
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Trang {page} / {totalPages}</span>
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

      {/* Modal: Thêm tài khoản */}
      <Modal isOpen={createModal} onClose={() => { setCreateModal(false); setCreateErrors({}); }} title="Thêm tài khoản mới">
        <div className="p-4 space-y-4">
          <Input
            label="Tên đăng nhập *"
            placeholder="VD: staff@gym.com"
            value={createForm.username}
            onChange={(e) => setCreateForm(f => ({ ...f, username: e.target.value }))}
            error={createErrors.username}
          />
          <Input
            label="Mật khẩu *"
            type="password"
            placeholder="Tối thiểu 6 ký tự"
            value={createForm.password}
            onChange={(e) => setCreateForm(f => ({ ...f, password: e.target.value }))}
            error={createErrors.password}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Vai trò *</label>
            <select
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white"
              value={createForm.role_id}
              onChange={(e) => setCreateForm(f => ({ ...f, role_id: e.target.value }))}
            >
              <option value={1}>OWNER</option>
              <option value={2}>MANAGER</option>
              <option value={3}>PT</option>
              <option value={4}>MEMBER</option>
            </select>
            {createErrors.role_id && <span className="text-xs text-red-500">{createErrors.role_id}</span>}
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t dark:border-gray-800">
            <Button variant="outline" onClick={() => { setCreateModal(false); setCreateErrors({}); }}>Hủy</Button>
            <Button onClick={handleCreate} isLoading={createMutation.isPending}>Tạo tài khoản</Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Xác nhận xóa */}
      <Modal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false, account: null })} title="Xác nhận xóa tài khoản">
        <div className="p-4">
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            Bạn có chắc muốn xóa tài khoản <strong>{deleteModal.account?.username}</strong>?
          </p>
          <p className="text-sm text-red-500 mb-4">Hành động này không thể hoàn tác.</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteModal({ isOpen: false, account: null })}>Hủy</Button>
            <Button variant="danger" onClick={handleDelete} isLoading={deleteMutation.isPending}>Xóa</Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Xem mật khẩu */}
      <Modal isOpen={revealModal.isOpen} onClose={closeRevealModal} title="Xem mật khẩu tài khoản">
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3">
            <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Nhập mật khẩu của bạn để xem mật khẩu tài khoản <strong>{revealModal.account?.username}</strong>.
            </p>
          </div>

          {revealedPassword === null ? (
            <>
              <Input
                label="Mật khẩu của bạn (Owner)"
                type="password"
                placeholder="Nhập mật khẩu để xác thực"
                value={ownerPassword}
                onChange={(e) => setOwnerPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleReveal()}
              />
              <div className="flex justify-end gap-2 pt-2 border-t dark:border-gray-800">
                <Button variant="outline" onClick={closeRevealModal}>Hủy</Button>
                <Button onClick={handleReveal} isLoading={revealMutation.isPending}>Xác nhận</Button>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Mật khẩu tài khoản</label>
              <div className="flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2">
                <span className="flex-1 font-mono text-gray-900 dark:text-white">
                  {showRevealedPwd ? revealedPassword : '•'.repeat(revealedPassword.length || 8)}
                </span>
                <button
                  type="button"
                  onClick={() => setShowRevealedPwd(v => !v)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showRevealedPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="flex justify-end pt-2 border-t dark:border-gray-800">
                <Button variant="outline" onClick={closeRevealModal}>Đóng</Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AccountList;
