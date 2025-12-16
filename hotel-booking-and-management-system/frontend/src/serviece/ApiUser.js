import apiClient from './axiosClient';
import { normalizeError } from './apiUtils';


export async function getInfo() {
  try {
    const res = await apiClient.get('/api/users/User/me');
    return res.data;
  } catch (err) {
    throw normalizeError(err, 'Lấy thông tin người dùng thất bại');
  }
}


export async function updateInfo(userData) {
  try {
    const res = await apiClient.put('/api/users/User/me', userData);
    return res.data;
  } catch (err) {
    throw normalizeError(err, 'Cập nhật thông tin thất bại');
  }
}