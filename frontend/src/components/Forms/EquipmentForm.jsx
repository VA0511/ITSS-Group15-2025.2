import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { equipmentSchema } from '@/schemas/equipmentSchemas';
import { useFacilities } from '@/hooks/queries/useFacilities';
import Input from '@/components/Common/Input';
import Button from '@/components/Common/Button';

const EquipmentForm = ({ initialData, onSubmit, isLoading }) => {
  const { data: facilityResponse } = useFacilities(1, 100);
  const facilities = Array.isArray(facilityResponse) ? facilityResponse : (facilityResponse?.data || []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(equipmentSchema),
    defaultValues: initialData ? {
      ...initialData,
      facility_id: String(initialData.facility_id || 1), // Convert to string for select
      quantity: String(initialData.quantity || 1),
    } : {
      name: '',
      code: '',
      quantity: '1',
      status: 'Operating',
      purchaseDate: '',
      warrantyUntil: '',
      facility_id: '1',
      origin: '',
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Tên chuẩn thiết bị/máy móc *"
          placeholder="VD: Máy chạy bộ Kingsmith XS-100"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Mã tài sản (Seri) *"
          placeholder="VD: TB-001-A"
          error={errors.code?.message}
          {...register('code')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Số lượng *"
          type="number"
          min="1"
          error={errors.quantity?.message}
          {...register('quantity')}
        />
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Trạng thái hiện hành *</label>
          <select
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white"
            {...register('status')}
          >
            <option value="New">Mới nhập</option>
            <option value="Operating">Đang hoạt động tốt</option>
            <option value="Maintenance">Đang bảo trì định kỳ</option>
            <option value="Broken">Báo hỏng - Đang chờ sửa</option>
          </select>
          {errors.status && <span className="text-xs font-medium text-red-500">{errors.status.message}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Phòng tập / Cơ sở *</label>
          <select
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white"
            {...register('facility_id')}
          >
            <option value="">-- Chọn cơ sở --</option>
            {facilities.map(f => (
              <option key={f.id || f.facility_id} value={f.id || f.facility_id}>
                {f.facility_name || f.facilityName || f.name}
              </option>
            ))}
          </select>
          {errors.facility_id && <span className="text-xs font-medium text-red-500">{errors.facility_id.message}</span>}
        </div>
        <Input
          label="Xuất xứ"
          placeholder="VD: Việt Nam, Mỹ..."
          error={errors.origin?.message}
          {...register('origin')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Ngày mua sắm"
          type="date"
          error={errors.purchaseDate?.message}
          {...register('purchaseDate')}
        />
        <Input
          label="Hạn cuối bảo hành"
          type="date"
          error={errors.warrantyUntil?.message}
          {...register('warrantyUntil')}
        />
      </div>

      <div className="flex justify-end pt-4 border-t dark:border-gray-800">
        <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
          {initialData ? 'Cập nhật tình trạng' : 'Ghi nhận thiết bị mới'}
        </Button>
      </div>
    </form>
  );
};

export default EquipmentForm;
