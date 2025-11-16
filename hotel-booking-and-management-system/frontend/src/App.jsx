import './App.css'
import Header from './components/Header/Header'
import HeaderForCustomer from './components/Header/HeaderForCustomer'
import HeaderForAdmin from './components/Header/HeaderForAdmin'
import HeaderForHotel from './components/Header/HeaderForHotel'
import ContentForHotel from './components/Content/ContentForHotel'

import { useState } from 'react'

function App() {
  const [userRole, setUserRole] = useState(null); // null, 'customer', 'hotel', 'admin'

  // Logic đăng nhập giả lập
  const handleLogin = (emailOrPhone, password) => {
    if ((emailOrPhone === 'hotel@gmail.com' || emailOrPhone === '0911111111') && password === 'hotel') {
      setUserRole('hotel');
    } else if ((emailOrPhone === 'customer@gmail.com' || emailOrPhone === '0922222222') && password === 'customer') {
      setUserRole('customer');
    } else if ((emailOrPhone === 'admin@gmail.com' || emailOrPhone === '0900000000') && password === 'admin') {
      setUserRole('admin');
    }
  };

  const handleLogout = () => {
    setUserRole(null);
  };

  if (userRole === 'customer') {
    return (
      <>
        <HeaderForCustomer onLogout={handleLogout} />
        {/* Thêm nội dung cho trang customer ở đây */}
      </>
    )
  } else if (userRole === 'hotel') {
    return (
      <>
        <HeaderForHotel onLogout={handleLogout} />
        <ContentForHotel />
      </>
    )
  } else if (userRole === 'admin') {
    return (
      <>
        <HeaderForAdmin onLogout={handleLogout} />
        {/* Thêm nội dung cho trang admin ở đây */}
      </>
    )
  }

  return (
    <>
      <Header onLogin={handleLogin} />
    </>
  )
}

export default App
