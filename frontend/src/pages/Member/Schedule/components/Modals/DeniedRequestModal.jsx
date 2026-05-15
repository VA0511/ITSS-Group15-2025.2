import React from 'react';
import { X } from 'lucide-react';

const DeniedRequestModal = ({ selectedDeniedRequest, setSelectedDeniedRequest, getStatusBadgeClass }) => {
  if (!selectedDeniedRequest) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-950 rounded-xl max-w-sm w-full border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Chi tiết từ chối
          </h2>
          <button
            onClick={() => setSelectedDeniedRequest(null)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">Yêu cầu</div>
            <p className="text-base font-bold text-gray-900 dark:text-white">{selectedDeniedRequest.name}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">Thời gian</div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {selectedDeniedRequest.startTime} - {selectedDeniedRequest.endTime}
              </p>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">Trạng thái</div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded whitespace-nowrap inline-block ${getStatusBadgeClass(selectedDeniedRequest.status)}`}>
                {selectedDeniedRequest.status}
              </span>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">Lý do từ chối</div>
            <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-100 dark:border-red-800">
              {selectedDeniedRequest.denyReason || 'Không có lý do cụ thể được cung cấp.'}
            </p>
          </div>
        </div>

        <div className="p-5 pt-0">
          <button
            onClick={() => setSelectedDeniedRequest(null)}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-200"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeniedRequestModal;
