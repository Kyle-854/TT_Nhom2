import apiClient from './axiosClient';
import { normalizeError } from './apiUtils';


export async function createBooking(bookingData) {
  try {
    const res = await apiClient.post('/api/users/Bookings', bookingData);
    return res.data; 
  } catch (err) {
    throw normalizeError(err, 'Đặt phòng thất bại');
  }
}


export async function getMyBookings() {
  try {
    const res = await apiClient.get('/api/users/Bookings/my-bookings');
    return res.data;
  } catch (err) {
    throw normalizeError(err, 'Lấy lịch sử đặt phòng thất bại');
  }
}


export async function getBookingDetail(bookingId) {
  try {
    const res = await apiClient.get(`/api/users/Bookings/${bookingId}`);
    return res.data;
  } catch (err) {
    throw normalizeError(err, 'Lấy chi tiết đơn hàng thất bại');
  }
}


export async function cancelBooking(bookingId) {
  try {
    const res = await apiClient.put(`/api/users/Bookings/${bookingId}/cancel`);
    return res.data;
  } catch (err) {
    throw normalizeError(err, 'Hủy phòng thất bại');
  }
}