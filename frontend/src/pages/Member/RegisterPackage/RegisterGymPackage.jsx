import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart, ArrowRight, CheckCircle2, Video, Image as ImageIcon,
  CreditCard, ShieldCheck, HelpCircle, Loader2, AlertTriangle,
  ChevronDown, ChevronUp, Dumbbell, Zap, Leaf, Swords, Waves
} from 'lucide-react';
import Button from '@/components/Common/Button';
import { usePackages, useMemberPackages } from '@/hooks/queries/usePackages';
import { useMyMemberProfile } from '@/hooks/queries/useMembers';

// Category IDs
const BASIC_CATEGORY_IDS = [1, 2, 3]; // VIP, Normal, Female-only
const SPECIALTY_CATEGORY_IDS = [4, 5, 6, 7, 8]; // Aerobic, Yoga, Boxing, Pilates, Dưỡng sinh

const SPECIALTY_META = {
  4: { label: 'Aerobic', icon: Zap, color: 'orange', description: 'Tăng cường sức bền tim mạch, đốt mỡ hiệu quả' },
  5: { label: 'Yoga', icon: Leaf, color: 'green', description: 'Cải thiện linh hoạt, giảm stress, tăng cường tâm trí' },
  6: { label: 'Boxing', icon: Swords, color: 'red', description: 'Rèn luyện sức mạnh, phản xạ và tự vệ' },
  7: { label: 'Pilates', icon: Waves, color: 'purple', description: 'Tăng cường cơ lõi, cải thiện tư thế và thăng bằng' },
  8: { label: 'Dưỡng sinh', icon: Leaf, color: 'teal', description: 'Yoga, Pilates, Dưỡng sinh – cải thiện linh hoạt và tâm trí' },
};

