import apiClient from './axiosClient';
import { normalizeError } from './apiUtils';


export async function getMyHotels(params) {
  try {
    const res = await apiClient.get('/api/partners/hotels', {
      params: params
    });
    return res.data;
  } catch (err) {
    throw normalizeError(err, 'Lỗi khi lấy danh sách khách sạn');
  }
}


export async function createHotel(data) {
  try {
    const res = await apiClient.post('/api/partners/hotels', data);
    return res.data;
  } catch (err) {
    throw normalizeError(err, 'Lỗi khi tạo khách sạn mới');
  }
}


export async function getDetail(id) {
  try {
    const res = await apiClient.get(`/api/partners/hotels/${id}`);
    return res.data;
  } catch (err) {
    throw normalizeError(err, 'Lỗi khi lấy thông tin chi tiết khách sạn');
  }
}


export async function updateInfo(id, data) {
  try {
    const res = await apiClient.put(`/api/partners/hotels/${id}`, data);
    return res.data;
  } catch (err) {
    throw normalizeError(err, 'Lỗi khi cập nhật thông tin khách sạn');
  }
}


export async function getAmenitiesLookup() {
  try {
    const res = await apiClient.get('/api/partners/hotels/amenities-lookup');
    return res.data;
  } catch (err) {
    throw normalizeError(err, 'Lỗi khi lấy danh sách tiện ích');
  }
}

export async function updateAmenities(id, data) {
  try {
    const res = await apiClient.put(`/api/partners/hotels/${id}/amenities`, data);
    return res.data;
  } catch (err) {
    throw normalizeError(err, 'Lỗi khi cập nhật tiện ích khách sạn');
  }
}


export async function uploadImage(id, formData) {
  try {
    const res = await apiClient.post(`/api/partners/hotels/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (err) {
    throw normalizeError(err, 'Lỗi khi tải ảnh lên');
  }
}