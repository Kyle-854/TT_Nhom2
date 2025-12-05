import apiClient from './axiosClient';

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
    // Chuẩn hoá lỗi để hiển thị trên UI
    const status = err.response?.status;
    const body = err.response?.data;
    console.error('[ApiAuth] đăng nhập thất bại', { status, body, message: err.message });
    const message = (body && (body.message || body.error || body.detail)) || err.message || 'Đăng nhập thất bại';
    const e = new Error(typeof message === 'string' ? message : JSON.stringify(message));
    e.status = status;
    e.body = body;
    e.original = err;
    throw e;
  }
}

export async function register(userData) {
  try {
    const res = await apiClient.post('/api/users/Auth/register', userData);
    return res.data;
  } catch (err) {
    console.error('[ApiAuth] đăng ký thất bại', { status: err.response?.status, data: err.response?.data });
    throw err;
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
  throw lastError || new Error('Lấy thông tin user thất bại');
}

export async function changePassword({ currentPassword, newPassword }) {
  try {
    const res = await apiClient.put('/api/users/Auth/change-password', {
      currentPassword,
      newPassword,
    });
    return res.data;
  } catch (err) {
    const status = err.response?.status;
    const body = err.response?.data;
    console.error('[ApiAuth] changePassword thất bại', { status, body, message: err.message });
    const message = (body && (body.message || body.error || body.detail)) || err.message || 'Đổi mật khẩu thất bại';
    const e = new Error(typeof message === 'string' ? message : JSON.stringify(message));
    e.status = status;
    e.body = body;
    e.original = err;
    throw e;
  }
}

export async function forgotPassword(identifier) {
  try {
    const res = await apiClient.post('/api/users/Auth/forgot-password', { email: identifier });
    return res.data;
  } catch (err) {
    const status = err.response?.status;
    const body = err.response?.data;
    console.error('[ApiAuth] forgotPassword thất bại', { status, body, message: err.message });
    const message = (body && (body.message || body.error || body.detail)) || err.message || 'Yêu cầu đặt lại mật khẩu thất bại';
    const e = new Error(typeof message === 'string' ? message : JSON.stringify(message));
    e.status = status;
    e.body = body;
    e.original = err;
    throw e;
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
    const body = err.response?.data;
    const message = (body && (body.message || body.error)) || 'Đặt lại mật khẩu thất bại';
    const e = new Error(typeof message === 'string' ? message : JSON.stringify(message));
    throw e;
  }
}


export function logout() {
  localStorage.removeItem('authToken');
}

