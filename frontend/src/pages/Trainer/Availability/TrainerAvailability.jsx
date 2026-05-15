import React, { useState, useEffect } from 'react';
import { Save, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { useMyPTDetail } from '@/hooks/queries/useTraining';
import { useUpdateMyPTDetail } from '@/hooks/mutations/useTrainingMutations';
import { cn } from '@/lib/utils';

const DAYS = [
  { key: 'Mon', label: 'Thứ 2' },
  { key: 'Tue', label: 'Thứ 3' },
  { key: 'Wed', label: 'Thứ 4' },
  { key: 'Thu', label: 'Thứ 5' },
  { key: 'Fri', label: 'Thứ 6' },
  { key: 'Sat', label: 'Thứ 7' },
  { key: 'Sun', label: 'Chủ Nhật' },
];

const TIME_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];

const TrainerAvailability = () => {
  const { data: pt, isLoading, isError } = useMyPTDetail();
  const { mutate: updateMyPTDetail, isPending } = useUpdateMyPTDetail();

  const [availability, setAvailability] = useState({});

  useEffect(() => {
    if (pt?.available_schedule) {
      try {
        setAvailability(JSON.parse(pt.available_schedule));
      } catch {
        setAvailability({});
      }
    }
  }, [pt]);

  const toggleSlot = (day, slot) => {
    setAvailability((prev) => {
      const daySlots = prev[day] || [];
      if (daySlots.includes(slot)) {
        return { ...prev, [day]: daySlots.filter((s) => s !== slot) };
      } else {
        return { ...prev, [day]: [...daySlots, slot].sort() };
      }
    });
  };

  const handleSave = () => {
    if (!pt) return;
    updateMyPTDetail({
      ...pt,
      available_schedule: JSON.stringify(availability),
    });
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-64">
        <div className="text-gray-500 dark:text-gray-400 text-sm">Đang tải...</div>
      </div>
    );
  }

  if (isError || !pt) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-64">
        <div className="text-red-500 text-sm">Không thể tải thông tin lịch dạy.</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full pb-20 no-scrollbar">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-600" />
            Thiết lập lịch dạy của tôi
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Chọn các khung giờ bạn có thể nhận học viên trong tuần
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-200 dark:shadow-none"
        >
          {isPending ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="h-5 w-5" />}
          Lưu thay đổi
        </button>
      </div>

      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
                <th className="p-4 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 dark:bg-gray-900 z-10 min-w-[120px]">
                  Khung giờ
                </th>
                {DAYS.map((day) => (
                  <th key={day.key} className="p-4 text-center text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider min-w-[100px]">
                    {day.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {TIME_SLOTS.map((slot) => (
                <tr key={slot} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors">
                  <td className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400 sticky left-0 bg-white dark:bg-gray-950 z-10 border-r border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-gray-400" />
                      {slot}
                    </div>
                  </td>
                  {DAYS.map((day) => {
                    const isSelected = availability[day.key]?.includes(slot);
                    return (
                      <td key={`${day.key}-${slot}`} className="p-2 text-center">
                        <button
                          onClick={() => toggleSlot(day.key, slot)}
                          className={cn(
                            "w-full py-3 rounded-lg border transition-all flex items-center justify-center gap-1.5",
                            isSelected
                              ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100 dark:shadow-none"
                              : "bg-transparent border-gray-200 dark:border-gray-800 text-transparent hover:border-blue-400 hover:text-blue-400"
                          )}
                        >
                          <CheckCircle2 className={cn("h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
                          <span className="sr-only">{isSelected ? 'Đã chọn' : 'Chưa chọn'}</span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-2">Lưu ý:</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1.5 list-disc list-inside opacity-90">
          <li>Đây là lịch dạy mặc định hàng tuần của bạn.</li>
          <li>Học viên sẽ dựa vào lịch này để gửi yêu cầu đặt lịch tập.</li>
          <li>Bạn có thể cập nhật lịch bất cứ lúc nào, nhưng các buổi tập đã xác nhận sẽ không bị ảnh hưởng.</li>
        </ul>
      </div>
    </div>
  );
};

export default TrainerAvailability;
