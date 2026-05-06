import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowRight, CheckCircle2, Video, Image as ImageIcon, CreditCard, ShieldCheck, HelpCircle, Loader2 } from 'lucide-react';
import Button from '@/components/Common/Button';
import { usePackages } from '@/hooks/queries/usePackages';

const RegisterGymPackage = () => {
  const { data: apiPackages = [], isLoading } = usePackages();
  const [selectedPkg, setSelectedPkg] = useState(null);
  const navigate = useNavigate();

  // Map API packages to UI format
  const mappedPackages = (apiPackages.data || apiPackages).map(pkg => ({
    id: pkg.id,
    name: pkg.package_name,
    price: pkg.price.toLocaleString('vi-VN') + ' đ',
    priceRaw: pkg.price,
    type: pkg.category_name === 'VIP' ? 'vip' : 'normal',
    gender: (() => {
      const raw = (pkg.allowed_gender || '').trim().toLowerCase();
      if (raw.includes('female') || raw.includes('nữ') || raw.includes('nu') || pkg.category_name === 'Female-only') return 'Female';
      if (raw.includes('male') || raw.includes('nam')) return 'Male';
      if (raw === '' && (pkg.package_name.toLowerCase().includes('nữ') || pkg.category_name === 'Female-only')) return 'Female';
      return 'All';
    })(),
    best: pkg.package_name.includes('Tặng') || pkg.duration_days >= 180,
    description: pkg.description || "Trải nghiệm đầy đủ trang thiết bị tiêu chuẩn tại phòng tập. Phù hợp cho mọi đối tượng tập luyện.",
    facilities: pkg.description ? pkg.description.split(',').map(s => s.trim()) : [
      "Sử dụng toàn bộ máy tập cardio và tạ",
      "Tủ để đồ cá nhân tiêu chuẩn",
      "Truy cập các lớp tập nhóm"
    ],
    duration: pkg.duration_days,
    image: pkg.category_name === 'VIP' 
      ? "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=600"
      : "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  }));

  const malePackages = mappedPackages.filter(pkg => pkg.gender === 'Male' || pkg.gender === 'All');
  const femalePackages = mappedPackages.filter(pkg => pkg.gender === 'Female' || pkg.gender === 'All');

  useEffect(() => {
    if (mappedPackages.length > 0 && !selectedPkg) {
      setSelectedPkg(mappedPackages[0]);
    }
  }, [mappedPackages, selectedPkg]);

  const handleSelectPackage = (pkg) => {
    setSelectedPkg(pkg);
  };

  const handleCheckout = () => {
    if (!selectedPkg) return;
    navigate('/member/register/checkout', { state: { package: selectedPkg } });
  };

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
        <p className="text-gray-500 text-sm mt-2">Chọn gói tập phù hợp với giới tính của bạn và hoàn tất thanh toán qua thẻ / Momo / VNPay.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Panel: Male & Female Packages */}
        <div className="xl:col-span-2 space-y-6">
          {/* Male Packages Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Gói Tập Nam</h2>
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-semibold">Nam</span>
            </div>
            <div className="grid gap-3">
              {malePackages.map(pkg => (
                <label 
                  key={pkg.id} 
                  onClick={() => handleSelectPackage(pkg)}
                  className={`rounded-xl border-2 p-5 cursor-pointer transition-all flex items-center justify-between relative ${selectedPkg?.id === pkg.id ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-md' : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 hover:border-blue-300'}`}
                >
                  {pkg.best && <div className="absolute -top-3 right-4 bg-red-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-sm tracking-widest">Tiết kiệm nhất</div>}
                  <div className="flex items-center gap-4">
                    <input 
                      type="radio" 
                      name="package" 
                      checked={selectedPkg?.id === pkg.id} 
                      onChange={() => handleSelectPackage(pkg)} 
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                    />
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-lg">{pkg.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {pkg.type === 'vip' ? 'Gói VIP' : 'Gói Cơ Bản'}
                      </p>
                    </div>
                  </div>
                  <p className="font-extrabold text-lg text-blue-600 dark:text-blue-400">{pkg.price}</p>
                </label>
              ))}
            </div>
          </div>

          {/* Female Packages Section */}
          <div className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Gói Tập Nữ</h2>
              <span className="text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 px-3 py-1 rounded-full font-semibold">Nữ</span>
            </div>
            <div className="grid gap-3">
              {femalePackages.map(pkg => (
                <label 
                  key={pkg.id} 
                  onClick={() => handleSelectPackage(pkg)}
                  className={`rounded-xl border-2 p-5 cursor-pointer transition-all flex items-center justify-between relative ${selectedPkg?.id === pkg.id ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-md' : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 hover:border-blue-300'}`}
                >
                  {pkg.best && <div className="absolute -top-3 right-4 bg-red-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-sm tracking-widest">Tiết kiệm nhất</div>}
                  <div className="flex items-center gap-4">
                    <input 
                      type="radio" 
                      name="package" 
                      checked={selectedPkg?.id === pkg.id} 
                      onChange={() => handleSelectPackage(pkg)} 
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                    />
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-lg">{pkg.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {pkg.type === 'vip' ? 'Gói VIP' : 'Gói Cơ Bản'}
                      </p>
                    </div>
                  </div>
                  <p className="font-extrabold text-lg text-blue-600 dark:text-blue-400">{pkg.price}</p>
                </label>
              ))}
            </div>
          </div>

          {/* Info Sections */}
          <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-blue-500" />
                  Hỗ trợ thanh toán
                </h3>
                <div className="flex gap-2 flex-wrap">
                  <div className="px-3 py-1 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-xs font-bold text-blue-600">VISA</div>
                  <div className="px-3 py-1 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-xs font-bold text-pink-500">MoMo</div>
                  <div className="px-3 py-1 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-xs font-bold text-sky-500">VNPay</div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-5 border border-blue-100 dark:border-blue-900/30">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                  Cam kết của chúng tôi
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
                <HelpCircle className="h-4 w-4 text-gray-500" />
                Lưu ý quan trọng
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2 bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-200 dark:border-yellow-900/30">
                <p>Mọi thắc mắc liên hệ hotline hỗ trợ: <strong>1900 8888</strong></p>
                <p>Gói tập sẽ được kích hoạt ngay sau khi thanh toán thành công. Bảo lưu chỉ áp dụng cho gói 6 tháng trở lên.</p>
                <p>Nữ giới sẽ có khu vực tập riêng biệt để đảm bảo sự thoải mái và an toàn.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Package Details */}
        <div className="sticky top-24 h-fit">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg shadow-gray-200/50 dark:border-gray-800 dark:bg-gray-950 dark:shadow-none">
            {!selectedPkg ? (
              <div className="text-center py-10 text-gray-500">Vui lòng chọn một gói tập</div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Chi tiết gói</h2>
                
                <div className="mb-4 inline-block px-3 py-1 rounded-full text-xs font-semibold" style={{
                  backgroundColor: selectedPkg.gender === 'Male' ? '#dbeafe' : (selectedPkg.gender === 'Female' ? '#fce7f3' : '#f3f4f6'),
                  color: selectedPkg.gender === 'Male' ? '#1e40af' : (selectedPkg.gender === 'Female' ? '#be185d' : '#374151')
                }}>
                  {selectedPkg.gender === 'Male' ? 'Dành cho Nam' : (selectedPkg.gender === 'Female' ? 'Dành cho Nữ' : 'Dành cho Tất cả')}
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{selectedPkg.name}</h3>
                
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 text-sm">
                  {selectedPkg.description}
                </p>

                <div className="space-y-4 mb-8">
                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Quyền lợi bao gồm
                  </h4>
                  <ul className="space-y-3">
                    {selectedPkg.facilities.map((fac, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                        {fac}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-900 dark:text-white">
                      <ImageIcon className="h-4 w-4 text-blue-600" /> Không gian
                    </div>
                    <div className="rounded-lg overflow-hidden aspect-video border border-gray-200 dark:border-gray-800 group relative">
                      <img src={selectedPkg.image} alt={selectedPkg.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-900 dark:text-white">
                      <Video className="h-4 w-4 text-red-500" /> Video
                    </div>
                    <div className="rounded-lg overflow-hidden aspect-video border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 relative">
                      <video 
                        key={selectedPkg.id}
                        className="w-full h-full outline-none object-cover" 
                        controls 
                        poster={selectedPkg.image}
                      >
                        <source src={selectedPkg.videoUrl} type="video/mp4" />
                      </video>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleCheckout}
                  className="w-full h-12 text-base font-bold rounded-xl" 
                  leftIcon={<ShoppingCart className="h-5 w-5" />} 
                  rightIcon={<ArrowRight className="h-5 w-5 opacity-70" />}
                >
                  Thanh Toán Nhanh
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterGymPackage;
