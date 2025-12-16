import apiClient from './axiosClient';
import { normalizeError } from './apiUtils';


export async function getAdminHotels(params = {}) {
    try {
        const res = await apiClient.get('/api/admins/hotels', { params });
        return res.data;
    } catch (err) {
        throw normalizeError(err, 'Lấy danh sách khách sạn thất bại');
    }
}


export async function approveHotel(id, note = null) {
    if (!id) throw new Error('Thiếu id khách sạn');
    try {
        const res = await apiClient.put(`/api/admins/hotels/${id}/approval`, { note });
        return res.data;
    } catch (err) {
        throw normalizeError(err, 'Duyệt khách sạn thất bại');
    }
}


export async function suspendHotel(id, reason) {
    if (!id) throw new Error('Thiếu id khách sạn');
    if (!reason) throw new Error('Cần nhập lý do đình chỉ');
    
    try {
        const res = await apiClient.put(`/api/admins/hotels/${id}/suspension`, { reason });
        return res.data;
    } catch (err) {
        throw normalizeError(err, 'Đình chỉ khách sạn thất bại');
    }
}