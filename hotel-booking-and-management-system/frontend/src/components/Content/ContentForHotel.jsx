import React, { useState, useCallback, Suspense, lazy } from 'react';
import { BuildingOffice2Icon, KeyIcon, CalendarDaysIcon, ChartBarIcon, ChatBubbleLeftRightIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

// Lazy loading các component
const ThongTinKhachSan = lazy(() => import('../ChucNangChoKhachSan/ThongTinKhachSan'));
const QuanLyDanhSachPhong = lazy(() => import('../ChucNangChoKhachSan/QuanLyDanhSachPhong'));
const QuanLyDatPhong = lazy(() => import('../ChucNangChoKhachSan/QuanLyDatPhong'));
const ThongKeDoanhThu = lazy(() => import('../ChucNangChoKhachSan/ThongKeDoanhThu'));
const PhanHoiTuKhachHang = lazy(() => import('../ChucNangChoKhachSan/PhanHoiTuKhachHang'));

// Ánh xạ key với component constructor, thay vì instance
const componentMap = {
  ThongTinKhachSan,
  QuanLyDanhSachPhong,
  QuanLyDatPhong,
  ThongKeDoanhThu,
  PhanHoiTuKhachHang,
};

// Đưa cấu trúc menu ra ngoài component để tránh tạo lại mỗi lần render
const menuItems = [
  { id: 1, name: "Thông tin khách sạn", componentKey: "ThongTinKhachSan", icon: <BuildingOffice2Icon className="h-6 w-6" /> },
  { id: 2, name: "Quản lý danh sách phòng", componentKey: "QuanLyDanhSachPhong", icon: <KeyIcon className="h-6 w-6" /> },
  { id: 3, name: "Quản lý đặt phòng", componentKey: "QuanLyDatPhong", icon: <CalendarDaysIcon className="h-6 w-6" /> },
  { id: 4, name: "Thống kê doanh thu", componentKey: "ThongKeDoanhThu", icon: <ChartBarIcon className="h-6 w-6" /> },
  { id: 5, name: "Phản hồi từ khách hàng", componentKey: "PhanHoiTuKhachHang", icon: <ChatBubbleLeftRightIcon className="h-6 w-6" /> },
];

const ContentForHotel = ({ onLogout }) => {
  // State để lưu component đang được chọn, mặc định là 'Thông tin khách sạn'
  const [selectedComponentKey, setSelectedComponentKey] = useState("ThongTinKhachSan");
  // State để quản lý trạng thái thu gọn của sidebar
  const [isCollapsed, setIsCollapsed] = useState(false);
  // State để quản lý menu trên mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // State để hiển thị loading khi đang đăng xuất
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  const handleMenuItemClick = useCallback((componentKey) => {
    setSelectedComponentKey(componentKey);
    setIsMobileMenuOpen(false); // Tự động đóng menu khi chọn
  }, []);

  const handleLogout = useCallback(async (e) => {
    e.preventDefault();
    if (isLoggingOut) return; // Ngăn chặn multiple click
    
    setIsLoggingOut(true);
    try {
      if (typeof onLogout === 'function') {
        await onLogout();
      }
    } catch (err) {
      console.error('[ContentForHotel] lỗi khi đăng xuất:', err);
    } finally {
      setIsLoggingOut(false);
    }
  }, [onLogout, isLoggingOut]);

  const SelectedComponent = componentMap[selectedComponentKey];

  return (
    <div className="relative">
      {/* Nút Hamburger MỚI cho mobile, đè lên Header */}
      <button 
        onClick={toggleMobileMenu} 
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white/50 backdrop-blur-sm text-gray-800 shadow-md"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      </button>

      {/* Lớp phủ mờ khi menu mobile mở */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleMobileMenu}
        ></div>
      )}

      <div className="flex"> {/* Chuyển sang flexbox để dễ quản lý chiều rộng */}
      {/* Phần 1: Menu bên trái (30% trên desktop) - Cố định */}
      <aside className={`
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        fixed top-[84px] left-0 h-[calc(100vh-84px)] bg-white p-4 z-40 md:translate-x-0
        md:sticky md:top-[88px] md:h-[calc(100vh-88px)]
        ${isCollapsed ? 'w-20' : 'w-64'}
        shadow-lg md:shadow-md flex flex-col flex-shrink-0 transition-all duration-300
      `}>
        <div className="flex flex-col flex-grow">
          <div className="flex items-center justify-end mb-6 border-b pb-4">
            <h2 className={`flex-grow text-xl font-bold text-blue-700 transition-opacity duration-300 whitespace-nowrap overflow-hidden ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
              Bảng điều khiển
            </h2>
            {/* Nút hamburger CŨ, chỉ hiển thị trên desktop */}
            <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-200 flex-shrink-0 z-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
          <nav className="flex-grow">
            <ul>
              {menuItems.map((item) => (
                <li key={item.id} className="mb-2" onClick={() => handleMenuItemClick(item.componentKey)}>
                  <a
                    href="#"
                    className={`flex p-3 rounded-md font-medium transition-colors duration-200 h-12
                      ${isCollapsed ? 'justify-center' : ''} 
                      ${'text-gray-800 hover:bg-blue-100'}
                      ${ 
                      selectedComponentKey === item.componentKey 
                        ? 'bg-blue-600 text-white' // Style cho mục được chọn
                        : ''
                    }`}
                  >
                    <div className="flex items-center">
                      {item.icon}
                      <span className={`ml-4 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                        {item.name}
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="border-t pt-4">
          <a
            href="#"
            className={`flex p-3 rounded-md font-medium transition-colors duration-200 h-12 ${isCollapsed ? 'justify-center' : ''} ${
              isLoggingOut 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-red-600 hover:bg-red-100'
            }`}
            onClick={handleLogout}
          >
            <div className="flex items-center">
              <ArrowLeftOnRectangleIcon className="h-6 w-6" />
              <span className={`ml-4 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
              </span>
            </div>
          </a>
        </div>
      </aside>

      {/* Phần 2: Vùng nội dung bên phải (70% trên desktop) - Có thể cuộn */}
      <main className="flex-grow p-4 md:p-8">
        <Suspense fallback={<div>Đang tải...</div>}>
          <SelectedComponent />
        </Suspense>
      </main>
    </div>
  </div>
  );
};

export default ContentForHotel;