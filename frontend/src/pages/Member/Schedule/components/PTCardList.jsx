import React from 'react';
import { User, Star, MapPin, ChevronRight, Clock } from 'lucide-react';

const PTCardList = ({ ptDetails, setSelectedTrainer, bookings = [] }) => {
  // Identify PTs who have a pending booking from this member
  const getPTStatus = (ptId) => {
    const hasPending = bookings.some(b => b.pt_id === ptId && b.status === 'Pending');
    return hasPending ? 'Pending' : 'Available';
  };

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-gray-950">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ptDetails.map((pt) => {
          const status = getPTStatus(pt.employee_id);
          const isPending = status === 'Pending';

          return (
            <div
              key={pt.employee_id}
              className="group bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-900/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex gap-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 overflow-hidden border border-blue-50 dark:border-blue-800">
                    {pt.avatar ? (
                      <img src={pt.avatar} alt={pt.full_name} className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-8 w-8" />
                    )}
                  </div>
                  {isPending && (
                    <div className="absolute -top-1 -right-1 h-4 w-4 bg-yellow-400 rounded-full border-2 border-white dark:border-gray-900 animate-pulse" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {pt.full_name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs font-bold text-yellow-600">
                      <Star className="h-3 w-3 fill-current" />
                      4.9
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {pt.experience_years || 0} năm KN
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Cơ sở 1
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4 opacity-80">
                    {pt.professional_profile || "Chuyên gia huấn luyện cá nhân với lộ trình bài bản..."}
                  </p>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedTrainer(pt.full_name)}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                    >
                      Xem chi tiết <ChevronRight className="h-3 w-3" />
                    </button>
                    
                    {isPending ? (
                      <div className="px-3 py-1.5 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-[10px] font-bold rounded-lg border border-yellow-100 dark:border-yellow-900/50">
                        Chờ xác nhận
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedTrainer(pt.full_name)}
                        className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        Đặt lịch ngay
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {ptDetails.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🏋️‍♂️</div>
          <p className="text-gray-500">Hiện chưa có huấn luyện viên nào sẵn sàng.</p>
        </div>
      )}
    </div>
  );
};

export default PTCardList;
