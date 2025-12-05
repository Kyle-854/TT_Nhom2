import axios from 'axios';

const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? '' 
    : 'http://160.191.245.177:8000';

// Tạo instance axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Thêm token từ localStorage vào request
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

export default apiClient;