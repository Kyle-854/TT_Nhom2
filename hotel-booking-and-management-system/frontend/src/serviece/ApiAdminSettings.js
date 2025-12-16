import apiClient from './axiosClient';
import { normalizeError } from './apiUtils';


export async function getAllAmenities() {
    try {
        const res = await apiClient.get('/api/admins/settings/amenities');
        return res.data;
    } catch (err) {
        throw normalizeError(err, 'Lấy danh sách tiện ích thất bại');
    }
}


export async function createAmenity(data) {
    if (!data?.name) throw new Error('Thiếu tên tiện ích');
    try {
        const res = await apiClient.post('/api/admins/settings/amenities', data);
        return res.data;
    } catch (err) {
        throw normalizeError(err, 'Tạo tiện ích thất bại');
    }
}


export async function updateAmenity(id, data) {
    if (!id) throw new Error('Thiếu id tiện ích');
    try {
        const res = await apiClient.put(`/api/admins/settings/amenities/${id}`, data);
        return res.data;
    } catch (err) {
        throw normalizeError(err, 'Cập nhật tiện ích thất bại');
    }
}


export async function deleteAmenity(id) {
    if (!id) throw new Error('Thiếu id tiện ích');
    try {
        const res = await apiClient.delete(`/api/admins/settings/amenities/${id}`);
        return res.data;
    } catch (err) {
        throw normalizeError(err, 'Xóa tiện ích thất bại');
    }
}