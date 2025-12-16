import apiClient from './axiosClient';
import { normalizeError } from './apiUtils';


export async function createPaymentIntent(bookingId) {
  try {
    const res = await apiClient.post('/api/users/Payment/create-intent', { 
      bookingId: bookingId 
    });
    return res.data;
  } catch (err) {
    throw normalizeError(err, 'Khởi tạo thanh toán thất bại');
  }
}


export async function getPaymentStatus(bookingId) {
  try {
    const res = await apiClient.get(`/api/users/Payment/${bookingId}/status`);
    return res.data;
  } catch (err) {
    throw normalizeError(err, 'Kiểm tra trạng thái thanh toán thất bại');
  }
}


export async function sendPaymentWebhook(data) {
  try {
    const res = await apiClient.post('/api/users/Payment/webhook', data);
    return res.data;
  } catch (err) {
    throw normalizeError(err, 'Gửi webhook thất bại');
  }
}