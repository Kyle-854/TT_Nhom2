import './App.css'
import Header from './components/Header/Header'
import Content from './components/Content/Content'
import HeaderForCustomer from './components/Header/HeaderForCustomer'
import HeaderForAdmin from './components/Header/HeaderForAdmin'
import HeaderForHotel from './components/Header/HeaderForHotel'
import ContentForHotel from './components/Content/ContentForHotel'

import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'

function App() {
  const [userRole, setUserRole] = useState(null); // null, 'customer', 'hotelowner', 'admin'
  const [userFullName, setUserFullName] = useState(''); // Lưu fullName từ login response
  const navigate = useNavigate()

  // Logic đăng nhập từ API backend
  const handleLogin = (loginResponse) => {
    // Backend trả về roleName: "HotelOwner" | "Admin" | "Customer"
    // Path: "/hotelowner", "/admin", "/customer"
    
    const roleName = loginResponse?.user?.roleName || loginResponse?.roleName || loginResponse?.user?.role || loginResponse?.role;
    const fullName = loginResponse?.user?.fullName || loginResponse?.fullName || loginResponse?.user?.name || loginResponse?.name || '';
    
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
    } else {
      console.warn('[App] Không tìm thấy roleName trong response đăng nhập:', loginResponse);
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setUserFullName('');
    navigate('/')
  };

  // Khi userRole thay đổi, điều hướng tới route phù hợp
  useEffect(() => {
    if (userRole) {
      navigate(`/${userRole}`)
    }
  }, [userRole, navigate])

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
      
//Hotel Page
      <Route path="/hotelowner" element={
        <>
          <HeaderForHotel onLogout={handleLogout} userFullName={userFullName} />
          <ContentForHotel />
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
