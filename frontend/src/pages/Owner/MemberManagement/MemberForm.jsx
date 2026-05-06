import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MemberFormComponent from '@/components/Forms/MemberForm';
import { ArrowLeft } from 'lucide-react';
import Button from '@/components/Common/Button';
import { toast } from '@/utils/toast';
import { memberService } from '@/services/memberService';
import { useCreateMember, useUpdateMember } from '@/hooks/mutations/useMemberMutation';

const MemberFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);

  const createMutation = useCreateMember();
  const updateMutation = useUpdateMember();

  useEffect(() => {
    if (isEditing) {
      setIsLoading(true);
      memberService.getMemberDetail(id)
        .then(response => {
          const data = response.data || response;
          setInitialData({
            fullName: data.full_name || data.FullName || data.name || '',
            phoneNumber: data.phone || data.Phone || '',
            email: data.email || data.Email || '',
            address: data.address || data.Address || '',
            gender: data.gender || data.Gender || 'Nam',
            dateOfBirth: data.dob || data.DOB ? (data.dob || data.DOB).split('T')[0] : '',
            status: data.is_active || data.status === 'active' ? 'active' : 'inactive',
          });
        })
        .catch(err => {
          toast.error("Lỗi khi tải thông tin hội viên");
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
      full_name: data.fullName,
      phone: data.phoneNumber,
      email: data.email,
      address: data.address,
      gender: data.gender,
      dob: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString() : new Date().toISOString(),
      is_active: data.status === 'active',
      account_id: 0 // Mock account ID or from context if available
    };

    if (isEditing) {
      updateMutation.mutate(
        { id, data: payload },
        {
          onSuccess: () => {
            setIsLoading(false);
            navigate('/owner/members');
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
            navigate('/owner/members');
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
        <Link to="/owner/members">
          <Button variant="outline" size="icon" className="shrink-0 h-10 w-10">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {isEditing ? 'Chỉnh sửa Hội viên' : 'Thêm mới Hội viên'}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isEditing ? 'Cập nhật các thông tin cá nhân của hội viên.' : 'Điền đầy đủ các thông tin cá nhân và gói tập ban đầu thiết lập cho hội viên.'}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 dark:border-gray-800 dark:bg-gray-950">
        <MemberFormComponent 
          initialData={initialData} 
          onSubmit={handleSubmit} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
};

export default MemberFormPage;
