import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Users, MapPin, Activity, LayoutGrid,
  HelpCircle, Image as ImageIcon, Video, Clock,
  ShieldCheck, AlertCircle, Flame,
} from 'lucide-react';
import Button from '@/components/Common/Button';
import { useFacilityById } from '@/hooks/queries/useFacilities';

/* ─── Static enrichment data keyed by facility_type ─── */
const TYPE_META = {
  Gym: {
    icon: '🏋️',
    floor: 'Tầng 1',
    hours: '05:30 – 22:00',
    highlights: [
      'Huấn luyện viên thường trực trong giờ cao điểm',
      'Cho thuê găng tay & dây kháng lực',
      'Tư vấn lộ trình tập luyện miễn phí',
      'Hệ thống lọc không khí HEPA tiêu chuẩn',
    ],
    rules: [
      'Mặc trang phục thể thao, mang giày vào phòng',
      'Lau máy sau mỗi lần sử dụng',
      'Không la hét, giữ không gian yên tĩnh',
      'Xếp tạ về đúng vị trí sau khi dùng',
    ],
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800',
    ],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    videoPoster: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
  },
  Studio: {
    icon: '🧘',
    floor: 'Tầng 2',
    hours: '06:00 – 21:00',
    highlights: [
      'Giảng viên được chứng nhận quốc tế',
      'Lớp học theo nhóm nhỏ, tối đa 15–20 người',
      'Dụng cụ tập được cấp phát miễn phí',
      'Nhiệt độ phòng duy trì 22–24°C',
    ],
    rules: [
      'Tháo giày dép trước khi vào phòng',
      'Tắt điện thoại hoặc để chế độ im lặng',
      'Đến sớm ít nhất 5 phút trước giờ lớp',
      'Không ăn uống trong khu vực tập',
    ],
    images: [
      'https://images.unsplash.com/photo-1588286840104-8957b019727f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&q=80&w=800',
    ],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    videoPoster: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?auto=format&fit=crop&q=80&w=800',
  },
  Spa: {
    icon: '🌿',
    floor: 'Tầng 3',
    hours: '08:00 – 21:00',
    highlights: [
      'Phòng riêng tư, yên tĩnh tuyệt đối',
      'Nước uống thảo dược phục vụ miễn phí',
      'Tinh dầu thiên nhiên nhập khẩu',
      'Khăn tắm sạch thay mới sau mỗi lượt',
    ],
    rules: [
      'Không vào khi đang bị thương hoặc sốt',
      'Uống ít nhất 1 ly nước trước khi vào',
      'Thời gian tối đa mỗi lượt: 20 phút',
      'Giữ im lặng để tôn trọng người dùng khác',
    ],
    images: [
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800',
    ],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    videoPoster: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800',
  },
  Pool: {
    icon: '🏊',
    floor: 'Tầng B1',
    hours: '06:00 – 20:00',
    highlights: [
      'Nước ấm quanh năm – duy trì 28–30°C',
      'Cứu hộ viên chuyên nghiệp trực 100%',
      'Cho thuê phao và kính bơi',
      'Tắm rửa sạch sẽ trước khi xuống bể',
    ],
    rules: [
      'Mặc đồ bơi đúng quy định',
      'Tắm sạch trước khi xuống hồ',
      'Không nhảy từ trên cao xuống',
      'Trẻ em dưới 12 tuổi cần có người lớn đi kèm',
    ],
    images: [
      'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1597974372538-4b5f558c1ff6?auto=format&fit=crop&q=80&w=800',
    ],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    videoPoster: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&q=80&w=800',
  },
};

