import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { packageSchema } from '@/schemas/packageSchemas';
import Input from '@/components/Common/Input';
import Button from '@/components/Common/Button';

const PackageForm = ({ initialData, onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(packageSchema),
    defaultValues: initialData || {
      name: '',
      durationMonths: 1,
      price: 0,
      description: '',
      type: 'Normal',
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Tên Gói Tập Thành Viên *"
        placeholder="VD: Gói Yoga - Kèm PT 1 kèm 1"
        error={errors.name?.message}
        {...register('name')}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Thời hạn cấp phép (Theo tháng) *"
          type="number"
          min="1"
          error={errors.durationMonths?.message}
          {...register('durationMonths')}
        />
        <Input
          label="Giá niêm yết (VNĐ) *"
          type="number"
          min="0"
          error={errors.price?.message}
          {...register('price')}
        />
      </div>

      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Hạng Thẻ *</label>
        <select
          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white"
          {...register('type')}
        >
          <option value="Normal">Normal (Khu vực Gym cơ bản)</option>
          <option value="VIP">VIP (Truy cập mọi khu vực, phòng xông hơi, yoga, gym, hồ bơi)</option>
          <option value="Female-only">Female-only (Khu vực riêng cho nữ, Yoga, Spa)</option>
        </select>
        {errors.type && <span className="text-xs font-medium text-red-500">{errors.type.message}</span>}
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

      <div className="flex justify-end pt-4 border-t dark:border-gray-800">
        <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
          {initialData ? 'Lưu thay đổi' : 'Tạo Gói Tập'}
        </Button>
      </div>
    </form>
  );
};

export default PackageForm;
