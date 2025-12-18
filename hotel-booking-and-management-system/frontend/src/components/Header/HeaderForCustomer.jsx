import React, { useState } from 'react';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import BookingHistory from '../CustomerFeatures/BookingHistory';

const HeaderForCustomer = ({ onLogout, userFullName }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const toggleProfileMenu = () => setIsProfileMenuOpen(prev => !prev);
  
  const navigate = useNavigate()

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const goChangePassword = () => {
    setIsProfileMenuOpen(false)
    setIsMenuOpen(false)
    navigate('/customer/change-password')
  }

  const goProfile = () => {
    setIsProfileMenuOpen(false)
    setIsMenuOpen(false)
    navigate('/customer/profile')
  }

  return (
    <>
      <header className="sticky top-0 left-0 w-full bg-white shadow-md z-40 px-4 sm:px-8 py-4">
        <div className="w-full flex flex-col gap-4">
          
          {/* Grid 3 cột để căn giữa Logo */}
          <div className="w-full grid grid-cols-3 items-center">
            
            {/* Phần bên trái: Để trống (Spacer) để cân bằng layout */}
            <div className="justify-self-start">
              {/* Có thể thêm nút Back hoặc logo phụ ở đây nếu cần sau này */}
            </div>

            {/* Phần giữa: Tên App (Luôn nằm giữa) */}
            <div className="justify-self-center">
              <Link to="/customer" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                HotelBooking
              </Link>
            </div>

            {/* Phần bên phải: Menu người dùng (Desktop) / Nút hamburger (Mobile) */}
            <div className="justify-self-end">
              
              {/* Menu người dùng (Desktop) */}
              <div className="hidden md:flex items-center relative">
                <span className="text-gray-700 font-medium mr-4">Xin chào {userFullName}</span>
                <button onClick={toggleProfileMenu} className="p-2 rounded-full hover:bg-gray-100 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                {/* Menu dropdown cho người dùng */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 animate-fade-in-down">
                    <div className="py-1">
                      <button type="button" onClick={goProfile} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Hồ sơ cá nhân
                      </button>
                      <button type="button" onClick={goChangePassword} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Đổi mật khẩu
                      </button>
                      <button onClick={() => setIsHistoryOpen(true)} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Lịch sử đặt phòng
                      </button>
                      <button onClick={onLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Nút hamburger (Mobile) */}
              <div className="md:hidden justify-self-end">
                <button onClick={toggleMenu} className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Menu mobile expand */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 pt-4 space-y-1">
              <span className="block px-4 py-2 text-base font-medium text-gray-800 border-b border-gray-100 mb-2">
                Xin chào {userFullName}
              </span>
              <button type="button" onClick={goProfile} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                Hồ sơ cá nhân
              </button>
              <button type="button" onClick={goChangePassword} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                Đổi mật khẩu
              </button>
              <button onClick={() => setIsHistoryOpen(true)} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                Lịch sử đặt phòng
              </button>
              <button onClick={onLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Modal Lịch sử đặt phòng */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsHistoryOpen(false)} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-4xl z-60 p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2 border-b">
              <h3 className="text-xl font-bold text-gray-800">Lịch sử đặt phòng</h3>
              <button onClick={() => setIsHistoryOpen(false)} className="text-gray-500 hover:text-gray-800 text-2xl">
                &times;
              </button>
            </div>
            <BookingHistory />
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderForCustomer;