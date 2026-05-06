import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import EquipmentFormComponent from '@/components/Forms/EquipmentForm';
import { ArrowLeft } from 'lucide-react';
import Button from '@/components/Common/Button';
import { toast } from '@/utils/toast';
import { equipmentService } from '@/services/equipmentService';
import { useCreateEquipment, useUpdateEquipment } from '@/hooks/mutations/useEquipmentMutation';

const EquipmentFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);

  const createMutation = useCreateEquipment();
  const updateMutation = useUpdateEquipment();

  useEffect(() => {
    if (isEditing) {
      setIsLoading(true);
      equipmentService.getEquipmentById(id)
        .then(response => {
          const data = response.data || response;
          setInitialData({
            name: data.equipment_name || data.name,
            code: data.serial_number || data.code || '',
            quantity: String(data.quantity || 1),
            status: data.status || 'Operating',
            purchaseDate: data.purchase_date ? data.purchase_date.split('T')[0] : '',
            warrantyUntil: data.maintenance_deadline ? data.maintenance_deadline.split('T')[0] : '',
            facility_id: String(data.facility_id || 1),
            origin: data.origin || ''
          });
        })
        .catch(err => {
          toast.error("Lỗi khi tải thông tin thiết bị");
          console.error(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id, isEditing]);

  const handleSubmit = (data) => {
    setIsLoading(true);
    
    // Map form fields to API payload
    const payload = {
      equipment_name: data.name,
      serial_number: data.code,
      quantity: parseInt(data.quantity, 10),
      status: data.status,
      purchase_date: data.purchaseDate ? new Date(data.purchaseDate).toISOString() : new Date().toISOString(),
      maintenance_deadline: data.warrantyUntil ? new Date(data.warrantyUntil).toISOString() : new Date().toISOString(),
      facility_id: parseInt(data.facility_id || 1, 10),
      origin: data.origin || 'Chưa rõ'
    };

    if (isEditing) {
      updateMutation.mutate(
        { id, data: payload },
        {
          onSuccess: () => {
            setIsLoading(false);
            navigate('/owner/equipment');
          },
          onError: () => setIsLoading(false)
        }
      );
    } else {
      createMutation.mutate(
        payload,
        {
          onSuccess: () => {
            setIsLoading(false);
            navigate('/owner/equipment');
          },
          onError: () => setIsLoading(false)
        }
      );
    }
  };

  if (isEditing && !initialData) {
    return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Link to="/owner/equipment">
          <Button variant="outline" size="icon" className="shrink-0 h-10 w-10">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {isEditing ? 'Cập nhật Thiết bị' : 'Nhập Thiết bị mới'}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isEditing 
              ? 'Cập nhật thông tin tình trạng, lịch bảo trì của thiết bị.' 
              : 'Ghi nhận thiết bị, máy tạ mới mua vào kho tài sản của Gym.'}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 dark:border-gray-800 dark:bg-gray-950">
        <EquipmentFormComponent 
          initialData={initialData} 
          onSubmit={handleSubmit} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
};

export default EquipmentFormPage;
