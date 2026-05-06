import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { roomSchema } from '@/schemas/roomSchemas';
import Input from '@/components/Common/Input';
import Button from '@/components/Common/Button';

const FACILITY_TYPES = [
  { value: 'Gym', label: 'Phòng Gym' },
  { value: 'Yoga', label: 'Phòng Yoga' },
  { value: 'Cardio', label: 'Khu Cardio' },
  { value: 'Boxing', label: 'Sân Boxing / MMA' },
  { value: 'Pool', label: 'Hồ bơi' },
  { value: 'Locker', label: 'Khu thay đồ / Tủ khóa' },
  { value: 'Other', label: 'Khác' },
];

const RoomFormComponent = ({ initialData, onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(roomSchema),
    defaultValues: initialData || {
      facility_name: '',
      facility_type: 'Gym',
      description: '',
      max_capacity: 30,
      current_capacity: 0,
      amenities: '',
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Tên khu vực / phòng tập *"
          placeholder="VD: Phòng Gym tầng 1"
          error={errors.facility_name?.message}
          {...register('facility_name')}
        />
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Loại khu vực *</label>
          <select
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white"
            {...register('facility_type')}
          >
            {FACILITY_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          {errors.facility_type && <span className="text-xs font-medium text-red-500">{errors.facility_type.message}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Sức chứa tối đa (người) *"
          type="number"
          min="1"
          error={errors.max_capacity?.message}
          {...register('max_capacity')}
        />
        <Input
          label="Số người hiện tại"
          type="number"
          min="0"
          error={errors.current_capacity?.message}
          {...register('current_capacity')}
        />
      </div>

      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Mô tả</label>
        <textarea
          className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white resize-y"
          placeholder="Mô tả khu vực..."
          {...register('description')}
        />
        {errors.description && <span className="text-xs font-medium text-red-500">{errors.description.message}</span>}
      </div>

      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Tiện ích</label>
        <textarea
          className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white resize-y"
          placeholder="VD: Máy lạnh, Wi-Fi, Tủ khóa..."
          {...register('amenities')}
        />
        {errors.amenities && <span className="text-xs font-medium text-red-500">{errors.amenities.message}</span>}
      </div>

      <div className="flex justify-end pt-4 border-t dark:border-gray-800">
        <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
          {initialData ? 'Lưu thay đổi' : 'Thêm khu vực mới'}
        </Button>
      </div>
    </form>
  );
};

export default RoomFormComponent;
