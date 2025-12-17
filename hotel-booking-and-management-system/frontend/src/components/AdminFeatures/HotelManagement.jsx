import React, { useState, useEffect } from 'react'
import { getAdminHotels, approveHotel, suspendHotel } from '../../serviece/ApiAdminHotelModeration'

const HotelManagement = () => {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [processingId, setProcessingId] = useState(null)
  const [showSuspendModal, setShowSuspendModal] = useState(false)
  const [suspendReason, setSuspendReason] = useState('')
  const [suspendHotelId, setSuspendHotelId] = useState(null)

  useEffect(() => {
    fetchHotels()
  }, [])

  const fetchHotels = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAdminHotels()
      console.log('[HotelManagement] getAdminHotels response:', data)

      if (Array.isArray(data)) {
        setHotels(data)
      } else if (data && Array.isArray(data.items)) {
        setHotels(data.items)
      } else if (data && Array.isArray(data.hotels)) {
        setHotels(data.hotels)
      } else {
        setHotels(data || [])
        console.warn('[HotelManagement] unexpected response shape from getAdminHotels', data)
      }
    } catch (err) {
      setError(err?.message || 'Lỗi khi lấy danh sách khách sạn')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (hotelId) => {
    if (!hotelId) return;
    try {
      setProcessingId(hotelId)
      const res = await approveHotel(hotelId)
      alert('Duyệt khách sạn thành công:\n' + (res?.message ? res.message : JSON.stringify(res)))
      window.location.reload()
    } catch (err) {
      console.error('[HotelManagement] approve error', err)
      alert('Duyệt khách sạn thất bại: ' + (err?.message || JSON.stringify(err)))
    } finally {
      setProcessingId(null)
    }
  }

  const handleSuspend = async (hotelId) => {
    if (!hotelId) return;
    setSuspendHotelId(hotelId)
    setSuspendReason('')
    setShowSuspendModal(true)
  }

  const handleConfirmSuspend = async () => {
    if (!suspendHotelId || !suspendReason.trim()) {
      alert('Vui lòng nhập lý do đình chỉ')
      return
    }
    try {
      setProcessingId(suspendHotelId)
      const res = await suspendHotel(suspendHotelId, suspendReason)
      alert('Đình chỉ khách sạn thành công:\n' + (res?.message ? res.message : JSON.stringify(res)))
      window.location.reload()
    } catch (err) {
      console.error('[HotelManagement] suspend error', err)
      alert('Đình chỉ khách sạn thất bại: ' + (err?.message || JSON.stringify(err)))
    } finally {
      setProcessingId(null)
      setShowSuspendModal(false)
      setSuspendReason('')
      setSuspendHotelId(null)
    }
  }

  const handleCancelSuspend = () => {
    setShowSuspendModal(false)
    setSuspendReason('')
    setSuspendHotelId(null)
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        <p className="mt-2 text-gray-600">Đang tải danh sách khách sạn...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={fetchHotels}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý Khách sạn</h1>
        <p className="text-gray-600">Tổng số khách sạn: <span className="font-semibold">{hotels.length}</span></p>
      </div>

      {(!Array.isArray(hotels) || hotels.length === 0) ? (
        <div className="text-center py-8">
          {Array.isArray(hotels) ? (
            <p className="text-gray-500">Không có khách sạn nào</p>
          ) : (
            <div className="text-left p-4">
              <p className="text-red-600 mb-2">Dữ liệu trả về không phải mảng. Dữ liệu thô:</p>
              <pre className="text-xs overflow-auto max-h-80 bg-gray-50 p-2 rounded">{JSON.stringify(hotels, null, 2)}</pre>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tên khách sạn</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Chủ sở hữu</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Điện thoại</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Thành phố</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Sao</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Số đặt phòng</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ngày tạo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(hotels) && hotels.map((hotel, index) => (
                  <tr key={hotel.hotelId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 text-sm text-gray-700">{hotel.hotelId}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{hotel.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{hotel.ownerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{hotel.ownerEmail}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{hotel.ownerPhone}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{hotel.city}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <span className="flex items-center">
                        {[...Array(hotel.starRating)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {hotel.isActive ? (
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Hoạt động</span>
                      ) : (
                        <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">Không hoạt động</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{hotel.totalBookings}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {hotel.createdAt ? new Date(hotel.createdAt).toLocaleDateString('vi-VN') : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          disabled={processingId === hotel.hotelId}
                          onClick={() => handleApprove(hotel.hotelId)}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
                        >
                          {processingId === hotel.hotelId ? '...' : 'Kích hoạt'}
                        </button>
                        <button
                          disabled={processingId === hotel.hotelId}
                          onClick={() => handleSuspend(hotel.hotelId)}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
                        >
                          {processingId === hotel.hotelId ? '...' : 'Đình chỉ'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Suspend Modal */}
      {showSuspendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Xác nhận đình chỉ khách sạn</h2>
            <p className="text-gray-600 mb-4">Vui lòng nhập lý do đình chỉ khách sạn:</p>
            <textarea
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              placeholder="Nhập lý do đình chỉ..."
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
              rows="4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelSuspend}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmSuspend}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HotelManagement