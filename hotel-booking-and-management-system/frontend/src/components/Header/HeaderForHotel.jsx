import React from 'react';
import './Header.css';

const HeaderForHotel = ({ userFullName }) => {
  return (
    <>
      <header className="sticky top-0 left-0 w-full bg-white shadow-md z-40 px-4 sm:px-8 py-4">
        {/* Layout cho Desktop (>=md) */}
        <div className="hidden md:grid w-full grid-cols-3 items-center">
          {/* Cột trái (trống để căn giữa) */}
          <div />
          {/* Cột giữa: Tên web */}
          <div className="text-center">
            <span className="text-2xl font-bold text-blue-600">HotelBooking</span>
          </div>
          {/* Cột phải: Lời chào */}
          <div className="text-right">
            <span className="text-gray-700 font-medium">Xin chào {userFullName}</span>
          </div>
        </div>
        {/* Layout cho Mobile (<md) */}
        <div className="md:hidden flex flex-col items-center">
          <span className="text-2xl font-bold text-blue-600">HotelBooking</span>
          <span className="text-sm text-gray-600 mt-1">Xin chào {userFullName}</span>
        </div>
      </header>
    </>
  );
};

export default HeaderForHotel;