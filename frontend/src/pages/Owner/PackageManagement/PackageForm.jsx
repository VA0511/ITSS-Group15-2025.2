import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PackageFormComponent from '@/components/Forms/PackageForm';
import { ArrowLeft } from 'lucide-react';
import Button from '@/components/Common/Button';
import { toast } from '@/utils/toast';
import { packageService } from '@/services/packageService';
import { useCreatePackage, useUpdatePackage } from '@/hooks/mutations/usePackageMutation';

const PackageFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);

  const createMutation = useCreatePackage();
  const updateMutation = useUpdatePackage();

  useEffect(() => {
    if (isEditing) {
      setIsLoading(true);
      packageService.getPackageById(id)
        .then(response => {
          const data = response.data || response;
          setInitialData({
            name: data.package_name || data.name,
            durationMonths: data.duration_days ? Math.round(data.duration_days / 30) : 1,
            price: data.price || 0,
            description: data.description || '',
            type: { 1: 'VIP', 2: 'Normal', 3: 'Female-only' }[data.category_id] || 'Normal',
            status: data.is_active === true ? 'active' : 'inactive',
          });
        })
        .catch(err => {
          toast.error("Lỗi tải thông tin gói tập");
          console.error(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id, isEditing]);

  const handleSubmit = (data) => {
    setIsLoading(true);
    const payload = {
      package_name: data.name,
      category_id: { 'VIP': 1, 'Normal': 2, 'Female-only': 3 }[data.type] || 2,
      duration_days: data.durationMonths * 30,
      price: parseFloat(data.price),
      is_active: data.status === 'active' || data.status === true,
      description: data.description
    };

    if (isEditing) {
      updateMutation.mutate(
        { id, data: payload },
        {
          onSuccess: () => {
            setIsLoading(false);
            navigate('/owner/packages');
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
            navigate('/owner/packages');
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
        <Link to="/owner/packages">
          <Button variant="outline" size="icon" className="shrink-0 h-10 w-10">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {isEditing ? 'Chỉnh sửa Gói tập' : 'Thiết lập Gói tập mới'}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isEditing 
              ? 'Thay đổi thông tin, giá bán hoặc mô tả của gói tập này.' 
              : 'Thêm dịch vụ thẻ tập mới vào hệ thống chi nhánh của bạn.'}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 dark:border-gray-800 dark:bg-gray-950">
        <PackageFormComponent 
          initialData={initialData} 
          onSubmit={handleSubmit} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
};

export default PackageFormPage;
