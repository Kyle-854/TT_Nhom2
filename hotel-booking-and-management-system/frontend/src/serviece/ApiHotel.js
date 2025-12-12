import apiClient from './axiosClient';
import { normalizeError } from './apiUtils';


export async function getHotels(params = {}) {
	try {
		const res = await apiClient.get('/api/users/Hotel', { params });
		return res.data;
	} catch (err) {
		throw normalizeError(err, 'Lấy danh sách khách sạn thất bại');
	}
}

export async function getHotelById(id) {
	if (!id) throw new Error('Thiếu id');
	try {
		const res = await apiClient.get(`/api/users/Hotel/${id}`);
		return res.data;
	} catch (err) {
		throw normalizeError(err, 'Lấy thông tin khách sạn thất bại');
	}
}

export async function getHotelRoomTypes(hotelId, params = {}) {
	if (!hotelId) throw new Error('Thiếu hotelId');
	try {
		const res = await apiClient.get(`/api/users/Hotel/${hotelId}/roomtypes`, { params });
		return res.data;
	} catch (err) {
		throw normalizeError(err, 'Lấy loại phòng thất bại');
	}
}

