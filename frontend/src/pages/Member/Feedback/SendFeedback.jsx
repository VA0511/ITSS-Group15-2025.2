import React, { useState } from 'react';
import { Star, Send, Clock, CheckCircle2, MessageSquare } from 'lucide-react';
import Button from '@/components/Common/Button';
import { useCreateFeedback } from '@/hooks/mutations/useFeedbackMutations';
import { useMyFeedbacks } from '@/hooks/queries/useFeedbacks';
import { toast } from 'sonner';
import { format } from 'date-fns';

const feedbackCategories = [
  { value: 'equipment', label: 'Thiết bị máy tập' },
  { value: 'service', label: 'Dịch vụ và vệ sinh khu vực chung' },
  { value: 'staff', label: 'Nhân viên / Huấn luyện viên' },
  { value: 'other', label: 'Vấn đề khác' }
];

const ratingLabels = {
  1: 'Không hài lòng',
  2: 'Chưa hài lòng',
  3: 'Bình thường',
  4: 'Hài lòng',
  5: 'Rất hài lòng'
};

const SendFeedback = () => {
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState('service');
  const [content, setContent] = useState('');
  const { mutate: createFeedback, isPending } = useCreateFeedback();
  const { data: myFeedbacks = [] } = useMyFeedbacks();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Vui lòng nhập nội dung phản hồi');
      return;
    }
    createFeedback(
      { content: content.trim(), rating, status: 'Pending' },
      {
        onSuccess: () => {
          setContent('');
          setRating(5);
          setCategory('service');
        },
      }
    );
  };

  return (
    <div className="space-y-8 max-w-lg mx-auto md:max-w-2xl pb-20">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Góp Ý Dịch Vụ</h1>
        <p className="text-gray-500 text-sm mt-1">
          Chúng tôi luôn lắng nghe phản hồi của bạn để cải thiện môi trường tốt hơn.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 shadow-sm">
        <div className="space-y-2 text-center py-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
          <p className="font-bold text-lg dark:text-white mb-2">Đánh giá chung của bạn?</p>
          <div className="flex justify-center gap-1 sm:gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none p-1 transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  className={`h-12 w-12 transition-colors ${
                    rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-700'
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3 font-medium uppercase tracking-wider">{ratingLabels[rating]}</p>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">Chủ đề phản hồi</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex h-12 w-full rounded-xl border border-input bg-background px-4 py-2 font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
          >
            {feedbackCategories.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">Ý kiến chi tiết</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex min-h-[140px] w-full rounded-xl border border-input bg-background px-4 py-3 resize-none focus:ring-2 focus:ring-blue-500"
            placeholder="Hãy viết góp ý thẳng thắn để chúng tôi phục vụ bạn tốt hơn..."
          />
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-12 rounded-xl text-md font-bold"
          leftIcon={<Send className="h-5 w-5" />}
        >
          {isPending ? 'Đang gửi...' : 'Gửi Phản Hồi'}
        </Button>
      </form>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Phản hồi đã gửi</h2>
          {myFeedbacks.length > 0 && (
            <span className="ml-auto text-xs text-gray-400 font-medium">{myFeedbacks.length} phản hồi</span>
          )}
        </div>

        {myFeedbacks.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 dark:bg-gray-900/30 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800 text-sm">
            Bạn chưa gửi phản hồi nào.
          </div>
        ) : (
          <div className="space-y-3">
            {myFeedbacks.map((fb) => (
              <div
                key={fb.id}
                className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 space-y-2 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-gray-800 dark:text-gray-200 flex-1">{fb.content}</p>
                  <span className={`shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    fb.status?.toLowerCase() === 'resolved'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {fb.status?.toLowerCase() === 'resolved'
                      ? <><CheckCircle2 className="h-3 w-3" /> Đã xử lý</>
                      : <><Clock className="h-3 w-3" /> Chờ xử lý</>
                    }
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`h-3.5 w-3.5 ${s <= fb.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-700'}`} />
                  ))}
                </div>

                {fb.resolution_note && (
                  <div className="mt-2 pl-3 border-l-2 border-blue-300 dark:border-blue-700">
                    <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">Phản hồi từ ban quản lý:</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{fb.resolution_note}</p>
                  </div>
                )}

                <p className="text-xs text-gray-400">
                  {format(new Date(fb.sent_at), 'HH:mm — dd/MM/yyyy')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SendFeedback;
