import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';

const TrackProgress = () => {
  const { id } = useParams();

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Link to="/trainer/students">
          <Button variant="outline" size="icon" className="shrink-0 h-10 w-10">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Theo dõi Chỉ số Inbody</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Cập nhật cân nặng, mỡ, cơ cho học viên (ID: {id}).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 border border-gray-200 bg-white p-6 rounded-xl shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Nhập chỉ số mới</h3>
          <div className="space-y-4">
            <Input label="Cân nặng (kg)" placeholder="Ví dụ: 65" type="number" />
            <Input label="Tỷ lệ mỡ BodyFat (%)" placeholder="Ví dụ: 18" type="number" />
            <Input label="Khối lượng Cơ (kg)" placeholder="Ví dụ: 30" type="number" />
            <Button className="w-full" leftIcon={<Plus className="h-4 w-4" />}>Cập nhật Cột mốc</Button>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 border border-gray-200 bg-white p-6 rounded-xl shadow-sm dark:border-gray-800 dark:bg-gray-950 flex flex-col items-center justify-center text-gray-500">
          <p className="font-medium text-lg text-gray-700 dark:text-gray-300 mb-2">Biểu Đồ Theo Dõi Tiến Độ</p>
          <p className="text-sm">(Được tạo bởi Recharts - Dữ liệu sẽ update theo thực tế)</p>
          <div className="h-64 w-full bg-gray-50 dark:bg-gray-900/50 rounded-lg mt-4 border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">
             Line Chart Here
          </div>
        </div>
      </div>
    </div>
  );
};
export default TrackProgress;
