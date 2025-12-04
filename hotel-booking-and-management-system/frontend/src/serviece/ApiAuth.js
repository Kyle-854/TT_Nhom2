import axios from 'axios';

const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost' ? '' : 'http://160.191.245.177:8000';

// Tạo instance axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Thêm token từ localStorage vào request (nếu có)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor xử lý response, handle 401 globally
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Xóa token nếu hết hạn và có thể redirect tới login
      localStorage.removeItem('authToken');
    }
    return Promise.reject(err);
  }
);

export async function login(identifier, password) {
  // Theo spec Swagger: endpoint là /api/users/Auth/login, payload là emailOrPhoneNumber + password
  try {
    console.info('[ApiAuth] đăng nhập vào /api/users/Auth/login', { identifier });
    const res = await apiClient.post('/api/users/Auth/login', {
      emailOrPhoneNumber: identifier,
      password,
    });
    const data = res.data;
    console.info('[ApiAuth] đăng nhập thành công', { data });

    const token = data?.token; //Đây là đường dẫn để lấy token từ endpoint login
    if (token) {
      localStorage.setItem('authToken', token);
      console.info('[ApiAuth] token đã lưu vào localStorage');
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
  // Theo spec Swagger: endpoint là /api/users/Auth/register, payload bao gồm email, password, fullName, phone
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
      console.debug('[ApiAuth] lấy user info thất bại', { ep, status: err.response?.status });
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
    console.info('[ApiAuth] gửi yêu cầu quên mật khẩu cho:', { identifier });
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

export default apiClient;
