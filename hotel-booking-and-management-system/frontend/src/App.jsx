import './App.css'
import Header from './components/Header/Header'
import Search from './components/Search/Search'
import Content from './components/Content/Content'
import PaymentPage from './components/CustomerFeatures/PaymentPage'
import HeaderForCustomer from './components/Header/HeaderForCustomer'
import HeaderForAdmin from './components/Header/HeaderForAdmin'
import HeaderForHotel from './components/Header/HeaderForHotel'
import ContentForHotel from './components/Content/ContentForHotel'
import ContentForAdmin from './components/Content/ContentForAdmin'
import ChangePassword from './components/CustomerFeatures/ChangePassword'
import Profile from './components/CustomerFeatures/Profile'
import HotelManagement from './components/AdminFeatures/HotelManagement'
import AmenitiesManagement from './components/AdminFeatures/AmenitiesManagement'
import UserManagement from './components/AdminFeatures/UserManagement'
import HotelList from './components/PartnerFeatures/HotelList'
import { logout } from './serviece/ApiAuth'

import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom'

function App() {
  const [userRole, setUserRole] = useState(null); // null, 'customer', 'hotelowner', 'admin'
  const [userFullName, setUserFullName] = useState('');
  const navigate = useNavigate()
  const location = useLocation();


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
      await logout();
    } catch (err) {
      console.error('[App] lỗi khi đăng xuất:', err);
    } finally {
      setUserRole(null);
      setUserFullName('');
      navigate('/');
    }
  };


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
          <Search />
          <Content />
        </>
      } />

//Customer Page
      <Route path="/customer" element={
        <>
          <HeaderForCustomer onLogout={handleLogout} userFullName={userFullName} />
          <Search />
          <Content />
        </>
      } />

      <Route path="/customer/payment" element={
        userRole === 'customer' ? (
          <>
            <HeaderForCustomer onLogout={handleLogout} userFullName={userFullName} />
            <PaymentPage />
          </>
        ) : (
          <>
            <Header onLogin={handleLogin} />
            <PaymentPage />
          </>
        )
      } />

      <Route path="/customer/change-password" element={
        <>
          <HeaderForCustomer onLogout={handleLogout} userFullName={userFullName} />
          <ChangePassword />
        </>
      } />

      <Route path="/customer/profile" element={
        <>
          <HeaderForCustomer onLogout={handleLogout} userFullName={userFullName} />
          <Profile />
        </>
      } />

      
//Hotel Page
      <Route path="/hotelowner" element={
        <>
          <HeaderForHotel userFullName={userFullName} onLogout={handleLogout} />
          <ContentForHotel onLogout={handleLogout} />
        </>
      } />

      <Route path="/hotelowner/hotel-list" element={
        <>
          <HeaderForHotel userFullName={userFullName} onLogout={handleLogout} />
          <HotelList />
        </>
      } />
      
//Admin Page
      <Route path="/admin" element={
        <>
          <HeaderForAdmin onLogout={handleLogout} userFullName={userFullName} />
          <ContentForAdmin />
        </>
      } />

      <Route path="/admin/hotel-management" element={
        <>
          <HeaderForAdmin onLogout={handleLogout} userFullName={userFullName} />
          <HotelManagement />
        </>
      } />

      <Route path="/admin/amenities-management" element={
        <>
          <HeaderForAdmin onLogout={handleLogout} userFullName={userFullName} />
          <AmenitiesManagement />
        </>
      } />

      <Route path="/admin/user-management" element={
        <>
          <HeaderForAdmin onLogout={handleLogout} userFullName={userFullName} />
          <UserManagement />
        </>
      } />
      

//...
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
