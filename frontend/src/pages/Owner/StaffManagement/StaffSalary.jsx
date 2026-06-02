import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, Save, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { employeeService } from '@/services/employeeService';
import Button from '@/components/Common/Button';
import { toast } from '@/utils/toast';

const formatVND = (amount) =>
  Number(amount || 0).toLocaleString('vi-VN') + ' ₫';

const PERFORMANCE_OPTIONS = [
  { key: 'performance_excellent',         multiplier: 1.2 },
  { key: 'performance_good',              multiplier: 1.1 },
  { key: 'performance_satisfactory',      multiplier: 1.0 },
  { key: 'performance_needs_improvement', multiplier: 0.9 },
];

const StaffSalary = () => {
  const { t } = useTranslation('owner');
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addingBonus, setAddingBonus] = useState(false);

  const [baseSalaryInput, setBaseSalaryInput] = useState('');
  const [performance, setPerformance] = useState(1.0);

  const [bonusInput, setBonusInput] = useState('');
  const [bonusNote, setBonusNote] = useState('');

  useEffect(() => {
    employeeService.getEmployeeById(id)
      .then((data) => {
        setEmployee(data);
        setBaseSalaryInput(String(data?.salary || 0));
      })
      .catch(() => toast.error(t('salary.toast.load_error')))
      .finally(() => setLoading(false));
  }, [id]);

  const updateSalaryInDB = async (newSalary) => {
    await employeeService.updateEmployee(id, { ...employee, id: parseInt(id), salary: newSalary });
    setEmployee((prev) => ({ ...prev, salary: newSalary }));
  };

  const handleSave = async () => {
    if (!employee) return;
    const base = parseFloat(baseSalaryInput.replace(/[^\d.]/g, '')) || 0;
    setSaving(true);
    try {
      await updateSalaryInDB(base);
      toast.success(t('salary.toast.salary_updated'));
    } catch {
      toast.error(t('salary.toast.salary_error'));
    } finally {
      setSaving(false);
    }
  };

  const handleAddBonus = async () => {
    const bonus = parseFloat(bonusInput.replace(/[^\d.]/g, '')) || 0;
    if (!bonus) return;
    const newSalary = (employee?.salary || 0) + bonus;
    setAddingBonus(true);
    try {
      await updateSalaryInDB(newSalary);
      setBaseSalaryInput(String(newSalary));
      setBonusInput('');
      setBonusNote('');
      toast.success(t('salary.toast.bonus_added', { amount: formatVND(bonus) }) + (bonusNote ? ` — ${bonusNote}` : ''));
    } catch {
      toast.error(t('salary.toast.bonus_error'));
    } finally {
      setAddingBonus(false);
    }
  };

  const estimatedSalary = () => {
    const base = parseFloat(baseSalaryInput.replace(/[^\d.]/g, '')) || employee?.salary || 0;
    return base * performance;
  };

  const name = employee?.full_name || `#${id}`;
  const position = employee?.position || '—';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        {t('salary.loading')}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/owner/staffs')}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> {t('salary.back')}
      </button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {t('salary.title', { name })}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {t('salary.subtitle', { position })}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t('salary.current_salary')}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {employee?.salary ? formatVND(employee.salary) : '—'}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t('salary.estimated_salary')}</p>
          <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
            {formatVND(estimatedSalary())}
          </p>
          <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">{t('salary.calculation_note')}</p>
        </div>
      </div>

      {/* Adjust Base Salary */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-gray-400" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">{t('salary.adjust.title')}</h2>
        </div>

        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">{t('salary.adjust.base_salary_label')}</label>
          <input
            type="text"
            value={baseSalaryInput}
            onChange={(e) => setBaseSalaryInput(e.target.value)}
            placeholder={t('salary.adjust.base_salary_placeholder')}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">{t('salary.adjust.performance_label')}</label>
          <select
            value={performance}
            onChange={(e) => setPerformance(parseFloat(e.target.value))}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {PERFORMANCE_OPTIONS.map((opt) => (
              <option key={opt.multiplier} value={opt.multiplier}>
                {t(`salary.adjust.${opt.key}`)}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
            {t('salary.adjust.performance_formula')}
          </p>
        </div>

        <Button onClick={handleSave} className="w-full" leftIcon={<Save className="h-4 w-4" />} disabled={saving}>
          {saving ? t('salary.adjust.btn_saving') : t('salary.adjust.btn_save')}
        </Button>
      </div>

      {/* Bonus */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-gray-400" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">{t('salary.bonus.title')}</h2>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t('salary.bonus.note')}
        </p>

        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">{t('salary.bonus.amount_label')}</label>
          <input
            type="text"
            value={bonusInput}
            onChange={(e) => setBonusInput(e.target.value)}
            placeholder={t('salary.bonus.amount_placeholder')}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">{t('salary.bonus.reason_label')}</label>
          <input
            type="text"
            value={bonusNote}
            onChange={(e) => setBonusNote(e.target.value)}
            placeholder={t('salary.bonus.reason_placeholder')}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <Button
          onClick={handleAddBonus}
          variant="outline"
          className="w-full"
          leftIcon={<Plus className="h-4 w-4" />}
          disabled={!bonusInput || addingBonus}
        >
          {addingBonus ? t('salary.bonus.btn_adding') : t('salary.bonus.btn_add')}
        </Button>
      </div>
    </div>
  );
};

export default StaffSalary;
