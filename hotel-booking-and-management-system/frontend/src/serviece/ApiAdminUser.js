import apiClient from './axiosClient';
import { normalizeError } from './apiUtils';


export async function getAdminUsers(params = {}) {
    try {
        const res = await apiClient.get('/api/admins/users', { params });
        return res.data;
    } catch (err) {
        throw normalizeError(err, 'Lấy danh sách người dùng thất bại');
    }
}


export async function createAdminUser(data) {
    try {
        const res = await apiClient.post('/api/admins/users', data);
        return res.data;
    } catch (err) {
        throw normalizeError(err, 'Tạo người dùng thất bại');
    }
}


export async function getAdminUserById(id) {
    if (!id) throw new Error('Thiếu id người dùng');
    try {
        const res = await apiClient.get(`/api/admins/users/${id}`);
        return res.data;
    } catch (err) {
        throw normalizeError(err, 'Lấy thông tin người dùng thất bại');
    }
}


export async function updateAdminUser(id, data) {
    if (!id) throw new Error('Thiếu id người dùng');
    try {
        const res = await apiClient.put(`/api/admins/users/${id}`, data);
        return res.data;
    } catch (err) {
        throw normalizeError(err, 'Cập nhật thông tin thất bại');
    }
}


export async function changeUserStatus(id, isActive) {
    if (!id) throw new Error('Thiếu id người dùng');
    try {
        const res = await apiClient.put(`/api/admins/users/${id}/status`, { isActive });
        return res.data;
    } catch (err) {
        throw normalizeError(err, 'Thay đổi trạng thái thất bại');
    }
}


export async function changeUserRole(id, roleId) {
    if (!id) throw new Error('Thiếu id người dùng');
    try {
        const res = await apiClient.put(`/api/admins/users/${id}/role`, { roleId });
        return res.data;
    } catch (err) {
        throw normalizeError(err, 'Thay đổi quyền hạn thất bại');
    }
}