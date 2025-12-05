export function normalizeError(err, fallbackMessage = 'Lỗi hệ thống') {
    const status = err?.response?.status;
    const body = err?.response?.data;
    
    // Logic lấy message chuẩn như bạn đã làm
    const message = (body && (body.message || body.error || body.detail)) || err.message || fallbackMessage;
    
    const e = new Error(typeof message === 'string' ? message : JSON.stringify(message));
    e.status = status;
    e.body = body;
    e.original = err;
    return e;
}