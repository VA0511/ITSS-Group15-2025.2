import React, { useState } from 'react';
import { toast } from 'sonner';
import { X, CheckCircle, XCircle, Clock, User, ChevronLeft } from 'lucide-react';
import useTrainerStore from '@/store/useTrainerStore';

// ─── Rejection Modal ──────────────────────────────────────────────────────────
const RejectionModal = ({ request, onConfirm, onCancel }) => {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">Từ chối yêu cầu</h3>
            <p className="text-xs text-gray-500 mt-0.5">Học viên: {request.name}</p>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="mb-5">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-2">
            Lý do từ chối
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Nhập lý do từ chối yêu cầu..."
            rows={4}
            className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-red-400 resize-none transition-colors"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              if (!reason.trim()) {
                toast.error('Vui lòng nhập lý do từ chối');
                return;
              }
              onConfirm(reason.trim());
            }}
            className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors"
          >
            Xác nhận từ chối
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Conflict Modal ───────────────────────────────────────────────────────────
const ConflictModal = ({ conflicts, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 z-10">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Xung đột lịch dạy</h3>
            <p className="text-xs text-red-500 mt-0.5">Không thể chấp nhận yêu cầu này</p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-3">
        Lịch mong muốn của học viên trùng với các buổi dạy hiện tại của bạn:
      </p>
      <div className="space-y-2 mb-5 max-h-60 overflow-y-auto">
        {conflicts.map((c, i) => (
          <div key={i} className="bg-red-50 border border-red-200 rounded-xl p-3">
            <div className="text-sm font-semibold text-red-800">
              {c.sessionNumber ? `Buổi ${c.sessionNumber} · ` : ''}{c.day} · {c.slot}
              {c.date && <span className="text-xs font-normal ml-1 text-red-400">({c.date})</span>}
            </div>
            <div className="text-xs text-red-600 mt-0.5">
              Trùng với buổi của <span className="font-bold">{c.existingStudent}</span> lúc {c.existingTime}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onClose}
        className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors"
      >
        Đã hiểu
      </button>
    </div>
  </div>
);

// ─── Schedule Slot Pills ─────────────────────────────────────────────────────────────────
const ScheduleSlotDisplay = ({ preferredSchedule }) => {
  if (!preferredSchedule || preferredSchedule.length === 0) return null;
  return (
    <div className="space-y-2">
      {preferredSchedule.map((dayObj, di) => (
        <div key={di} className="flex items-start gap-3">
          <span className="text-xs font-semibold text-gray-700 min-w-16 pt-1">{dayObj.day}</span>
          <div className="flex flex-wrap gap-1.5">
            {dayObj.slots.length === 0 ? (
              <span className="text-xs text-gray-400 italic pt-1">Không có ca</span>
            ) : (
              dayObj.slots.map((slot, si) => (
                <span
                  key={si}
                  className="px-3 py-1.5 text-xs rounded-full border bg-green-100 text-green-700 border-green-200 font-medium"
                >
                  {slot}
                </span>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  switch (status) {
    case 'pending':
      return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3" />Chưa duyệt</span>;
    case 'accepted':
      return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" />Đã chấp nhận</span>;
    case 'rejected':
      return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><XCircle className="w-3 h-3" />Từ chối</span>;
    default:
      return null;
  }
};

// ─── Request Card ─────────────────────────────────────────────────────────────
const RequestCard = ({ request, onClick }) => {
  const initials = request.name.split(' ').slice(-2).map(w => w[0]).join('');
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-2xl p-4 mb-3 flex items-center gap-3 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group"
    >
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-black text-blue-700 flex-shrink-0 group-hover:bg-blue-200 transition-colors">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-gray-900 text-sm truncate">{request.name}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-gray-500">{request.time}</span>
          <span className="text-gray-300">·</span>
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">{request.curriculum}</span>
        </div>
      </div>
      <StatusBadge status={request.status} />
    </div>
  );
};

// ─── Detail Section ───────────────────────────────────────────────────────────
const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-0 last:pb-0">
    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
    <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">{value}</span>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const TrainerRequests = () => {
  const trainingRequests = useTrainerStore((s) => s.trainingRequests);
  const acceptRequest = useTrainerStore((s) => s.acceptRequest);
  const rejectRequest = useTrainerStore((s) => s.rejectRequest);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [viewingDetail, setViewingDetail] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [conflictModal, setConflictModal] = useState(null); // null or { conflicts }

  // Keep detail view in sync when store updates the request
  const currentRequest = selectedRequest
    ? trainingRequests.find((r) => r.id === selectedRequest.id) || selectedRequest
    : null;

  const groupedRequests = {};
  trainingRequests.forEach((req) => {
    if (!groupedRequests[req.date]) groupedRequests[req.date] = [];
    groupedRequests[req.date].push(req);
  });

  const sortedDates = Object.keys(groupedRequests).sort((a, b) => {
    const parse = (s) => {
      const [d, m, y] = s.split('/');
      return new Date(y, m - 1, d);
    };
    return parse(b) - parse(a);
  });

  const handleAccept = () => {
    if (!currentRequest) return;
    const result = acceptRequest(currentRequest.id);
    if (result.ok) {
      toast.success('Đã chấp nhận yêu cầu', {
        description: `Đã thêm ${result.totalAdded} buổi tập với ${currentRequest.name} vào lịch dạy.`,
      });
    } else {
      setConflictModal({ conflicts: result.conflicts });
    }
  };

  const handleRejectConfirm = (reason) => {
    rejectRequest(currentRequest.id, reason);
    setRejectModal(false);
    toast.success('Đã từ chối yêu cầu', { description: `Lý do: ${reason}` });
  };

  // ── Detail view ─────────────────────────────────────────────────────────
  if (viewingDetail && currentRequest) {
    return (
      <>
        {rejectModal && (
          <RejectionModal
            request={currentRequest}
            onConfirm={handleRejectConfirm}
            onCancel={() => setRejectModal(false)}
          />
        )}
        {conflictModal && (
          <ConflictModal
            conflicts={conflictModal.conflicts}
            onClose={() => setConflictModal(null)}
          />
        )}

        <div className="flex-1 overflow-y-auto p-8 max-w-2xl mx-auto w-full">
          <button
            onClick={() => setViewingDetail(false)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Quay lại danh sách
          </button>

          {/* Header card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-base font-black text-blue-700 flex-shrink-0">
              {currentRequest.name.split(' ').slice(-2).map(w => w[0]).join('')}
            </div>
            <div className="flex-1">
              <div className="text-base font-bold text-gray-900">{currentRequest.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">{currentRequest.time} · {currentRequest.date}</div>
            </div>
            <StatusBadge status={currentRequest.status} />
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
            {/* Basic info */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Thông tin cơ bản</h4>
              <div className="space-y-3">
                <InfoRow label="Giáo trình" value={currentRequest.curriculum} />
                <InfoRow label="Ngày sinh" value={currentRequest.birthDate} />
              </div>
            </div>

            {/* Measurements */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Số đo cơ thể</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 p-3 rounded-xl text-sm">
                  <span className="text-gray-500 text-xs">Chiều cao</span>
                  <div className="font-bold text-gray-900 mt-0.5">{currentRequest.measurements.height} cm</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl text-sm">
                  <span className="text-gray-500 text-xs">Cân nặng</span>
                  <div className="font-bold text-gray-900 mt-0.5">{currentRequest.measurements.weight} kg</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl text-sm">
                  <span className="text-gray-500 text-xs">Body fat</span>
                  <div className="font-bold text-gray-900 mt-0.5">{currentRequest.measurements.bodyFat}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl text-sm">
                  <span className="text-gray-500 text-xs">Vai rộng</span>
                  <div className="font-bold text-gray-900 mt-0.5">{currentRequest.measurements.shoulder} cm</div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Ghi chú</h4>
              <div className="bg-gray-50 p-3 rounded-xl text-sm text-gray-800">{currentRequest.notes}</div>
            </div>

            {/* Preferred schedule – slot pills */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Lịch mong muốn hỗ trợ</h4>
              {currentRequest.totalSessions && (
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-semibold">
                    🗓 {currentRequest.totalSessions} buổi tập
                  </span>
                </div>
              )}
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs text-gray-400 mb-3">Hệ thống sẽ tự động xếp {currentRequest.totalSessions || '?'} buổi vào lịch dạy của bạn sau khi chấp nhận.</p>
                <ScheduleSlotDisplay
                  preferredSchedule={currentRequest.preferredSchedule}
                />
              </div>
            </div>

            {/* Rejection reason (if any) */}
            {currentRequest.status === 'rejected' && currentRequest.rejectionReason && (
              <div>
                <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">Lý do từ chối</h4>
                <div className="bg-red-50 border border-red-200 p-3 rounded-xl text-sm text-red-800">
                  {currentRequest.rejectionReason}
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          {currentRequest.status === 'pending' && (
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setRejectModal(true)}
                className="flex-1 py-3.5 bg-white border-2 border-red-200 text-red-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-all"
              >
                <XCircle className="w-4 h-4" />
                Từ chối
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"
              >
                <CheckCircle className="w-4 h-4" />
                Chấp nhận yêu cầu
              </button>
            </div>
          )}
          {currentRequest.status === 'accepted' && (
            <div className="mt-4 py-3.5 bg-green-50 border-2 border-green-200 text-green-700 rounded-xl font-bold text-center flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Đã chấp nhận – Lịch đã được cập nhật
            </div>
          )}
          {currentRequest.status === 'rejected' && (
            <div className="mt-4 py-3.5 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl font-bold text-center flex items-center justify-center gap-2">
              <XCircle className="w-4 h-4" />
              Đã từ chối yêu cầu
            </div>
          )}
        </div>
      </>
    );
  }

  // ── List view ────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-2xl mx-auto w-full">
      <h1 className="text-2xl font-bold mb-1 text-gray-900">Yêu Cầu Tập Luyện</h1>
      <p className="text-sm text-gray-500 mb-6">Danh sách những yêu cầu tập luyện từ học viên.</p>

      {sortedDates.map((date) => (
        <div key={date}>
          <div className="flex items-center gap-4 my-5 before:flex-1 before:h-px before:bg-gray-200 after:flex-1 after:h-px after:bg-gray-200">
            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{date}</span>
          </div>
          {groupedRequests[date].map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onClick={() => {
                setSelectedRequest(request);
                setViewingDetail(true);
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TrainerRequests;