const SPECIALTY_COLOR = {
  orange: { badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800', dot: 'bg-orange-500', ring: 'ring-orange-400' },
  green:  { badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',   border: 'border-green-200 dark:border-green-800',   dot: 'bg-green-500',  ring: 'ring-green-400' },
  red:    { badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',           border: 'border-red-200 dark:border-red-800',         dot: 'bg-red-500',    ring: 'ring-red-400' },
  purple: { badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800', dot: 'bg-purple-500', ring: 'ring-purple-400' },
  teal:   { badge: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',       border: 'border-teal-200 dark:border-teal-800',       dot: 'bg-teal-500',   ring: 'ring-teal-400' },
};

const RegisterGymPackage = () => {
  const { data: apiPackages = [], isLoading } = usePackages();
  const { data: memberPackagesRaw } = useMemberPackages();
  const { data: memberProfile } = useMyMemberProfile();
  const navigate = useNavigate();

  const [selectedPkg, setSelectedPkg] = useState(null);
  const [expandedSpecialties, setExpandedSpecialties] = useState({});

  const memberGender = (() => {
    const g = (memberProfile?.gender || '').toLowerCase().trim();
    if (g.includes('nữ') || g.includes('nu') || g.includes('female')) return 'Female';
    if (g.includes('nam') || g.includes('male')) return 'Male';
    return null;
  })();

  // Parse member active subscriptions
  const memberSubs = (() => {
    const raw = memberPackagesRaw;
    const arr = Array.isArray(raw) ? raw
      : Array.isArray(raw?.data?.data) ? raw.data.data
      : Array.isArray(raw?.data) ? raw.data
      : [];
    return arr.filter(s => s.status === 'active' || s.status === 'Active');
  })();

  // Active basic subscription (category 1,2,3)
  const activeBasicSub = memberSubs.find(s => BASIC_CATEGORY_IDS.includes(s.category_id));

  // Active specialty subscriptions keyed by category_id
  const activeSpecialtyMap = {};
  memberSubs
    .filter(s => SPECIALTY_CATEGORY_IDS.includes(s.category_id))
    .forEach(s => { activeSpecialtyMap[s.category_id] = s; });

  // All packages as array
  const rawPackages = Array.isArray(apiPackages) ? apiPackages : (apiPackages.data || []);

  // Basic packages (categories 1-3), gender-filtered
  const basicPackages = rawPackages
    .filter(pkg => BASIC_CATEGORY_IDS.includes(pkg.category_id))
    .filter(pkg => {
      const g = (pkg.allowed_gender || '').toLowerCase();
      if (g.includes('female') || pkg.category_name === 'Female-only') return memberGender !== 'Male';
      return true;
    });

  // Specialty packages grouped by category
  const specialtyGroups = (() => {
    const groups = {};
    rawPackages
      .filter(pkg => SPECIALTY_CATEGORY_IDS.includes(pkg.category_id))
      .forEach(pkg => {
        if (!groups[pkg.category_id]) groups[pkg.category_id] = { categoryId: pkg.category_id, categoryName: pkg.category_name, packages: [] };
        groups[pkg.category_id].packages.push(pkg);
      });
    // Sort packages in each group by price
    Object.values(groups).forEach(g => g.packages.sort((a, b) => a.price - b.price));
    return Object.values(groups).sort((a, b) => a.categoryId - b.categoryId);
  })();

  // Auto-select first basic package
  useEffect(() => {
    if (basicPackages.length > 0 && !selectedPkg) {
      setSelectedPkg(basicPackages[0]);
    }
  }, [basicPackages.length]);

  const toggleSpecialty = (categoryId) => {
    setExpandedSpecialties(prev => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  // Determine action state for a selected package
  const getActionState = (pkg) => {
    if (!pkg) return { label: 'Chọn gói tập', disabled: true, variant: 'gray' };

    if (BASIC_CATEGORY_IDS.includes(pkg.category_id)) {
      if (!activeBasicSub) return { action: 'register', label: 'Đăng Ký', disabled: false, variant: 'blue' };
      const activeIsVip = activeBasicSub.category_id === 1;
      if (activeIsVip) return { action: 'highest', label: 'Gói VIP cao nhất', disabled: true, variant: 'purple' };
      if (pkg.category_id === 1) return { action: 'upgrade', label: 'Nâng Cấp Lên VIP', disabled: false, variant: 'blue' };
      return { action: 'blocked', label: 'Không thể đăng ký', disabled: true, variant: 'gray' };
    } else {
      const activeSameCat = activeSpecialtyMap[pkg.category_id];
      if (!activeSameCat) return { action: 'register', label: 'Đăng Ký', disabled: false, variant: 'blue' };
      return { action: 'active', label: 'Danh mục đang hoạt động', disabled: true, variant: 'green' };
    }
  };

  const handleCheckout = () => {
    if (!selectedPkg) return;
    const { action } = getActionState(selectedPkg);
    if (action === 'blocked' || action === 'highest' || action === 'active') return;
    navigate('/member/register/checkout', {
      state: {
        package: { ...selectedPkg, name: selectedPkg.package_name, priceRaw: selectedPkg.price, duration: selectedPkg.duration_days },
        isUpgrade: action === 'upgrade',
        activePackageName: activeBasicSub?.package_name,
      }
    });
  };

  const actionState = getActionState(selectedPkg);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Đăng Ký Gói Tập</h1>
        <p className="text-gray-500 text-sm mt-2">Chọn gói tập phù hợp và hoàn tất thanh toán qua thẻ / Momo / VNPay.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ── LEFT: Package List ── */}
        <div className="xl:col-span-2 space-y-8">

          {/* SECTION 1: Gói Tập Cơ Bản */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Dumbbell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Gói Tập Cơ Bản</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Chỉ đăng ký 1 gói tại một thời điểm. Có thể nâng cấp từ thường lên VIP.</p>
              </div>
            </div>

            {activeBasicSub && (
              <div className={`mb-4 rounded-xl border p-3 flex items-start gap-3 ${
                activeBasicSub.category_id === 1
                  ? 'border-purple-200 bg-purple-50 dark:bg-purple-900/10 dark:border-purple-800'
                  : 'border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-800'
              }`}>
                {activeBasicSub.category_id === 1
                  ? <ShieldCheck className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                  : <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />}
                <div>
                  <p className={`text-xs font-semibold ${activeBasicSub.category_id === 1 ? 'text-purple-700 dark:text-purple-300' : 'text-amber-700 dark:text-amber-300'}`}>
                    Đang có gói "{activeBasicSub.package_name}" còn hiệu lực
                    {activeBasicSub.category_id === 1 ? ' — đây là gói cao nhất' : ' — chỉ có thể nâng cấp lên VIP'}
                  </p>
                </div>
              </div>
            )}

            {/* Group basic: Normal, VIP (Female-only merged with Normal for layout) */}
            {['VIP', 'Normal', 'Female-only'].map(catName => {
              const pkgs = basicPackages.filter(p => p.category_name === catName);
              if (pkgs.length === 0) return null;
              const isVip = catName === 'VIP';
              const isFemale = catName === 'Female-only';
              return (
                <div key={catName} className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      isVip ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                      : isFemale ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {isVip ? 'VIP' : isFemale ? 'Dành cho Nữ' : 'Cơ Bản'}
                    </span>
                    <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
                  </div>
                  <div className="grid gap-2">
                    {pkgs.map(pkg => {
                      const isSelected = selectedPkg?.id === pkg.id;
                      const isCurrentActive = memberSubs.some(s => s.package_id === pkg.id);
                      return (
                        <button
                          key={pkg.id}
                          onClick={() => setSelectedPkg(pkg)}
                          className={`w-full rounded-xl border-2 px-5 py-4 cursor-pointer transition-all flex items-center justify-between relative text-left ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-900/20 shadow-sm'
                              : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 hover:border-blue-300'
                          }`}
                        >
                          {pkg.duration_days >= 180 && (
                            <div className="absolute -top-2.5 right-4 bg-red-500 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-widest">
                              Tiết kiệm nhất
                            </div>
                          )}
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300 dark:border-gray-600'}`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">{pkg.package_name}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{pkg.duration_days} ngày</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isCurrentActive && (
                              <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full font-semibold">Đang dùng</span>
                            )}
                            <p className="font-extrabold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                              {pkg.price.toLocaleString('vi-VN')} đ
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* SECTION 2: Gói Tập Chuyên Biệt */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Gói Tập Chuyên Biệt</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Có thể đăng ký nhiều loại cùng lúc miễn là khác danh mục (vd: vừa Yoga vừa Boxing).</p>
              </div>
            </div>

            {Object.keys(activeSpecialtyMap).length > 0 && (
              <div className="mb-4 rounded-xl border border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800 p-3 flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                <p className="text-xs text-green-700 dark:text-green-300 font-medium">
                  Đang hoạt động: {Object.values(activeSpecialtyMap).map(s => s.package_name).join(', ')}
                </p>
              </div>
            )}

            <div className="space-y-3 mt-4">
              {specialtyGroups.map(group => {
                const meta = SPECIALTY_META[group.categoryId] || { label: group.categoryName, icon: Zap, color: 'orange', description: '' };
                const colors = SPECIALTY_COLOR[meta.color] || SPECIALTY_COLOR.orange;
                const isExpanded = !!expandedSpecialties[group.categoryId];
                const isActiveCategory = !!activeSpecialtyMap[group.categoryId];

                return (
                  <div key={group.categoryId} className={`rounded-2xl border-2 overflow-hidden transition-all ${isExpanded ? colors.border : 'border-gray-200 dark:border-gray-800'}`}>
                    {/* Category Header */}
                    <button
                      onClick={() => toggleSpecialty(group.categoryId)}
                      className="w-full flex items-center justify-between px-5 py-4 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${colors.badge}`}>
                          {meta.label}
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">{meta.description}</p>
                        {isActiveCategory && (
                          <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full font-semibold">Đang hoạt động</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 shrink-0">
                        <span className="text-xs">{group.packages.length} gói</span>
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </button>

                    {/* Packages inside category */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 dark:border-gray-800 px-5 pb-4 pt-3 bg-gray-50/50 dark:bg-gray-900/30 space-y-2">
                        {group.packages.map(pkg => {
                          const isSelected = selectedPkg?.id === pkg.id;
                          return (
                            <button
                              key={pkg.id}
                              onClick={() => setSelectedPkg(pkg)}
                              className={`w-full rounded-xl border-2 px-4 py-3 cursor-pointer transition-all flex items-center justify-between text-left ${
                                isSelected
                                  ? `border-current ${colors.border} bg-white dark:bg-gray-950 shadow-sm ring-1 ${colors.ring}`
                                  : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? `border-current bg-current` : 'border-gray-300 dark:border-gray-600'}`}
                                  style={isSelected ? { backgroundColor: '' } : {}}>
                                  {isSelected && <div className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />}
                                  {!isSelected && <div className="w-1.5 h-1.5 rounded-full bg-transparent" />}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{pkg.package_name}</p>
                                  <p className="text-xs text-gray-400">{pkg.duration_days} ngày</p>
                                </div>
                              </div>
                              <p className="font-extrabold text-blue-600 dark:text-blue-400 text-sm whitespace-nowrap">
                                {pkg.price.toLocaleString('vi-VN')} đ
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info section */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-blue-500" />Hỗ trợ thanh toán
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {['VISA', 'MoMo', 'VNPay'].map(m => (
                    <div key={m} className="px-3 py-1 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300">{m}</div>
                  ))}
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-5 border border-blue-100 dark:border-blue-900/30">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-green-500" />Cam kết của chúng tôi
                </h3>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Kích hoạt gói ngay lập tức</li>
                  <li>• Quản lý lịch tập trực tuyến</li>
                  <li>• Bảo mật thanh toán tuyệt đối</li>
                </ul>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                <HelpCircle className="h-4 w-4 text-gray-500" />Lưu ý quan trọng
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2 bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-200 dark:border-yellow-900/30">
                <p>Mọi thắc mắc liên hệ hotline hỗ trợ: <strong>1900 8888</strong></p>
                <p>Gói tập sẽ được kích hoạt ngay sau khi thanh toán thành công.</p>
                <p>Gói chuyên biệt có thể đăng ký đồng thời nhiều loại khác nhau (Yoga + Boxing, v.v.).</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Package Detail Panel ── */}
        <div className="sticky top-24 h-fit">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg shadow-gray-200/50 dark:border-gray-800 dark:bg-gray-950 dark:shadow-none">
            {!selectedPkg ? (
              <div className="text-center py-10 text-gray-400 dark:text-gray-500 text-sm">Chọn một gói tập để xem chi tiết</div>
            ) : (() => {
              const isSpecialty = SPECIALTY_CATEGORY_IDS.includes(selectedPkg.category_id);
              const meta = isSpecialty ? (SPECIALTY_META[selectedPkg.category_id] || {}) : {};
              const benefits = selectedPkg.description
                ? selectedPkg.description.split(',').map(s => s.trim()).filter(Boolean)
                : isSpecialty
                ? [meta.description || selectedPkg.category_name]
                : ['Sử dụng toàn bộ máy tập cardio và tạ', 'Tủ để đồ cá nhân', 'Truy cập lớp tập nhóm'];
              const imgUrl = isSpecialty
                ? 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600'
                : selectedPkg.category_name === 'VIP'
                ? 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=600'
                : 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600';

              return (
                <>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Chi tiết gói</h2>
                  <div className={`mb-3 inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    isSpecialty
                      ? (SPECIALTY_COLOR[meta.color]?.badge || 'bg-gray-100 text-gray-600')
                      : selectedPkg.category_name === 'VIP'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                      : selectedPkg.category_name === 'Female-only'
                      ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {isSpecialty ? meta.label : (selectedPkg.category_name === 'Female-only' ? 'Dành cho Nữ' : selectedPkg.category_name)}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{selectedPkg.package_name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Thời hạn: {selectedPkg.duration_days} ngày</p>

                  <div className="space-y-3 mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />Quyền lợi bao gồm
                    </h4>
                    <ul className="space-y-2">
                      {benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
                        <ImageIcon className="h-3.5 w-3.5 text-blue-600" />Không gian
                      </div>
                      <div className="rounded-lg overflow-hidden aspect-video border border-gray-200 dark:border-gray-800">
                        <img src={imgUrl} alt={selectedPkg.package_name} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
                        <Video className="h-3.5 w-3.5 text-red-500" />Video
                      </div>
                      <div className="rounded-lg overflow-hidden aspect-video border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900">
                        <video key={selectedPkg.id} className="w-full h-full object-cover" controls poster={imgUrl}>
                          <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                        </video>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Tổng thanh toán</span>
                    <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                      {selectedPkg.price?.toLocaleString('vi-VN')} đ
                    </span>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full h-11 text-sm font-bold rounded-xl"
                    leftIcon={<ShoppingCart className="h-4 w-4" />}
                    rightIcon={<ArrowRight className="h-4 w-4 opacity-70" />}
                    disabled={actionState.disabled}
                  >
                    {actionState.label}
                  </Button>
                  {actionState.action === 'highest' && (
                    <p className="text-xs text-purple-600 dark:text-purple-400 text-center mt-2">Bạn đang dùng gói VIP cao nhất</p>
                  )}
                  {actionState.action === 'blocked' && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 text-center mt-2">Chọn gói VIP để nâng cấp</p>
                  )}
                  {actionState.action === 'active' && (
                    <p className="text-xs text-green-600 dark:text-green-400 text-center mt-2">Danh mục này đang còn hiệu lực</p>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterGymPackage;
