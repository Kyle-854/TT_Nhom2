import './App.css'
import Header from './components/Header/Header'
import Content from './components/Content/Content'
import HeaderForCustomer from './components/Header/HeaderForCustomer'
import HeaderForAdmin from './components/Header/HeaderForAdmin'
import HeaderForHotel from './components/Header/HeaderForHotel'
import ContentForHotel from './components/Content/ContentForHotel'
import ChangePassword from './components/CustomerFeatures/ChangePassword'
import { logout } from './serviece/ApiAuth'

import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom'

function App() {
  const [userRole, setUserRole] = useState(null); // null, 'customer', 'hotelowner', 'admin'
  const [userFullName, setUserFullName] = useState(''); // Lưu fullName từ login response
  const navigate = useNavigate()
  const location = useLocation();

  // Logic đăng nhập từ API backend
  const handleLogin = (loginResponse) => {
    // Backend trả về roleName: "HotelOwner" | "Admin" | "Customer"
    // Path: "/hotelowner", "/admin", "/customer"
    
    const roleName = loginResponse?.user?.roleName;
    const fullName = loginResponse?.user?.fullName;
    
    if (roleName) {
      // Map roleName từ backend sang path
      let pathRole;
      const roleNameLower = String(roleName).toLowerCase();
      
      if (roleNameLower === 'hotelowner' || roleNameLower === 'hotel') {
        pathRole = 'hotelowner';
      } else if (roleNameLower === 'admin') {
        pathRole = 'admin';
      } else if (roleNameLower === 'customer') {
        pathRole = 'customer';
      } else {
        console.warn('[App] Vai trò không xác định từ backend:', roleName);
        return;
      }
      
      setUserFullName(fullName);
      setUserRole(pathRole);

      navigate(`/${pathRole}`);
    } else {
      console.warn('[App] Không tìm thấy roleName trong response đăng nhập:', loginResponse);
    }
  };

  const handleLogout = async () => {
    try {
      // Gọi API logout từ backend (sẽ xóa token cục bộ trong ApiAuth)
      await logout();
    } catch (err) {
      console.error('[App] lỗi khi đăng xuất:', err);
    } finally {
      // Luôn xóa state và redirect, dù API thành công hay thất bại
      setUserRole(null);
      setUserFullName('');
      navigate('/');
    }
  };

  // Khi userRole thay đổi, điều hướng tới route phù hợp
  useEffect(() => {
    if (userRole && location.pathname === '/') {
      navigate(`/${userRole}`);
    }
  }, [userRole, navigate, location.pathname]);

  return (
    <Routes>
      
//Home Page
      <Route path="/" element={ 
        <>
          <Header onLogin={handleLogin} />
          <Content />
        </>
      } />

//Customer Page
      <Route path="/customer" element={
        <>
          <HeaderForCustomer onLogout={handleLogout} userFullName={userFullName} />
          <Content />
        </>
      } />

      <Route path="/customer/change-password" element={
        <>
          <HeaderForCustomer onLogout={handleLogout} userFullName={userFullName} />
          <ChangePassword />
        </>
      } />

      
//Hotel Page
      <Route path="/hotelowner" element={
        <>
          <HeaderForHotel userFullName={userFullName} onLogout={handleLogout} />
          <ContentForHotel onLogout={handleLogout} />
        </>
      } />
      
//Admin Page
      <Route path="/admin" element={
        <>
          <HeaderForAdmin onLogout={handleLogout} userFullName={userFullName} />
        </>
      } />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
