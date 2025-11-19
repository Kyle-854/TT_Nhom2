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
  const [userRole, setUserRole] = useState(null); // null, 'customer', 'hotel', 'admin'
  const navigate = useNavigate()

  // Logic đăng nhập giả lập
  const handleLogin = (emailOrPhoneNumber, password) => {
    if ((emailOrPhoneNumber === 'hotel@gmail.com' || emailOrPhoneNumber === '0911111111') && password === 'hotel') {
      setUserRole('hotel');
    } else if ((emailOrPhoneNumber === 'customer@gmail.com' || emailOrPhoneNumber === '0922222222') && password === 'customer') {
      setUserRole('customer');
    } else if ((emailOrPhoneNumber === 'admin@gmail.com' || emailOrPhoneNumber === '0900000000') && password === 'admin') {
      setUserRole('admin');
    }
  };

  const handleLogout = () => {
    setUserRole(null);
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
          <HeaderForCustomer onLogout={handleLogout} />
          <Content />
        </>
      } />
      
//Hotel Page
      <Route path="/hotel" element={
        <>
          <HeaderForHotel onLogout={handleLogout} />
          <ContentForHotel />
        </>
      } />
      
//Admin Page
      <Route path="/admin" element={
        <>
          <HeaderForAdmin onLogout={handleLogout} />
        </>
      } />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