const DEFAULT_META = {
  icon: '🏢',
  floor: 'Tầng 1',
  hours: '06:00 – 22:00',
  highlights: ['Không gian rộng rãi, sạch sẽ', 'Nhân viên hỗ trợ nhiệt tình'],
  rules: ['Giữ vệ sinh chung', 'Tuân thủ nội quy phòng tập'],
  images: [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800',
  ],
  videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  videoPoster: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
};

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
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="rounded-xl border border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-900/10 p-6 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-red-600 dark:text-red-400">Không tìm thấy thông tin phòng tập.</p>
        </div>
        <Link to="/owner/rooms">
          <Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Quay lại</Button>
        </Link>
      </div>
    );
  }

  const meta = TYPE_META[facility.facility_type] ?? DEFAULT_META;
  const isOperating = facility.status === 'Operating' || facility.status === 'active';
  const amenityList = facility.amenities
    ? facility.amenities.split(',').map(a => a.trim()).filter(Boolean)
    : [];
  const occupancyPct = facility.max_capacity > 0
    ? Math.round((facility.current_capacity / facility.max_capacity) * 100)
    : 0;
  const isNearFull = occupancyPct > 80;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link to="/owner/rooms">
            <Button variant="outline" size="icon" className="shrink-0 h-10 w-10">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-3xl bg-gray-100 dark:bg-gray-800 p-2.5 rounded-xl">
              {meta.icon}
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {facility.facility_name}
                </h1>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                  isOperating
                    ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-900/30 dark:text-amber-400'
                }`}>
                  {isOperating ? '● Đang hoạt động' : '● Đang bảo trì'}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />{meta.floor}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />{meta.hours}
                </span>
                <span>·</span>
                <span>{facility.facility_type}</span>
              </div>
            </div>
          </div>
        </div>
        <Link to={`/owner/rooms/${facility.id}/edit`}>
          <Button>Chỉnh sửa phòng</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left column ── */}
        <div className="lg:col-span-1 space-y-5">

          {/* Capacity card */}
          <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 text-sm">
              <Activity className="h-4 w-4 text-blue-500" />
              Chỉ số hiện tại
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Users className="h-4 w-4" />Sức chứa tối đa
                </span>
                <span className="font-semibold text-gray-900 dark:text-white text-sm">
                  {facility.max_capacity} người
                </span>
              </div>
              <div className={`flex justify-between items-center p-3 rounded-lg border ${
                isNearFull
                  ? 'bg-red-50/60 border-red-100 dark:bg-red-900/10 dark:border-red-900/30'
                  : 'bg-blue-50/50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30'
              }`}>
                <span className={`flex items-center gap-2 text-sm ${isNearFull ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>
                  <MapPin className="h-4 w-4" />Khách hiện tại
                </span>
                <span className={`font-bold text-sm ${isNearFull ? 'text-red-500' : 'text-blue-600 dark:text-blue-400'}`}>
                  {facility.current_capacity} người
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${isNearFull ? 'bg-red-500' : 'bg-blue-600'}`}
                  style={{ width: `${Math.min(100, occupancyPct)}%` }}
                />
              </div>
              <p className={`text-xs text-right font-medium ${isNearFull ? 'text-red-500' : 'text-gray-500'}`}>
                {isNearFull && <Flame className="h-3 w-3 inline mr-1" />}
                Hiệu suất: {occupancyPct}%
              </p>
            </div>
          </div>

          {/* Description card */}
          <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2 text-sm">
              <HelpCircle className="h-4 w-4 text-purple-500" />
              Mô tả chung
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {facility.description || 'Chưa có mô tả.'}
            </p>
          </div>

          {/* Amenities card */}
          {amenityList.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2 text-sm">
                <LayoutGrid className="h-4 w-4 text-orange-500" />
                Cơ sở vật chất & Tiện ích
              </h3>
              <ul className="space-y-2">
                {amenityList.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Highlights card */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-900/30 dark:bg-emerald-900/10 p-5 shadow-sm">
            <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-3 flex items-center gap-2 text-sm">
              <ShieldCheck className="h-4 w-4" />
              Điểm nổi bật
            </h3>
            <ul className="space-y-2">
              {meta.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-emerald-700 dark:text-emerald-400">
                  <span className="mt-0.5 text-emerald-500">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Rules card */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/30 dark:bg-amber-900/10 p-5 shadow-sm">
            <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-3 flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4" />
              Nội quy phòng tập
            </h3>
            <ul className="space-y-2">
              {meta.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-400">
                  <span className="shrink-0 font-bold">{idx + 1}.</span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Images */}
          <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 text-sm">
              <ImageIcon className="h-4 w-4 text-green-500" />
              Hình ảnh nổi bật
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {meta.images.map((src, idx) => (
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

          {/* Video */}
          <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 text-sm">
              <Video className="h-4 w-4 text-red-500" />
              Video giới thiệu
            </h3>
            <div className="rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <video
                className="w-full aspect-video outline-none"
                controls
                poster={meta.videoPoster}
              >
                <source src={meta.videoUrl} type="video/mp4" />
                <p>Trình duyệt của bạn không hỗ trợ thẻ video.</p>
              </video>
            </div>
          </div>

          {/* Quick stats row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Sức chứa', value: `${facility.max_capacity} người`, color: 'blue' },
              { label: 'Đang sử dụng', value: `${facility.current_capacity} người`, color: isNearFull ? 'red' : 'green' },
              { label: 'Còn trống', value: `${Math.max(0, facility.max_capacity - facility.current_capacity)} chỗ`, color: 'purple' },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 text-center shadow-sm">
                <p className={`text-2xl font-bold text-${color}-600 dark:text-${color}-400`}>{value.split(' ')[0]}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{value.split(' ').slice(1).join(' ')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
