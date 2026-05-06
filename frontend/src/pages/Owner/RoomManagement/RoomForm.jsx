import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import RoomFormComponent from "@/components/Forms/RoomForm";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/Common/Button";
import { toast } from "@/utils/toast";
import { facilityService } from "@/services/facilityService";
import { useCreateFacility, useUpdateFacility } from "@/hooks/mutations/useFacilityMutation";

const RoomFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('Operating');

  const createMutation = useCreateFacility();
  const updateMutation = useUpdateFacility();

  useEffect(() => {
    if (isEditing) {
      setIsLoading(true);
      facilityService.getFacilityById(id)
        .then(response => {
          const data = response.data || response;
          setCurrentStatus(data.status || 'Operating');
          setInitialData({
            facility_name: data.facility_name || '',
            facility_type: data.facility_type || 'Gym',
            description: data.description || '',
            max_capacity: data.max_capacity || 30,
            current_capacity: data.current_capacity || 0,
            amenities: data.amenities || '',
          });
        })
        .catch(err => {
          toast.error("Lỗi khi tải thông tin phòng tập");
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
      facility_name: data.facility_name,
      facility_type: data.facility_type,
      description: data.description || '',
      max_capacity: parseInt(data.max_capacity, 10),
      current_capacity: parseInt(data.current_capacity || 0, 10),
      amenities: data.amenities || '',
      status: isEditing ? currentStatus : 'Operating',
    };

    if (isEditing) {
      updateMutation.mutate(
        { id, data: payload },
        {
          onSuccess: () => {
            setIsLoading(false);
            navigate("/owner/rooms");
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
            navigate("/owner/rooms");
          },
          onError: () => setIsLoading(false)
        }
      );
    }
  };

  if (isEditing && isLoading && !initialData)
    return (
      <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>
    );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Link to="/owner/rooms">
          <Button variant="outline" size="icon" className="shrink-0 h-10 w-10">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {isEditing ? "Chỉnh sửa khu vực / phòng tập" : "Thêm phòng tập mới"}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isEditing
              ? "Thay đổi thông tin sức chứa, loại khu vực và tiện ích."
              : "Thêm khu vực tập luyện mới vào hệ thống quản lý."}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 dark:border-gray-800 dark:bg-gray-950">
        <RoomFormComponent
          initialData={initialData}
          onSubmit={handleSubmit}
          isLoading={isLoading || createMutation.isPending || updateMutation.isPending}
        />
      </div>
    </div>
  );
};

export default RoomFormPage;
