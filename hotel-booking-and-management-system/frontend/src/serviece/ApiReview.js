import apiClient from './axiosClient';
import { normalizeError } from './apiUtils';


export async function getReviewsByHotel(hotelId) {
  try {
    const res = await apiClient.get(`/api/users/Review/hotels/${hotelId}`);
    return res.data;
  } catch (err) {
    throw normalizeError(err, 'Lấy danh sách đánh giá thất bại');
  }
}


export async function getReviewDetail(reviewId) {
  try {
    const res = await apiClient.get(`/api/users/Review/${reviewId}`);
    return res.data;
  } catch (err) {
    throw normalizeError(err, 'Lấy chi tiết đánh giá thất bại');
  }
}


export async function createReview(data) {
  try {
    const res = await apiClient.post('/api/users/Review', data);
    return res.data;
  } catch (err) {
    throw normalizeError(err, 'Gửi đánh giá thất bại');
  }
}


export async function updateReview(reviewId, data) {
  try {
    const res = await apiClient.put(`/api/users/Review/${reviewId}`, data);
    return res.data;
  } catch (err) {
    throw normalizeError(err, 'Cập nhật đánh giá thất bại');
  }
}


export async function deleteReview(reviewId) {
  try {
    const res = await apiClient.delete(`/api/users/Review/${reviewId}`);
    return res.data;
  } catch (err) {
    throw normalizeError(err, 'Xóa đánh giá thất bại');
  }
}