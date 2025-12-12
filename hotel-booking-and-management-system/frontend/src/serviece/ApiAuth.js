import apiClient from './axiosClient';
import { normalizeError } from './apiUtils';

export async function login(identifier, password) {
  try {
    const res = await apiClient.post('/api/users/Auth/login', {
      emailOrPhoneNumber: identifier,
      password,
    });
    const data = res.data;

    const token = data?.token; //Đây là đường dẫn để lấy token từ endpoint login
    if (token) {
      localStorage.setItem('authToken', token);
    }
    return data;
  } catch (err) {
    throw normalizeError(err, 'Đăng nhập thất bại');
  }
}

export async function register(userData) {
  try {
    const res = await apiClient.post('/api/users/Auth/register', userData);
    return res.data;
  } catch (err) {
    throw normalizeError(err, 'Đăng ký thất bại');
  }
}

export async function getCurrentUser() {
  const endpoints = ['/api/users/Auth/user-info', '/api/users/User/me'];
  let lastError = null;
  
  for (const ep of endpoints) {
    try {
      const res = await apiClient.get(ep);
      return res.data;
    } catch (err) {
      lastError = err;
    }
  }
  throw normalizeError(lastError, 'Lấy thông tin user thất bại');
}

export async function changePassword({ currentPassword, newPassword }) {
  try {
    const res = await apiClient.put('/api/users/Auth/change-password', {
      currentPassword,
      newPassword,
    });
    return res.data;
  } catch (err) {
    throw normalizeError(err, 'Đổi mật khẩu thất bại');
  }
}

export async function forgotPassword(identifier) {
  try {
    const res = await apiClient.post('/api/users/Auth/forgot-password', { email: identifier });
    return res.data;
  } catch (err) {
    throw normalizeError(err, 'Yêu cầu đặt lại mật khẩu thất bại');
  }
}

export async function resetPassword({ token, newPassword }) {
  try {
    const res = await apiClient.post('/api/users/Auth/reset-password', {
      token: token,       
      newPassword: newPassword,
    });
    return res.data;
  } catch (err) {
    throw normalizeError(err, 'Đặt lại mật khẩu thất bại');
  }
}


export function logout() {
  localStorage.removeItem('authToken');
}

