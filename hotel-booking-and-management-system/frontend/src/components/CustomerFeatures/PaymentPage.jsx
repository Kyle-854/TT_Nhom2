import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBooking } from '../../serviece/ApiBooking'
import { createPaymentIntent, sendPaymentWebhook } from '../../serviece/ApiPayment'

const PaymentPage = () => {
  const navigate = useNavigate();
  const [pending, setPending] = useState(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [bookingResult, setBookingResult] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('pendingBooking');
    if (!raw) {
      setError('Không có yêu cầu đặt phòng.');
      return;
    }
    try {
      const data = JSON.parse(raw);
      setPending(data);
    } catch (e) {
      setError('Dữ liệu đặt phòng không hợp lệ');
    }
  }, []);

  const nightsBetween = (from, to) => {
    try {
      const a = new Date(from);
      const b = new Date(to);
      const diff = Math.max(0, Math.ceil((b - a) / (1000 * 60 * 60 * 24)));
      return diff;
    } catch { return 0; }
  }

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'Liên hệ';
    try {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);
    } catch { return String(value); }
  }

  const totalAmount = (() => {
    if (!pending || !Array.isArray(pending.rooms)) return 0;
    return pending.rooms.reduce((sum, r) => {
      const nights = nightsBetween(r.checkInDate, r.checkOutDate) || 0;
      const rate = Number(r.nightlyRate ?? r.pricePerNight ?? 0) || 0;
      const qty = Number(r.quantity || 1) || 1;
      return sum + nights * rate * qty;
    }, 0);
  })();

  const handleConfirmAndPay = async () => {
    if (!pending) return;
    setCreating(true);
    setError(null);
    try {
      const booking = await createBooking(pending);
      setBookingResult(booking || null);
      const bookingId = booking?.bookingId || booking?.booking?.bookingId || booking?.bookingId || booking?.id;

      if (!bookingId) {
        setError('Không lấy được bookingId từ server');
        setCreating(false);
        return;
      }


      try {
        const intent = await createPaymentIntent(bookingId);
        setPaymentResult(intent || null);


        try {
          await sendPaymentWebhook({
            providerTxnId: intent?.providerTxnId,
            isSuccess: true,
            amountPaid: intent?.amount || totalAmount,
            gatewayTransactionId: "momo0987654321",
            paidAt: new Date().toISOString(),
            errorMessage: null
          });
        } catch (webhookErr) {
          console.error('Lỗi gửi webhook:', webhookErr);
        }

      
        sessionStorage.removeItem('pendingBooking');
        setSuccessMessage(true);
      } catch (piErr) {
        console.error('Lỗi thanh toán:', piErr);
       
        alert(`Đặt phòng thành công (Mã: ${bookingId}) nhưng khởi tạo thanh toán thất bại. Vui lòng vào "Lịch sử đặt phòng" để thanh toán lại.`);
       
        sessionStorage.removeItem('pendingBooking');
       
        navigate('/my-bookings'); 
        return;
      }
    } catch (err) {
      setError(err?.message || 'Tạo đặt phòng thất bại');
    } finally {
      setCreating(false);
    }
  }

  if (error) return (
    <div className="p-8 text-center text-red-600">
      {error}
      <div className="mt-4">
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-200 rounded">Quay lại</button>
      </div>
    </div>
  );

  
  if (successMessage) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Đặt phòng thành công!</h3>
          <p className="text-gray-600 mb-2">
            Mã đặt phòng: <strong className="text-green-600">{bookingResult?.bookingCode || bookingResult?.bookingId}</strong>
          </p>
          <p className="text-gray-600 mb-6">
            Chúng tôi đã ghi nhận yêu cầu của bạn. Hãy kiểm tra email để nhận thông tin chi tiết.
          </p>
          <button 
            onClick={() => navigate('/')} 
            className="w-full px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  if (!pending) {
    return <div className="p-8 text-center">Đang tải...</div>
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Xác nhận đặt phòng</h2>

      <div className="bg-white shadow rounded p-4 mb-4">
        <div className="text-sm text-gray-600 mb-2">Khách sạn</div>
        <div className="font-medium mb-3">{pending.hotelName ?? pending.hotelId}</div>

        <div className="text-sm text-gray-600 mb-2">Tổng cần thanh toán</div>
        <div className="text-indigo-600 font-semibold mb-3">{formatCurrency(totalAmount)}</div>

        <div className="text-sm text-gray-600">Chi tiết phòng</div>
        <div className="mt-2 space-y-2">
          {Array.isArray(pending.rooms) && pending.rooms.map((r, idx) => (
            <div key={idx} className="p-2 border rounded">
              <div>Loại phòng: <strong>{r.roomTypeName ?? r.roomTypeId}</strong></div>
              <div>Ngày nhận: {r.checkInDate}</div>
              <div>Ngày trả: {r.checkOutDate}</div>
              <div>Số đêm: {nightsBetween(r.checkInDate, r.checkOutDate)}</div>
              <div>Số lượng: {r.quantity}</div>
              <div>Giá mỗi đêm: {formatCurrency(r.nightlyRate ?? r.pricePerNight ?? 0)}</div>
              <div className="font-medium">Tạm tính: {formatCurrency((nightsBetween(r.checkInDate, r.checkOutDate) || 0) * (Number(r.nightlyRate ?? r.pricePerNight ?? 0) || 0) * (Number(r.quantity || 1) || 1))}</div>
            </div>
          ))}
        </div>

        {pending.note && (
          <div className="mt-3 text-sm text-gray-600">Ghi chú: <span className="font-medium">{pending.note}</span></div>
        )}
      </div>

      {bookingResult && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded">
          Đặt phòng đã được tạo. Mã: <strong>{bookingResult.bookingCode || bookingResult.bookingId}</strong>
        </div>
      )}

      {paymentResult && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
          Dữ liệu thanh toán sẵn sàng.
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={handleConfirmAndPay} disabled={creating} className="px-4 py-2 bg-indigo-600 text-white rounded">
          {creating ? 'Đang tạo đặt phòng...' : 'Xác nhận & Thanh toán'}
        </button>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-200 rounded">Quay lại</button>
      </div>
    </div>
  );
}

export default PaymentPage
