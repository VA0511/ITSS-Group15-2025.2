import React, { useMemo } from 'react';
import { X, Calendar, Clock, Award, Phone, Mail, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const DAYS_MAP = {
  'Mon': 'Thứ 2',
  'Tue': 'Thứ 3',
  'Wed': 'Thứ 4',
  'Thu': 'Thứ 5',
  'Fri': 'Thứ 6',
  'Sat': 'Thứ 7',
  'Sun': 'Chủ Nhật',
};

const TrainerModal = ({ selectedTrainer, ptDetails = [], setSelectedTrainer, setBookingForm }) => {
  if (!selectedTrainer) return null;

  const pt = ptDetails.find((p) => p.full_name === selectedTrainer);
  if (!pt) return null;

  const availability = useMemo(() => {
    if (!pt.available_schedule) return {};
    try {
      return JSON.parse(pt.available_schedule);
    } catch (e) {
      console.error("Failed to parse availability", e);
      return {};
    }
  }, [pt.available_schedule]);

  const hasAvailability = Object.keys(availability).some(day => availability[day]?.length > 0);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200 no-scrollbar">
      <div className="bg-white dark:bg-gray-950 rounded-2xl max-w-2xl w-full my-auto border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header với ảnh nền hoặc gradient */}
        <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
          <button
            onClick={() => setSelectedTrainer(null)}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors backdrop-blur-md"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 pb-8 -mt-12 relative z-10">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end mb-8">
            <div className="h-32 w-32 rounded-2xl bg-white dark:bg-gray-900 p-1.5 shadow-xl border border-gray-100 dark:border-gray-800 shrink-0">
              <div className="h-full w-full rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-4xl font-bold text-blue-600 overflow-hidden">
                {pt.avatar ? (
                  <img src={pt.avatar} alt={pt.full_name} className="h-full w-full object-cover" />
                ) : (
                  pt.full_name?.charAt(0)
                )}
              </div>
            </div>
            
            <div className="flex-1 pb-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{pt.full_name}</h2>
                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-black uppercase rounded tracking-wider">
                  Verified PT
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
                <span className="flex items-center gap-1.5"><Award className="h-4 w-4 text-yellow-500" /> {pt.experience_years || 0} năm kinh nghiệm</span>
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-blue-500" /> Sẵn sàng giảng dạy</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cột trái: Thông tin */}
            <div className="md:col-span-2 space-y-8">
              <section>
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4 flex items-center gap-2">
                  <span className="h-1 w-4 bg-blue-600 rounded-full"></span>
                  Giới thiệu chuyên môn
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                  {pt.professional_profile || "Chưa có thông tin mô tả chi tiết từ huấn luyện viên."}
                </p>
                {pt.achievements && (
                   <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mt-4 italic">
                    🏆 {pt.achievements}
                   </p>
                )}
              </section>

              <section>
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4 flex items-center gap-2">
                  <span className="h-1 w-4 bg-blue-600 rounded-full"></span>
                  Lịch biểu dạy học hàng tuần
                </h3>
                
                {hasAvailability ? (
                  <div className="space-y-4">
                    {Object.entries(availability).map(([dayKey, slots]) => slots.length > 0 && (
                      <div key={dayKey} className="flex gap-4 items-start">
                        <div className="min-w-[80px] text-xs font-bold text-gray-900 dark:text-white py-1">
                          {DAYS_MAP[dayKey]}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {slots.map(slot => (
                            <span key={slot} className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400 text-[10px] font-semibold rounded-md border border-gray-200 dark:border-gray-800">
                              {slot}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 text-center">
                    <p className="text-xs text-gray-500">Huấn luyện viên chưa cập nhật lịch rảnh cố định.</p>
                  </div>
                )}
              </section>
            </div>

            {/* Cột phải: Liên hệ & CTA */}
            <div className="space-y-6">
              <div className="p-5 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-gray-200 dark:border-gray-800">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">Thông tin liên hệ</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center text-blue-600 shadow-sm border border-gray-100 dark:border-gray-700">
                      <Phone className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{pt.phone || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center text-blue-600 shadow-sm border border-gray-100 dark:border-gray-700">
                      <Mail className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[140px]">{pt.email || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setBookingForm({ ptId: pt.employee_id, trainer: pt.full_name });
                    setSelectedTrainer(null);
                  }}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 dark:shadow-none flex items-center justify-center gap-2 group"
                >
                  ĐẶT LỊCH NGAY
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <p className="text-[10px] text-center text-gray-400 px-4 leading-relaxed">
                  Lưu ý: Bạn cần chọn khung giờ cụ thể sau khi nhấn Đặt lịch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerModal;
