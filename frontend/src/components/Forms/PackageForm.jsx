import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { packageSchema } from '@/schemas/packageSchemas';
import Input from '@/components/Common/Input';
import Button from '@/components/Common/Button';
import { CalendarDays, Ticket, Plus } from 'lucide-react';
import Modal from '@/components/Common/Modal';
import { serviceCategoryService } from '@/services/serviceCategoryService';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/utils/toast';

const PackageForm = ({ initialData, onSubmit, isLoading, serviceCategories = [], onSaveAndAddAnother }) => {
  const [submitMode, setSubmitMode] = useState('save');
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState('specialty');
  const [newCategoryPayload, setNewCategoryPayload] = useState(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(packageSchema),
    defaultValues: initialData || {
      name: '',
      categoryId: '',
      pricingType: 'time_based',
      durationMonths: 1,
      totalSessions: 10,
      price: 0,
      description: '',
    }
  });

  const handleFormSubmit = async (data) => {
    let finalCategoryId = data.categoryId;

    if (finalCategoryId === 'NEW_CATEGORY' && newCategoryPayload) {
      setIsCreatingCategory(true);
      try {
        const res = await serviceCategoryService.createServiceCategory({
          category_name: newCategoryPayload.category_name,
          benefits_description: newCategoryPayload.benefits_description,
          allowed_gender: newCategoryPayload.allowed_gender,
          category_type: newCategoryPayload.category_type
        });
        await queryClient.invalidateQueries({ queryKey: ['serviceCategories'] });
        const newId = res.data?.id || res.id;
        finalCategoryId = newId;
        setValue('categoryId', newId);
        setNewCategoryPayload(null);
      } catch (e) {
        toast.error('Lỗi khi thêm loại dịch vụ');
        setIsCreatingCategory(false);
        return;
      }
      setIsCreatingCategory(false);
    }

    const payload = { ...data, categoryId: finalCategoryId };
    if (submitMode === 'save_and_add') {
      onSaveAndAddAnother?.(payload);
    } else {
      onSubmit(payload);
    }
  };

  const handleCreateCategory = () => {
    const nameToCreate = newCategoryName.trim();
    if (!nameToCreate) return;
    
    // Check for duplicates
    const isDuplicate = serviceCategories.some(c => c.category_name.toLowerCase() === nameToCreate.toLowerCase());
    if (isDuplicate) {
      toast.error('Tên loại dịch vụ này đã tồn tại!');
      return;
    }

    setNewCategoryPayload({
      id: 'NEW_CATEGORY',
      category_name: nameToCreate,
      category_type: newCategoryType,
      benefits_description: newCategoryType === 'basic' ? 'Dịch vụ Gym cơ bản' : 'Dịch vụ chuyên biệt mới',
      allowed_gender: 'All',
    });
    setValue('categoryId', 'NEW_CATEGORY');
    setCategoryModalOpen(false);
    setNewCategoryName('');
  };

  const selectedCategoryId = useWatch({ control, name: 'categoryId' });
  const pricingType = useWatch({ control, name: 'pricingType' });

  const isBasicCategory = (selectedCategoryId === 'NEW_CATEGORY' && newCategoryPayload?.category_type === 'basic') 
    || (selectedCategoryId && [1, 2, 3].includes(Number(selectedCategoryId)))
    || (selectedCategoryId && serviceCategories.find(c => c.id === Number(selectedCategoryId))?.category_type === 'basic');

  // If a user selects a Basic Category, force pricingType to time_based
  useEffect(() => {
    if (isBasicCategory && pricingType === 'session_based') {
      setValue('pricingType', 'time_based');
    }
  }, [isBasicCategory, pricingType, setValue]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Input
        label="Tên Gói Tập Thành Viên *"
        placeholder="VD: Gói Yoga Cơ Bản 10 Buổi"
        error={errors.name?.message}
        {...register('name')}
      />
      
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Loại Dịch Vụ *</label>
        <div className="flex gap-2">
          <select
            className="flex-1 h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white"
            {...register('categoryId')}
          >
          <option value="" disabled>-- Chọn loại dịch vụ --</option>
          <optgroup label="Nhóm Gói Gym (Chỉ 1 gói active)">
            {newCategoryPayload?.category_type === 'basic' && (
              <option value="NEW_CATEGORY">{newCategoryPayload.category_name} (Mới)</option>
            )}
            {serviceCategories.filter(c => c.category_type === 'basic' || [1,2,3].includes(c.id)).map(c => (
              <option key={c.id} value={c.id}>{c.category_name}</option>
            ))}
          </optgroup>
          <optgroup label="Nhóm Dịch Vụ Chuyên Biệt (Được đăng ký nhiều gói)">
            {newCategoryPayload?.category_type === 'specialty' && (
              <option value="NEW_CATEGORY">{newCategoryPayload.category_name} (Mới)</option>
            )}
            {serviceCategories.filter(c => c.category_type !== 'basic' && ![1,2,3].includes(c.id)).map(c => (
              <option key={c.id} value={c.id}>{c.category_name}</option>
            ))}
          </optgroup>
          </select>
          <Button type="button" variant="outline" className="px-3" onClick={() => setCategoryModalOpen(true)}>
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        {errors.categoryId && <span className="text-xs font-medium text-red-500">{errors.categoryId.message}</span>}
      </div>

      <div className="flex flex-col gap-3 w-full">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Hình thức tính phí *</label>
        <div className="grid grid-cols-2 gap-3">
          <label className={`
            relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none 
            ${pricingType === 'time_based' ? 'border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20' : 'border-gray-300 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800'}
          `}>
            <input type="radio" value="time_based" className="sr-only" {...register('pricingType')} />
            <div className="flex flex-1">
              <div className="flex flex-col">
                <span className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                  <CalendarDays className="h-4 w-4" /> Theo Thời Gian
                </span>
                <span className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">Tính phí theo tháng/năm</span>
              </div>
            </div>
            {pricingType === 'time_based' && (
              <svg className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </label>

          <label className={`
            relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none
            ${isBasicCategory ? 'opacity-50 cursor-not-allowed grayscale' : ''}
            ${pricingType === 'session_based' ? 'border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20' : 'border-gray-300 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800'}
          `}>
            <input type="radio" value="session_based" disabled={isBasicCategory} className="sr-only" {...register('pricingType')} />
            <div className="flex flex-1">
              <div className="flex flex-col">
                <span className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                  <Ticket className="h-4 w-4" /> Theo Buổi
                </span>
                <span className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                  {isBasicCategory ? '(Không áp dụng cho gói Gym)' : 'Tính phí theo tổng số buổi tập'}
                </span>
              </div>
            </div>
            {pricingType === 'session_based' && (
              <svg className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {pricingType === 'time_based' ? (
          <Input
            label="Thời hạn (Tháng) *"
            type="number"
            min="1"
            error={errors.durationMonths?.message}
            {...register('durationMonths')}
          />
        ) : (
          <Input
            label="Tổng số buổi *"
            type="number"
            min="1"
            error={errors.totalSessions?.message}
            {...register('totalSessions')}
          />
        )}
        
        <Input
          label="Giá niêm yết (VNĐ) *"
          type="number"
          min="0"
          error={errors.price?.message}
          {...register('price')}
        />
      </div>

      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Mô tả chi tiết quyền lợi</label>
        <textarea
          className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white resize-y"
          placeholder="Nhập danh sách quyền lợi chi tiết cho Hội viên khi mua gói này..."
          {...register('description')}
        />
        {errors.description && <span className="text-xs font-medium text-red-500">{errors.description.message}</span>}
      </div>

      <div className="flex justify-end pt-4 gap-3 border-t dark:border-gray-800">
        {!initialData && (
          <Button type="submit" variant="outline" isLoading={(isLoading || isCreatingCategory) && submitMode === 'save_and_add'} onClick={() => setSubmitMode('save_and_add')} className="w-full sm:w-auto">
            Lưu & Thêm tùy chọn giá khác
          </Button>
        )}
        <Button type="submit" isLoading={isLoading || isCreatingCategory} onClick={() => setSubmitMode('save')} className="w-full sm:w-auto">
          {initialData ? 'Lưu thay đổi' : 'Tạo Gói Tập'}
        </Button>
      </div>

      <Modal isOpen={isCategoryModalOpen} onClose={() => setCategoryModalOpen(false)} title="Thêm Loại Dịch Vụ Mới">
        <div className="p-4 space-y-4">
          <Input 
            label="Tên Loại Dịch Vụ (Nhóm Dịch Vụ)" 
            placeholder="VD: Bơi lội, Zumba, Yoga bay..." 
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Phân loại Dịch vụ</label>
            <div className="grid grid-cols-2 gap-2">
              <label className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 text-sm font-medium transition-colors ${newCategoryType === 'specialty' ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-900/30 dark:text-blue-300' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:hover:bg-gray-900'}`}>
                <input type="radio" className="sr-only" checked={newCategoryType === 'specialty'} onChange={() => setNewCategoryType('specialty')} />
                Nhóm Chuyên Biệt
              </label>
              <label className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 text-sm font-medium transition-colors ${newCategoryType === 'basic' ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-900/30 dark:text-blue-300' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:hover:bg-gray-900'}`}>
                <input type="radio" className="sr-only" checked={newCategoryType === 'basic'} onChange={() => setNewCategoryType('basic')} />
                Nhóm Gói Gym
              </label>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              * Nhóm Gym: Khách chỉ mua được 1 gói. Nhóm Chuyên Biệt: Khách mua nhiều gói song song.
            </p>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => setCategoryModalOpen(false)}>Hủy</Button>
            <Button type="button" onClick={handleCreateCategory} isLoading={isCreatingCategory}>Thêm</Button>
          </div>
        </div>
      </Modal>
    </form>
  );
};

export default PackageForm;
