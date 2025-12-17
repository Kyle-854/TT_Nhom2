import React, { useState } from 'react';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';

const HeaderForAdmin = ({ onLogout, userFullName }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 left-0 w-full bg-white shadow-md z-40 px-4 sm:px-8 py-4">
        <div className="w-full flex flex-col gap-4">
          {/* Dòng trên: Tên web và các nút */}
          <div className="w-full grid grid-cols-3 items-center">
            {/* Phần bên trái */}
            <div className="justify-start"></div>

            {/* Phần giữa: Tên App */}
            <div className="text-center justify-self-center">
              <Link to="/admin" className="text-2xl font-bold text-blue-600">HotelBooking</Link>
            </div>

            {/* Phần bên phải: Menu người dùng (Desktop) / Nút hamburger (Mobile) */}
            <div className="flex justify-end">
              {/* Menu người dùng (Desktop) */}
              <div className="hidden md:flex items-center relative">
                <span className="text-gray-700 font-medium mr-4">Xin chào {userFullName}</span>
                <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="p-2 rounded-full hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>

                {/* Menu dropdown cho người dùng */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <Link
                        to="/admin/hotel-management"
                        onClick={() => { setIsProfileMenuOpen(false); navigate('/admin/hotel-management'); }}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Quản lý khách sạn
                      </Link>
                      <Link to="/admin/amenities-management" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsProfileMenuOpen(false)}>
                        Quản lý tiện ích
                      </Link>
                      <Link to="/admin/user-management" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsProfileMenuOpen(false)}>
                        Quản lý người dùng
                      </Link>
                      <button onClick={onLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Nút hamburger chính (Mobile) */}
              <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Menu mobile (nếu có) */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 pt-4 space-y-1">
              <span className="block px-4 py-2 text-base font-medium text-gray-800">Xin chào {userFullName}</span>
              <Link
                to="/admin/hotel-management"
                onClick={() => { setIsMenuOpen(false); navigate('/admin/hotel-management'); }}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >Quản lý khách sạn</Link>
              <Link to="/admin/amenities-management" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">Quản lý tiện ích</Link>
              <Link to="/admin/user-management" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">Quản lý người dùng</Link>
              <button onClick={onLogout} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">Đăng xuất</button>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default HeaderForAdmin;
