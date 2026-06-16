import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PackageFormComponent from '@/components/Forms/PackageForm';
import { ArrowLeft } from 'lucide-react';
import Button from '@/components/Common/Button';
import { toast } from '@/utils/toast';
import { packageService } from '@/services/packageService';
import { useCreatePackage, useUpdatePackage } from '@/hooks/mutations/usePackageMutation';
import { useServiceCategories } from '@/hooks/queries/useServiceCategories';

const PackageFormPage = () => {
  const { t } = useTranslation('owner');
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);

  const createMutation = useCreatePackage();
  const updateMutation = useUpdatePackage();
  const { data: serviceCategoriesData, isLoading: isLoadingCategories } = useServiceCategories();

  const serviceCategories = serviceCategoriesData?.data || serviceCategoriesData || [];

  useEffect(() => {
    if (isEditing) {
      setIsLoading(true);
      packageService.getPackageById(id)
        .then(response => {
          const data = response.data || response;
          setInitialData({
            name: data.package_name || data.name,
            categoryId: data.category_id,
            pricingType: data.pricing_type || 'time_based',
            durationMonths: data.duration_days ? Math.round(data.duration_days / 30) : 1,
            totalSessions: data.total_sessions || 10,
            price: data.price || 0,
            description: data.description || '',
            status: data.is_active === true ? 'active' : 'inactive',
          });
        })
        .catch(err => {
          toast.error(t('package.form.load_error'));
          console.error(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id, isEditing]);

  const formatPayload = (data) => {
    return {
      package_name: data.name,
      category_id: Number(data.categoryId),
      pricing_type: data.pricingType,
      duration_days: data.pricingType === 'time_based' ? (data.durationMonths * 30) : null,
      total_sessions: data.pricingType === 'session_based' ? data.totalSessions : null,
      price: parseFloat(data.price),
      is_active: data.status === 'active' || data.status === true,
      description: data.description
    };
  };

  const handleSubmit = (data) => {
    setIsLoading(true);
    const payload = formatPayload(data);

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

  const handleSaveAndAddAnother = (data) => {
    setIsLoading(true);
    const payload = formatPayload(data);
    createMutation.mutate(
      payload,
      {
        onSuccess: () => {
          setIsLoading(false);
          toast.success("Đã lưu gói thành công! Bạn có thể tạo tiếp mức giá thứ 2.");
        },
        onError: () => setIsLoading(false)
      }
    );
  };

  if ((isEditing && !initialData) || isLoadingCategories) {
    return <div className="p-8 text-center text-gray-500">{t('package.form.loading')}</div>;
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
            {isEditing ? t('package.form.title_edit') : t('package.form.title_create')}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isEditing ? t('package.form.subtitle_edit') : t('package.form.subtitle_create')}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 dark:border-gray-800 dark:bg-gray-950">
        <PackageFormComponent 
          initialData={initialData} 
          onSubmit={handleSubmit} 
          onSaveAndAddAnother={handleSaveAndAddAnother}
          isLoading={isLoading} 
          serviceCategories={serviceCategories}
        />
      </div>
    </div>
  );
};

export default PackageFormPage;
