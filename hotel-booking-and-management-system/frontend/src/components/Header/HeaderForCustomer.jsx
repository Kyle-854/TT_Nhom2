import React, { useState } from 'react';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import BookingHistory from '../CustomerFeatures/BookingHistory';
import Search from '../Search/Search';

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
          {/* Dòng trên: Tên web và các nút */}
          <div className="w-full grid grid-cols-3 items-center md:grid-cols-[auto_1fr_auto]">
            {/* Phần bên trái: Tên App (Desktop) */}
            <div className="justify-self-start">
              {/* Tên App (Desktop) */}
              <Link to="/customer" className="hidden md:block text-2xl font-bold text-blue-600">HotelBooking</Link>
              <div className="md:hidden w-6 h-6"></div> {/* Placeholder để căn giữa title trên mobile */}
            </div>

            {/* Phần giữa: Tên App (Mobile) / Thanh tìm kiếm (Desktop) */}
            <div className="md:flex md:justify-center md:px-8">
              {/* Tên App (Mobile) */}
              <div className="md:hidden text-center justify-self-center">
                <Link to="/customer" className="text-2xl font-bold text-blue-600">HotelBooking</Link>
              </div>
              {/* Thanh tìm kiếm (Desktop) */}
              <div className="hidden md:flex w-[80%]">
                <Search />
              </div>
            </div>

            {/* Phần bên phải: Menu người dùng (Desktop) / Nút hamburger (Mobile) */}
            <div className="justify-self-end">
              {/* Menu người dùng (Desktop) */}
              <div className="hidden md:flex items-center relative">
                <span className="text-gray-700 font-medium mr-4">Xin chào {userFullName}</span>
                <button onClick={toggleProfileMenu} className="p-2 rounded-full hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>

                {/* Menu dropdown cho người dùng */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <button type="button" onClick={goProfile} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">
                        Hồ sơ cá nhân
                      </button>
                      <button type="button" onClick={goChangePassword} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">
                        Đổi mật khẩu
                      </button>
                      <button onClick={() => setIsHistoryOpen(true)} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">
                        Lịch sử đặt phòng
                      </button>
                      <button onClick={onLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">
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
            <Search />
          </div>

          {/* Menu mobile */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 pt-4 space-y-1">
              <span className="block px-4 py-2 text-base font-medium text-gray-800">Xin chào {userFullName}</span>
              <button type="button" onClick={goProfile} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md">
                Hồ sơ cá nhân
              </button>
              <button type="button" onClick={goChangePassword} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md">
                Đổi mật khẩu
              </button>
              <button onClick={() => setIsHistoryOpen(true)} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md">
                Lịch sử đặt phòng
              </button>
              <button onClick={onLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md">
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </header>
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsHistoryOpen(false)} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-3xl z-60 p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Lịch sử đặt phòng</h3>
              <button onClick={() => setIsHistoryOpen(false)} className="px-2 py-1 text-sm bg-gray-200 rounded">Đóng</button>
            </div>
            <BookingHistory />
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderForCustomer;