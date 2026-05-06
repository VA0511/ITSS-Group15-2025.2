import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, RefreshCw, Loader2 } from 'lucide-react';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import { memberService } from '@/services/memberService';
import useAuthStore from '@/store/useAuthStore';
import { toast } from '@/utils/toast';

const EditProfile = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    dob: '',
    address: '',
    gender: 'Nam',
    roadmap_goal: '',
    member_free_schedule: '',
  });

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const response = await memberService.getMemberByAccountId(user.id);
        const member = response;
        setFormData({
          id: member.id,
          full_name: member.full_name || '',
          phone: member.phone || '',
          email: member.email || '',
          dob: member.dob ? member.dob.split('T')[0] : '',
          address: member.address || '',
          gender: member.gender || 'Nam',
          account_id: member.account_id,
          is_active: member.is_active ?? true,
          roadmap_goal: member.roadmap_goal || '',
          member_free_schedule: member.member_free_schedule || '',
        });
      } catch (error) {
        console.error('Error fetching member data:', error);
        toast.error('Không thể tải thông tin cá nhân');
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [user?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id) return;

    try {
      setSaving(true);
      const payload = {
        ...formData,
        dob: formData.dob ? `${formData.dob}T00:00:00Z` : undefined,
      };
      await memberService.updateMember(formData.id, payload);
      toast.success('Cập nhật thông tin thành công');
      navigate('/member/profile');
    } catch (error) {
      console.error('Error updating member:', error);
      toast.error('Có lỗi xảy ra khi cập nhật');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto md:max-w-2xl pb-20">
      <div className="flex items-center gap-4 mb-2">
        <Link to="/member/profile">
          <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 shadow-sm rounded-full"><ArrowLeft className="h-5 w-5 text-gray-600" /></Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cập Nhật Hồ Sơ</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm dark:bg-gray-950 dark:border-gray-800 space-y-6">
        <div className="pb-4 border-b border-gray-100 dark:border-gray-800 mb-6 flex justify-center">
            <div className="relative group cursor-pointer">
              <div className="h-28 w-28 rounded-full bg-gray-100 border-4 border-gray-50 shadow-inner flex items-center justify-center overflow-hidden dark:bg-gray-900 dark:border-gray-950">
                 <RefreshCw className="h-8 w-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <p className="text-center text-xs font-semibold text-blue-600 mt-3">Thay Ảnh Đại Diện</p>
            </div>
        </div>

        <Input 
          label="Họ và Tên (*)" 
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          required 
        />
        <Input 
          label="Số điện thoại (*)" 
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          type="tel" 
          required
        />
        <Input 
          label="Email" 
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email" 
        />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">Giới tính</label>
            <select 
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="flex h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">Ngày sinh</label>
            <input 
              name="dob"
              type="date" 
              value={formData.dob}
              onChange={handleChange}
              className="flex h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all dark:border-gray-700 dark:bg-gray-950 dark:text-white" 
            />
          </div>
        </div>

        <Input
          label="Địa chỉ hiện tại"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />

        <div className="border-t border-gray-100 dark:border-gray-800 pt-6 space-y-4">
          <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Thông tin tập luyện</h3>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">Mục tiêu lộ trình</label>
            <textarea
              name="roadmap_goal"
              value={formData.roadmap_goal}
              onChange={handleChange}
              placeholder="VD: Giảm 5kg trong 3 tháng, tăng cơ vai..."
              rows={3}
              className="flex w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all dark:border-gray-700 dark:bg-gray-950 dark:text-white resize-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">Lịch rảnh của bạn</label>
            <textarea
              name="member_free_schedule"
              value={formData.member_free_schedule}
              onChange={handleChange}
              placeholder="VD: Sáng T2, T4, T6 từ 6h-8h..."
              rows={3}
              className="flex w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all dark:border-gray-700 dark:bg-gray-950 dark:text-white resize-none"
            />
          </div>
        </div>

        <div className="pt-6 mt-4">
          <Button 
            type="submit"
            isLoading={saving}
            className="w-full h-12 text-lg font-bold rounded-xl shadow-md" 
            leftIcon={<Save className="h-5 w-5" />}
          >
            Lưu Thông Tin Mới
          </Button>
        </div>
      </form>
    </div>
  );
};
export default EditProfile;
