import React, { useState, useEffect } from 'react'
import RoomTypeDetails from './RoomTypeDetails'
import { getHotelRoomTypes } from '../../serviece/ApiHotel'

function Star({ filled }) {
  return (
    <svg
      className={`w-4 h-4 ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
      viewBox="0 0 20 20"
      fill={filled ? 'currentColor' : 'none'}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M10 1.5l2.59 5.25 5.81.84-4.2 4.09.99 5.78L10 14.9 4.81 17.46l.99-5.78L1.6 7.59l5.81-.84L10 1.5z" />
    </svg>
  )
}

const HotelDetails = ({ hotel, onClose }) => {
  const [selectedRoomType, setSelectedRoomType] = useState(null)
  const [roomTypes, setRoomTypes] = useState([])
  const [loadingRooms, setLoadingRooms] = useState(false)
  const [roomError, setRoomError] = useState(null)

  const hotelId = hotel ?.hotelId;

  // Fetch room types từ backend endpoint
  useEffect(() => {
    if (!hotelId) return

    const fetchRoomTypes = async () => {
      setLoadingRooms(true)
      setRoomError(null)
      try {
        const data = await getHotelRoomTypes(hotelId)
        let roomTypesList = Array.isArray(data) ? data : (data?.data || []);
        setRoomTypes(roomTypesList)
      } catch (err) {
        setRoomError(err.message || 'Lấy loại phòng thất bại')
        setRoomTypes([])
      } finally {
        setLoadingRooms(false)
      }
    }

    fetchRoomTypes()
  }, [hotelId])

  if (!hotel) return null

  const filledStars = Math.max(0, Math.min(5, Math.round(hotel.starRating || 0)))

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-semibold">{hotel.name}</h3>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">Đóng</button>
          </div>
        </div>

        <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            {/* Images grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(hotel.images && hotel.images.length > 0) ? (
                hotel.images.map((img, idx) => (
                  <img key={idx} src={img.url} alt={img.altText || hotel.name} className="w-full h-44 object-cover rounded" onError={(e)=> e.target.src='/placeholder-image.png'} />
                ))
              ) : (
                <img src={hotel.coverImageUrl || '/placeholder-image.png'} alt={hotel.name} className="w-full h-44 object-cover rounded" onError={(e)=> e.target.src='/placeholder-image.png'} />
              )}
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="inline-block mr-1">
                      <Star filled={i < filledStars} />
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-600">{hotel.city}{hotel.city && hotel.country ? ', ' : ''}{hotel.country}</div>
              </div>

              <p className="mt-3 text-gray-700 whitespace-pre-line">{hotel.description || 'Không có mô tả.'}</p>

              <div className="mt-4 text-sm text-gray-600">
                      <div><strong>Địa chỉ:</strong> {hotel.address || '—'}</div>

                      {/* Embed Google Map: use lat/lng if available, otherwise fallback to address search */}
                      {(
                        hotel.latitude !== undefined && hotel.latitude !== null &&
                        hotel.longitude !== undefined && hotel.longitude !== null
                      ) ? (
                        <div className="mt-3 w-full h-48 sm:h-64 rounded overflow-hidden">
                          <iframe
                            title="hotel-location"
                            src={`https://www.google.com/maps?q=${hotel.latitude},${hotel.longitude}&z=15&output=embed`}
                            className="w-full h-full border-0"
                            allowFullScreen
                            loading="lazy"
                          />
                        </div>
                      ) : hotel.address ? (
                        <div className="mt-3 w-full h-48 sm:h-64 rounded overflow-hidden">
                          <iframe
                            title="hotel-location-address"
                            src={`https://www.google.com/maps?q=${encodeURIComponent(hotel.address)}&z=15&output=embed`}
                            className="w-full h-full border-0"
                            allowFullScreen
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="mt-2">Không có dữ liệu vị trí</div>
                      )}
              </div>
            </div>
          </div>

          <aside className="lg:col-span-1 bg-gray-50 p-4 rounded">
            <div className="mb-4">
              <div className="text-sm text-gray-500">Điểm trung bình</div>
              <div className="text-2xl font-bold">{hotel.averageUserRating !== null && hotel.averageUserRating !== undefined ? `${hotel.averageUserRating}/10` : '—/10'}</div>
              <div className="text-sm text-gray-500">{hotel.reviewCount ?? 0} đánh giá</div>
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-500">Tiện nghi</div>
              <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
                {(hotel.amenities && hotel.amenities.length > 0) ? (
                  hotel.amenities.map(a => <li key={a.amenityId || a.name}>{a.name}</li>)
                ) : (
                  <li>Không có dữ liệu tiện nghi</li>
                )}
              </ul>
            </div>

            <div>
              <div className="text-sm text-gray-500">Loại phòng & giá</div>
              {loadingRooms && <div className="mt-2 text-sm text-gray-500">Đang tải loại phòng...</div>}
              {roomError && <div className="mt-2 text-sm text-red-600">Lỗi: {roomError}</div>}
              <div className="mt-2 space-y-2">
                {(roomTypes && roomTypes.length > 0) ? (
                  roomTypes.map(rt => {
                    const rtId = rt.roomTypeId;
                    const rtName = rt.name || 'Phòng';
                    const rtCapacity = rt.capacity || '—';
                    const rtPrice = rt.pricePerNight;
                    return (
                      <button
                        key={rtId}
                        type="button"
                        onClick={() => setSelectedRoomType(rt)}
                        className="w-full text-left bg-white p-2 rounded border hover:shadow-sm focus:outline-none"
                      >
                        <div className="font-medium text-sm">{rtName}</div>
                        <div className="text-sm text-gray-600">Sức chứa: {rtCapacity}</div>
                        <div className="text-sm text-indigo-600 font-semibold">
                          {rtPrice ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(rtPrice) : 'Liên hệ'}
                        </div>
                      </button>
                    )
                  })
                ) : (
                  <div className="text-sm text-gray-600">Không có dữ liệu phòng</div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
      {selectedRoomType && (
        <RoomTypeDetails roomType={selectedRoomType} onClose={() => setSelectedRoomType(null)} />
      )}
    </div>
  )
}

export default HotelDetails
