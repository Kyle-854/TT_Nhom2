import apiClient from './axiosClient';
import { normalizeError } from './apiUtils';


export async function getRoomTypesByHotel(hotelId) {
  try {
    const response = await apiClient.get(`/api/partners/hotels/${hotelId}/room-types`);
    return response.data;
  } catch (error) {
    throw normalizeError(error, 'Lỗi khi lấy danh sách loại phòng');
  }
}


export async function createRoomType(hotelId, data) {
  try {
    const response = await apiClient.post(`/api/partners/hotels/${hotelId}/room-types`, data);
    return response.data;
  } catch (error) {
    throw normalizeError(error, 'Lỗi khi tạo loại phòng mới');
  }
}


export async function getRoomTypeDetail(id) {
  try {
    const response = await apiClient.get(`/api/partners/room-types/${id}`);
    return response.data;
  } catch (error) {
    throw normalizeError(error, 'Lỗi khi lấy thông tin loại phòng');
  }
}


export async function updateRoomType(id, data) {
  try {
    const response = await apiClient.put(`/api/partners/room-types/${id}`, data);
    return response.data;
  } catch (error) {
    throw normalizeError(error, 'Lỗi khi cập nhật loại phòng');
  }
}


export async function deleteRoomType(id) {
  try {
    const response = await apiClient.delete(`/api/partners/room-types/${id}`);
    return response.data;
  } catch (error) {
    throw normalizeError(error, 'Lỗi khi xóa loại phòng');
  }
}


export async function getRoomTypeAmenitiesLookup() {
  try {
    const response = await apiClient.get('/api/partners/room-types/amenities-lookup');
    return response.data;
  } catch (error) {
    throw normalizeError(error, 'Lỗi khi lấy danh sách tiện nghi phòng');
  }
}


export async function uploadRoomTypeImage(id, formData) {
  try {
    const response = await apiClient.post(`/api/partners/room-types/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw normalizeError(error, 'Lỗi khi tải ảnh lên');
  }
}