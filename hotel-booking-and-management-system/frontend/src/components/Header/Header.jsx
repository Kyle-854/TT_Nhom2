import React, { useState } from 'react';
import './Header.css';
import { login, register } from '../../serviece/ApiAuth';

const Header = ({ onLogin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isConfirmationSuccessOpen, setIsConfirmationSuccessOpen] = useState(false);

  // State cho form đăng nhập
  const [emailOrPhoneNumber, setEmailOrPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // State cho form đăng ký
  const [registerFullName, setRegisterFullName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    try {
      const response = await login(emailOrPhoneNumber, password);
      // response may contain token and user info depending on backend
      if (response) {
        if (typeof onLogin === 'function') onLogin(response);
        setIsLoginOpen(false);
        setEmailOrPhoneNumber('');
        setPassword('');
      }
    } catch (error) {
      console.error('Login failed:', error);
      // error may be an Error with message, or an axios error
      let message = 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.';
      if (error?.body) {
        // normalized error from ApiAuth
        message = error.body?.message || error.body?.error || JSON.stringify(error.body);
      } else if (error?.message) {
        try {
          message = JSON.parse(error.message).message || error.message;
        } catch {
          message = error.message;
        }
      }
      setLoginError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');

    // Validation: Check if all fields are filled
    if (!registerFullName.trim()) {
      setRegisterError('Vui lòng nhập họ và tên.');
      return;
    }
    if (!registerPhone.trim()) {
      setRegisterError('Vui lòng nhập số điện thoại.');
      return;
    }
    if (!registerEmail.trim()) {
      setRegisterError('Vui lòng nhập email.');
      return;
    }
    if (!registerPassword.trim()) {
      setRegisterError('Vui lòng nhập mật khẩu.');
      return;
    }
    if (!registerConfirmPassword.trim()) {
      setRegisterError('Vui lòng nhập xác nhận mật khẩu.');
      return;
    }

    // Validation: Password and confirm password must match
    if (registerPassword !== registerConfirmPassword) {
      setRegisterError('Mật khẩu và xác nhận mật khẩu không trùng khớp.');
      return;
    }

    setIsRegisterLoading(true);

    try {
      // Call register API, only send password (not confirmPassword)
      const response = await register({
        fullName: registerFullName,
        phone: registerPhone,
        email: registerEmail,
        password: registerPassword,
      });

      // Success: show message and reset form
      setRegisterSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
      setRegisterFullName('');
      setRegisterPhone('');
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterConfirmPassword('');

      // Auto-close register dialog after 2 seconds and show login dialog
      setTimeout(() => {
        setIsRegisterOpen(false);
        setIsLoginOpen(true);
      }, 2000);
    } catch (error) {
      console.error('Register failed:', error);
      let message = 'Đăng ký thất bại. Vui lòng thử lại.';
      if (error?.body) {
        message = error.body?.message || error.body?.error || JSON.stringify(error.body);
      } else if (error?.message) {
        try {
          message = JSON.parse(error.message).message || error.message;
        } catch {
          message = error.message;
        }
      }
      setRegisterError(message);
    } finally {
      setIsRegisterLoading(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 left-0 w-full bg-white shadow-md z-40 px-4 sm:px-8 py-4">
        <div className="w-full flex flex-col gap-4">
          {/* Dòng trên: Tên web và các nút */}
          <div className="w-full grid grid-cols-3 items-center md:grid-cols-[auto_1fr_auto]">
            {/* Phần bên trái: Tên App (Desktop) */}
            <div className="justify-self-start">
              {/* Tên App (Desktop) */}
              <span className="hidden md:block text-2xl font-bold text-blue-600">HotelBooking</span>
              <div className="md:hidden w-6 h-6"></div> {/* Placeholder để căn giữa title trên mobile */}
            </div>

            {/* Phần giữa: Tên App (Mobile) / Thanh tìm kiếm (Desktop) */}
            <div className="md:flex md:justify-center md:px-8">
              {/* Tên App (Mobile) */}
              <div className="md:hidden text-center justify-self-center">
                <span className="text-2xl font-bold text-blue-600">HotelBooking</span>
              </div>
              {/* Thanh tìm kiếm (Desktop) */}
              <div className="hidden md:flex w-[80%]">
                <input type="text" placeholder="Tìm kiếm khách sạn..." className="w-full px-4 py-2 border border-gray-300 rounded-l-full" />
                <button className="px-6 py-2 bg-blue-600 text-white rounded-r-full hover:bg-blue-700">Tìm kiếm</button>
              </div>
            </div>

            {/* Phần bên phải: Đăng nhập (Desktop) / Nút hamburger (Mobile) */}
            <div className="justify-self-end">
              {/* Nút đăng nhập (Desktop) */}
              <div className="hidden md:flex">
                <button onClick={() => setIsLoginOpen(true)} className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">Đăng nhập</button>
              </div>
              {/* Nút hamburger (Mobile) */}
              <div className="md:hidden justify-self-end">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Thanh tìm kiếm (Mobile) */}
          <div className="w-full md:hidden">
            <div className="flex w-full">
              <input type="text" placeholder="Tìm kiếm..." className="w-full px-4 py-2 border border-gray-300 rounded-l-full" />
              <button className="px-4 bg-blue-600 text-white rounded-r-full hover:bg-blue-700">Tìm</button>
            </div>
          </div>

          {/* Menu mobile (nếu có) */}
          {isMenuOpen && (
            <div className="md:hidden space-y-2">
              <button onClick={() => { setIsLoginOpen(true); setIsMenuOpen(false); }} className="w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">Đăng nhập</button>
            </div>
          )}
        </div>
      </header>

      {/* --- Dialog Đăng nhập --- */}
      {isLoginOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
          onClick={() => setIsLoginOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 sm:p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setIsLoginOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>
            <form onSubmit={handleLoginSubmit} className="grid gap-y-4">
              {loginError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  {loginError}
                </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email hoặc số điện thoại</label>
                <input
                  type="text" id="email"
                  value={emailOrPhoneNumber}
                  onChange={(e) => setEmailOrPhoneNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                <input
                  type="password" id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-right text-sm">
                <button
                  type="button"
                  onClick={() => { setIsLoginOpen(false); setIsForgotPasswordOpen(true); }}
                  className="font-medium text-blue-600 hover:text-blue-500 bg-transparent border-none p-0 cursor-pointer"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-2 disabled:bg-gray-400 disabled:cursor-not-allowed">
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
              <p className="text-sm text-center text-gray-600 mt-4">
                Bạn chưa có tài khoản? <button type="button" onClick={() => { setIsLoginOpen(false); setIsRegisterOpen(true); }} className="font-medium text-blue-600 hover:text-blue-500 bg-transparent border-none p-0 cursor-pointer">Đăng ký</button>
              </p>
            </form>
          </div>
        </div>
      )}

      {/* --- Dialog Đăng ký --- */}
      {isRegisterOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
          onClick={() => setIsRegisterOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 sm:p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setIsRegisterOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-center mb-6">Đăng ký</h2>
            <form onSubmit={handleRegisterSubmit} className="grid grid-cols-1 sm:grid-cols-5 gap-x-4 gap-y-4">
              {registerError && (
                <div className="sm:col-span-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  {registerError}
                </div>
              )}
              {registerSuccess && (
                <div className="sm:col-span-5 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                  {registerSuccess}
                </div>
              )}
              <div className="sm:col-span-5">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <input 
                  type="text" 
                  id="fullName" 
                  value={registerFullName}
                  onChange={(e) => setRegisterFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div className="sm:col-span-5">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input 
                  type="tel" 
                  id="phone" 
                  value={registerPhone}
                  onChange={(e) => setRegisterPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div className="sm:col-span-5">
                <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  id="register-email" 
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div className="sm:col-span-5">
                <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                <input 
                  type="password" 
                  id="register-password" 
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div className="sm:col-span-5">
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
                <input 
                  type="password" 
                  id="confirm-password" 
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <button 
                type="submit" 
                disabled={isRegisterLoading}
                className="sm:col-span-5 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isRegisterLoading ? 'Đang đăng ký...' : 'Đăng ký'}
              </button>
              <p className="sm:col-span-5 text-sm text-center text-gray-600 mt-2">
                Bạn đã có tài khoản? <button type="button" onClick={() => { setIsRegisterOpen(false); setIsLoginOpen(true); }} className="font-medium text-blue-600 hover:text-blue-500 bg-transparent border-none p-0 cursor-pointer">Đăng nhập</button>
              </p>
            </form>
          </div>
        </div>
      )}

      {/* --- Dialog Quên mật khẩu --- */}
      {isForgotPasswordOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
          onClick={() => setIsForgotPasswordOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 sm:p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setIsForgotPasswordOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-center mb-6">Quên mật khẩu</h2>
            <form className="grid gap-y-4">
              <div>
                <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-1">Nhập Email hoặc số điện thoại</label>
                <input type="text" id="forgot-email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button
                type="button"
                onClick={() => { setIsForgotPasswordOpen(false); setIsConfirmationSuccessOpen(true); }}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-2"
              >Xác nhận</button>
              <p className="text-sm text-center text-gray-600 mt-2">
                <button
                  type="button"
                  onClick={() => { setIsForgotPasswordOpen(false); setIsLoginOpen(true); }}
                  className="font-medium text-blue-600 hover:text-blue-500 bg-transparent border-none p-0 cursor-pointer"
                >Quay lại đăng nhập</button>
              </p>
            </form>
          </div>
        </div>
      )}

      {/* --- Dialog Xác nhận thành công --- */}
      {isConfirmationSuccessOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
          onClick={() => setIsConfirmationSuccessOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 sm:p-8 relative text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-green-600 mb-4">Xác nhận thành công</h2>
            <p className="text-gray-700 mb-6">Vui lòng kiểm tra email hoặc số điện thoại để nhận thông báo reset mật khẩu.</p>
            <div className="grid">
              <button
                type="button"
                onClick={() => {
                  setIsConfirmationSuccessOpen(false);
                  setIsLoginOpen(true);
                }}
                className="font-medium text-blue-600 hover:text-blue-500 bg-transparent border-none p-0 cursor-pointer"
              >
                Quay lại đăng nhập
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
