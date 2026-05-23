import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  MapPin,
  Activity,
  LayoutGrid,
  HelpCircle,
  Image as ImageIcon,
  AlertCircle,
} from 'lucide-react';
import Button from '@/components/Common/Button';
import { useFacilityById } from '@/hooks/queries/useFacilities';

const TYPE_ICON = {
  Gym:     '🏋️',
  Studio:  '🧘',
  Spa:     '🌿',
  Pool:    '🏊',
  Outdoor: '🏟️',
  Other:   '🏢',
};

const TYPE_IMAGES = {
  Gym: [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800',
  ],
  Studio: [
    'https://images.unsplash.com/photo-1588286840104-8957b019727f?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&q=80&w=800',
  ],
  Spa: [
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800',
  ],
  Pool: [
    'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1597974372538-4b5f558c1ff6?auto=format&fit=crop&q=80&w=800',
  ],
  Outdoor: [
    'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=800',
  ],
};

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800',
];

const RoomDetail = () => {
  const { id } = useParams();
  const { data: facility, isLoading, error } = useFacilityById(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Đang tải thông tin chi tiết...</p>
      </div>
    );
  }

  if (error || !facility) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="rounded-xl border border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-900/10 p-6 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-red-600 dark:text-red-400">
            Không tìm thấy thông tin phòng tập. Vui lòng thử lại.
          </p>
        </div>
        <Link to="/owner/rooms" className="inline-flex mt-4">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </Link>
      </div>
    );
  }

  const isOperating = facility.status === 'Operating' || facility.status === 'active';
  const icon = TYPE_ICON[facility.facility_type] ?? TYPE_ICON.Other;
  const images = TYPE_IMAGES[facility.facility_type] ?? DEFAULT_IMAGES;
  const amenityList = facility.amenities
    ? facility.amenities.split(',').map((a) => a.trim()).filter(Boolean)
    : [];
  const occupancyPct =
    facility.max_capacity > 0
      ? Math.round((facility.current_capacity / facility.max_capacity) * 100)
      : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link to="/owner/rooms">
            <Button variant="outline" size="icon" className="shrink-0 h-10 w-10">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-2xl bg-gray-100 dark:bg-gray-800 p-2 rounded-xl">{icon}</span>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {facility.facility_name}
                </h1>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                    isOperating
                      ? 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}
                >
                  {isOperating ? 'Đang hoạt động' : 'Đang bảo trì'}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Loại: {facility.facility_type}
              </p>
            </div>
          </div>
        </div>
        <Link to={`/owner/rooms/${facility.id}/edit`}>
          <Button>Chỉnh sửa phòng</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Stats */}
          <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              Chỉ số hiện tại
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <Users className="h-4 w-4 mr-2" />
                  Sức chứa tối đa
                </div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {facility.max_capacity} người
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30">
                <div className="flex items-center text-blue-600 dark:text-blue-400">
                  <MapPin className="h-4 w-4 mr-2" />
                  Khách hiện tại
                </div>
                <div
                  className={`font-bold ${
                    occupancyPct > 80 ? 'text-red-500' : 'text-blue-600 dark:text-blue-400'
                  }`}
                >
                  {facility.current_capacity} người
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                <div
                  className={`h-2.5 rounded-full ${occupancyPct > 80 ? 'bg-red-500' : 'bg-blue-600'}`}
                  style={{ width: `${Math.min(100, occupancyPct)}%` }}
                />
              </div>
              <p className="text-xs text-right text-gray-500">Hiệu suất: {occupancyPct}%</p>
            </div>
          </div>

          {/* Description & amenities */}
          <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-purple-500" />
              Mô tả chung
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {facility.description || 'Chưa có mô tả.'}
            </p>

            {amenityList.length > 0 && (
              <>
                <h4 className="font-medium text-gray-900 dark:text-white mt-6 mb-3 flex items-center gap-2 text-sm">
                  <LayoutGrid className="h-4 w-4 text-orange-500" />
                  Cơ sở vật chất & Tiện ích
                </h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {amenityList.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        {/* Right column – images */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-green-500" />
              Hình ảnh nổi bật
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {images.map((src, idx) => (
                <div
                  key={idx}
                  className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer border border-gray-200 dark:border-gray-800"
                >
                  <img
                    src={src}
                    alt={`${facility.facility_name} ${idx + 1}`}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
