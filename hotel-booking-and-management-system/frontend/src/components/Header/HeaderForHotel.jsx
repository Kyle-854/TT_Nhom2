import React, { useState } from 'react';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';

const HeaderForHotel = ({ onLogout, userFullName }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 left-0 w-full bg-white shadow-md z-40 px-4 sm:px-8 py-4">
        <div className="w-full flex flex-col gap-4">
          {/* Top row: App name and user/menu buttons */}
          <div className="w-full grid grid-cols-3 items-center">
            <div className="justify-start"></div>

            <div className="text-center justify-self-center">
              <Link to="/hotelowner" className="text-2xl font-bold text-blue-600">HotelBooking</Link>
            </div>

            <div className="flex justify-end">
              <div className="hidden md:flex items-center relative">
                <span className="text-gray-700 font-medium mr-4">Xin chào {userFullName}</span>
                <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="p-2 rounded-full hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <Link
                        to="/hotelowner/hotel-list"
                        onClick={() => { setIsProfileMenuOpen(false); navigate('/hotelowner/hotel-list'); }}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Danh sách khách sạn
                      </Link>
                      <button onClick={onLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                </button>
              </div>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 pt-4 space-y-1">
              <span className="block px-4 py-2 text-base font-medium text-gray-800">Xin chào {userFullName}</span>
              <Link
                to="/hotelowner/hotel-list"
                onClick={() => { setIsMenuOpen(false); navigate('/hotelowner/hotel-list'); }}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >Danh sách khách sạn</Link>
              <button onClick={onLogout} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">Đăng xuất</button>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default HeaderForHotel;