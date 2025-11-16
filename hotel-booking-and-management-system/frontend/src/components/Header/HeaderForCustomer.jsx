import React, { useState } from 'react';
import './Header.css';

const HeaderForCustomer = ({ onLogout }) => {
  // Quản lý trạng thái menu trực tiếp trong component
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  // Hàm để bật/tắt menu
  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const toggleProfileMenu = () => setIsProfileMenuOpen(prev => !prev);
  
  return (
    <>
      <header className="sticky top-0 left-0 w-full bg-white shadow-md z-40 px-4 sm:px-8 py-4">
        <div className="w-full flex flex-col gap-4">
          {/* Dòng trên: Tên web và các nút */}
          <div className="w-full grid grid-cols-3 items-center md:grid-cols-[auto_1fr_auto]">
            {/* Phần bên trái: Tên App (Desktop) */}
            <div className="justify-self-start">
              {/* Tên App (Desktop) */}
              <span className="hidden md:block text-2xl font-bold text-blue-600">HotelBooking</span>
              <div className="md:hidden w-6 h-6"></div> {/* Placeholder để căn giữa title trên mobile */}
            </div>

            {/* Phần giữa: Tên App (Mobile) / Thanh tìm kiếm (Desktop) */}
            <div className="md:flex md:justify-center md:px-8">
              {/* Tên App (Mobile) */}
              <div className="md:hidden text-center justify-self-center">
                <span className="text-2xl font-bold text-blue-600">HotelBooking</span>
              </div>
              {/* Thanh tìm kiếm (Desktop) */}
              <div className="hidden md:flex w-[80%]">
                <input type="text" placeholder="Tìm kiếm khách sạn..." className="w-full px-4 py-2 border border-gray-300 rounded-l-full" />
                <button className="px-6 py-2 bg-blue-600 text-white rounded-r-full hover:bg-blue-700">Tìm kiếm</button>
              </div>
            </div>

            {/* Phần bên phải: Menu người dùng (Desktop) / Nút hamburger (Mobile) */}
            <div className="justify-self-end">
              {/* Menu người dùng (Desktop) */}
              <div className="hidden md:flex items-center relative">
                <span className="text-gray-700 font-medium mr-4">Xin chào khách hàng</span>
                <button onClick={toggleProfileMenu} className="p-2 rounded-full hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>

                {/* Menu dropdown cho người dùng */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                        Chỉnh sửa hồ sơ
                      </a>
                      <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 14h14a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                        Thông báo
                      </a>
                      <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v4a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>
                        Lịch sử
                      </a>
                      <button onClick={onLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1-0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Nút hamburger (Mobile) */}
              <div className="md:hidden justify-self-end">
                <button onClick={toggleMenu} className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Thanh tìm kiếm (Mobile) */}
          <div className="w-full md:hidden">
            <div className="flex w-full">
              <input type="text" placeholder="Tìm kiếm..." className="w-full px-4 py-2 border border-gray-300 rounded-l-full" />
              <button className="px-4 bg-blue-600 text-white rounded-r-full hover:bg-blue-700">Tìm</button>
            </div>
          </div>

          {/* Menu mobile */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 pt-4 space-y-1">
              <span className="block px-4 py-2 text-base font-medium text-gray-800">Xin chào khách hàng</span>
              <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                Chỉnh sửa hồ sơ
              </a>
              <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 14h14a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                Thông báo
              </a>
              <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v4a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>
                Lịch sử
              </a>
              <button onClick={onLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1-0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default HeaderForCustomer;