import apiClient from './ApiAuth';

function normalizeError(err, fallbackMessage = 'Lỗi API Hotel') {
	const status = err?.response?.status;
	const body = err?.response?.data;
	const message = (body && (body.message || body.error || body.detail)) || err.message || fallbackMessage;
	const e = new Error(typeof message === 'string' ? message : JSON.stringify(message));
	e.status = status;
	e.body = body;
	e.original = err;
	return e;
}

// Lấy danh sách khách sạn, hỗ trợ params cho phân trang/loc/search
export async function getHotels(params = {}) {
	try {
		const res = await apiClient.get('/api/users/Hotel', { params });
		return res.data;
	} catch (err) {
		throw normalizeError(err, 'Lấy danh sách khách sạn thất bại');
	}
}

// Lấy thông tin chi tiết một khách sạn theo id
export async function getHotelById(id) {
	if (!id) throw new Error('Thiếu id');
	try {
		const res = await apiClient.get(`/api/users/Hotel/${id}`);
		return res.data;
	} catch (err) {
		throw normalizeError(err, 'Lấy thông tin khách sạn thất bại');
	}
}

// Lấy loại phòng của một khách sạn
export async function getHotelRoomTypes(hotelId, params = {}) {
	if (!hotelId) throw new Error('Thiếu hotelId');
	try {
		const res = await apiClient.get(`/api/users/Hotel/${hotelId}/roomtypes`, { params });
		return res.data;
	} catch (err) {
		throw normalizeError(err, 'Lấy loại phòng thất bại');
	}
}

export default {
	getHotels,
	getHotelById,
	getHotelRoomTypes,
};

