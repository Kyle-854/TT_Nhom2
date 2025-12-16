import React, { useEffect, useState } from 'react'
import { getMyBookings, getBookingDetail, cancelBooking } from '../../serviece/ApiBooking'
import ReviewForm from './ReviewForm'

const BookingHistory = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getMyBookings()
        if (mounted) setBookings(Array.isArray(data) ? data : (data?.items || []))
      } catch (err) {
        if (mounted) setError(err?.message || 'Lấy lịch sử thất bại')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const formatCurrency = (v) => {
    if (v === null || v === undefined) return '—'
    try {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(v)
    } catch { return String(v) }
  }

  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState(null)
  const [selectedDetail, setSelectedDetail] = useState(null)
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [isReviewOpen, setIsReviewOpen] = useState(false)

  const openDetail = async (bookingId) => {
    if (!bookingId) return
    setIsDetailOpen(true)
    setDetailLoading(true)
    setDetailError(null)
    setSelectedDetail(null)
    try {
      const d = await getBookingDetail(bookingId)
      setSelectedDetail(d)
    } catch (err) {
      setDetailError(err?.message || 'Lấy chi tiết thất bại')
    } finally {
      setDetailLoading(false)
    }
  }

  const handleCancelBooking = async () => {
    if (!selectedDetail || !selectedDetail.bookingId) return
    setIsCancelling(true)
    try {
      await cancelBooking(selectedDetail.bookingId)
      setSelectedDetail(prev => ({
        ...prev,
        statusName: 'Cancelled'
      }))

      const data = await getMyBookings()
      setBookings(Array.isArray(data) ? data : (data?.items || []))
      setIsCancelConfirmOpen(false)
      alert('Hủy đơn đặt phòng thành công')
    } catch (err) {
      alert('Hủy đơn thất bại: ' + (err?.message || 'Lỗi'))
    } finally {
      setIsCancelling(false)
    }
  }

  const canReview = (detail) => {
    if (!detail) return false
    const status = String(detail.statusName || '').toLowerCase()
    if (!status.includes('confirmed')) return false

    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)

    return Array.isArray(detail.bookingRooms) && detail.bookingRooms.some(room => {
      if (!room || !room.checkOutDate) return false
      const co = new Date(room.checkOutDate)
      return co <= todayEnd
    })
  }

  if (loading) return <div className="p-4">Đang tải lịch sử...</div>
  if (error) return <div className="p-4 text-red-600">{error}</div>
  if (!bookings || bookings.length === 0) return <div className="p-4">Bạn chưa có đặt phòng nào.</div>

  return (
    <>
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
      {bookings.map((b) => (
        <div
          key={b.bookingId || b.id || b.bookingCode}
          className="border rounded-lg p-4 bg-white hover:shadow-md transition cursor-pointer"
          onClick={() => openDetail(b.bookingId || b.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') openDetail(b.bookingId || b.id) }}
        >
          {/* Hàng trên: Hình ảnh + Tên khách sạn + Trạng thái */}
          <div className="flex gap-4">
            {/* Hình ảnh khách sạn */}
            <div className="flex-shrink-0">
              {b.hotelMainImageUrl ? (
                <img src={b.hotelMainImageUrl} alt={b.hotelName || 'Hotel'} className="w-24 h-24 object-cover rounded" />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                </div>
              )}
            </div>

            {/* Thông tin chính */}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{b.hotelName || b.hotelId || 'N/A'}</h3>
                  <p className="text-sm text-gray-600 mt-1">Mã: <span className="font-medium">{b.bookingCode || b.bookingId}</span></p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(b.overallCheckInDate).toLocaleDateString('vi-VN')} - {new Date(b.overallCheckOutDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    String(b.statusName || '').toLowerCase().includes('cancel') 
                      ? 'bg-red-100 text-red-700' 
                      : String(b.statusName || '').toLowerCase().includes('success') || String(b.statusName || '').toLowerCase().includes('confirmed')
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {b.statusName || '—'}
                  </span>
                </div>
              </div>

              {/* Hàng dưới: Tổng tiền và ngày tạo */}
              <div className="flex justify-between items-end mt-3">
                <p className="text-sm text-gray-600">
                  Ngày đặt: <span className="text-gray-700">{new Date(b.createdAt).toLocaleDateString('vi-VN')}</span>
                </p>
                <p className="text-lg font-semibold text-indigo-600">
                  {formatCurrency(b.totalAmount)} {b.currency || 'VND'}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

    {isDetailOpen && (
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4">
        <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsDetailOpen(false)} />
        <div className="relative bg-white rounded-lg shadow-lg w-full max-w-3xl z-60 p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Chi tiết đặt phòng</h3>
            <button onClick={() => setIsDetailOpen(false)} className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Đóng</button>
          </div>

          {detailLoading && <div className="text-center py-8">Đang tải chi tiết...</div>}
          {detailError && <div className="text-red-600 py-4">{detailError}</div>}

          {selectedDetail && (
            <div className="space-y-6">
              {/* Thông tin đơn hàng */}
              <div className="border-b pb-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Thông tin đơn đặt phòng</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Mã đặt phòng</p>
                    <p className="font-medium text-gray-800">{selectedDetail.bookingCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Trạng thái</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      String(selectedDetail.statusName || '').toLowerCase().includes('cancel') 
                        ? 'bg-red-100 text-red-700' 
                        : String(selectedDetail.statusName || '').toLowerCase().includes('success') || String(selectedDetail.statusName || '').toLowerCase().includes('confirmed')
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {selectedDetail.statusName}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ngày đặt</p>
                    <p className="text-gray-800">{new Date(selectedDetail.createdAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                  {selectedDetail.updatedAt && (
                    <div>
                      <p className="text-sm text-gray-600">Cập nhật lần cuối</p>
                      <p className="text-gray-800">{new Date(selectedDetail.updatedAt).toLocaleDateString('vi-VN')}</p>
                    </div>
                  )}
                </div>
                {selectedDetail.note && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600">Ghi chú</p>
                    <p className="text-gray-800">{selectedDetail.note}</p>
                  </div>
                )}
              </div>

              {/* Thông tin khách sạn */}
              {selectedDetail.hotelInfo && (
                <div className="border-b pb-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Thông tin khách sạn</h4>
                  <div className="space-y-2">
                    <p><span className="text-gray-600">Tên:</span> <span className="font-medium text-gray-800">{selectedDetail.hotelInfo.name}</span></p>
                    <p><span className="text-gray-600">Địa chỉ:</span> <span className="text-gray-800">{selectedDetail.hotelInfo.address}</span></p>
                    <p><span className="text-gray-600">Thành phố:</span> <span className="text-gray-800">{selectedDetail.hotelInfo.city}</span></p>
                    <p><span className="text-gray-600">Quốc gia:</span> <span className="text-gray-800">{selectedDetail.hotelInfo.country}</span></p>
                    {selectedDetail.hotelInfo.hotelPhoneNumber && (
                      <p><span className="text-gray-600">Điện thoại:</span> <span className="text-gray-800">{selectedDetail.hotelInfo.hotelPhoneNumber}</span></p>
                    )}
                  </div>
                </div>
              )}

              {/* Chi tiết phòng */}
              <div className="border-b pb-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Chi tiết phòng</h4>
                <div className="space-y-4">
                  {Array.isArray(selectedDetail.bookingRooms) && selectedDetail.bookingRooms.length > 0 ? (
                    selectedDetail.bookingRooms.map((room, idx) => (
                      <div key={idx} className="p-4 border rounded-lg bg-gray-50">
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-gray-600">Loại phòng</p>
                            <p className="font-semibold text-gray-800">{room.roomTypeName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Số lượng</p>
                            <p className="font-semibold text-gray-800">{room.quantity}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-gray-600">Ngày nhận</p>
                            <p className="text-gray-800">{new Date(room.checkInDate).toLocaleDateString('vi-VN')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Ngày trả</p>
                            <p className="text-gray-800">{new Date(room.checkOutDate).toLocaleDateString('vi-VN')}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-gray-600">Số đêm</p>
                            <p className="text-gray-800">{room.nights}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Giá mỗi đêm</p>
                            <p className="text-gray-800">{formatCurrency(room.nightlyRate)}</p>
                          </div>
                        </div>
                        <div className="pt-3 border-t">
                          <p className="text-sm text-gray-600">Tạm tính</p>
                          <p className="text-lg font-semibold text-indigo-600">{formatCurrency(room.subTotal)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Không có thông tin phòng</p>
                  )}
                </div>
              </div>

              {/* Thông tin thanh toán */}
              {Array.isArray(selectedDetail.paymentTransactions) && selectedDetail.paymentTransactions.length > 0 && (
                <div className="border-b pb-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Thông tin thanh toán</h4>
                  <div className="space-y-4">
                    {selectedDetail.paymentTransactions.map((payment, idx) => (
                      <div key={idx} className="p-4 border rounded-lg bg-gray-50">
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-gray-600">Nhà cung cấp thanh toán</p>
                            <p className="font-medium text-gray-800">{payment.paymentProvider}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Trạng thái thanh toán</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                              String(payment.statusName || '').toLowerCase().includes('success') || String(payment.statusName || '').toLowerCase().includes('paid')
                                ? 'bg-green-100 text-green-700'
                                : String(payment.statusName || '').toLowerCase().includes('pending')
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {payment.statusName}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Số tiền</p>
                            <p className="font-semibold text-gray-800">{formatCurrency(payment.amount)} {payment.currency}</p>
                          </div>
                          {payment.paidAt && (
                            <div>
                              <p className="text-sm text-gray-600">Ngày thanh toán</p>
                              <p className="text-gray-800">{new Date(payment.paidAt).toLocaleDateString('vi-VN')}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tóm tắt chi phí */}
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Tổng cộng:</span>
                    <span className="font-semibold text-gray-800">{formatCurrency(selectedDetail.totalAmount)}</span>
                  </div>
                  {selectedDetail.discountAmount > 0 && (
                    <div className="flex justify-between text-orange-600">
                      <span>Giảm giá:</span>
                      <span className="font-semibold">-{formatCurrency(selectedDetail.discountAmount)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-semibold text-gray-800">Số tiền thanh toán:</span>
                    <span className="text-xl font-bold text-indigo-600">{formatCurrency(selectedDetail.totalAmount - (selectedDetail.discountAmount || 0))} {selectedDetail.currency}</span>
                  </div>
                </div>
              </div>

              {/* Nút hành động */}
              <div className="flex gap-3 pt-4 border-t">
                {String(selectedDetail.statusName || '').toLowerCase() !== 'cancelled' && String(selectedDetail.statusName || '').toLowerCase() !== 'cancel' && (
                  <button 
                    onClick={() => setIsCancelConfirmOpen(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700 transition"
                  >
                    Hủy đơn
                  </button>
                )}

                {canReview(selectedDetail) && (
                  <button
                    onClick={() => setIsReviewOpen(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700 transition"
                  >
                    Đánh giá
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )}

    {isReviewOpen && selectedDetail && (
      <ReviewForm
        bookingId={selectedDetail.bookingId}
        onClose={() => setIsReviewOpen(false)}
        onCreated={() => { setIsReviewOpen(false); alert('Gửi đánh giá thành công') }}
      />
    )}

    {/* Modal xác nhận hủy đơn */}
    {isCancelConfirmOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsCancelConfirmOpen(false)} />
        <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Xác nhận hủy đơn đặt phòng</h3>
          <p className="text-gray-600 mb-6">
            Bạn có chắc chắn muốn hủy đơn đặt phòng <strong>{selectedDetail?.bookingCode}</strong>?
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Hành động này không thể hoàn tác.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsCancelConfirmOpen(false)}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded font-medium hover:bg-gray-300 transition"
            >
              Quay lại
            </button>
            <button 
              onClick={handleCancelBooking}
              disabled={isCancelling}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700 transition disabled:opacity-50"
            >
              {isCancelling ? 'Đang hủy...' : 'Xác nhận hủy'}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}

export default BookingHistory