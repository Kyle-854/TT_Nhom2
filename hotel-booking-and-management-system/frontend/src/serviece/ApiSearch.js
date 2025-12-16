import apiClient from './axiosClient';
import { normalizeError } from './apiUtils';


export async function searchHotels(params) {
  try {
    const res = await apiClient.get('/api/users/Search/hotels', {
      params: params
    });
    return res.data;
  } catch (err) {
    throw normalizeError(err, 'Lỗi khi tìm kiếm khách sạn');
  }
}


export async function getSuggestions(keyword) {
  try {
    const res = await apiClient.get('/api/users/Search/suggestions', {
      params: { query: keyword }
    });
    return res.data;
  } catch (err) {
    throw normalizeError(err, 'Lỗi khi lấy gợi ý tìm kiếm');
  }
}