import React, { useState } from 'react'
import { createBooking } from '../../serviece/ApiBooking'
import { useNavigate } from 'react-router-dom'


const ImageViewer = ({ src, alt, onClose }) => {
  if (!src) return null;

  return (
    <div 
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4" // z-index cao hơn modal chi tiết phòng (z-60)
      onClick={onClose}
    >
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-white text-3xl z-10"
        aria-label="Đóng"
      >
        &times;
      </button>
      <div className="relative max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={alt} className="max-w-full max-h-[90vh] object-contain rounded-lg" />
      </div>
    </div>
  );
};

const RoomTypeDetails = ({ roomType, hotelId: hotelIdProp, hotelName, onClose, onBooking }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [checkIn, setCheckIn] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [checkOut, setCheckOut] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  if (!roomType) return null


  const formatPrice = (value) => {
    if (value === null || value === undefined) return 'Liên hệ'
    try {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value)
    } catch {
      return String(value)
    }
  }


  const roomName = roomType.name || 'Phòng';
  const capacity = roomType.capacity || '—';
  const pricePerNight = roomType.pricePerNight;
  const description = roomType.description || 'Không có mô tả.';
  const images = roomType.images || [];
  const amenities = roomType.amenities || [];

  return (
    <>
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/40">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
          <div className="flex items-center justify-between p-4 border-b">
            <h4 className="text-lg font-semibold">{roomName}</h4>
            <button onClick={onClose} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">Đóng</button>
          </div>
  
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {/* Hình ảnh từ backend */}
              <div className="grid grid-cols-1 gap-2">
                {(Array.isArray(images) && images.length > 0) ? (
                  images.map((img, idx) => {
                    const imageUrl = img.url || img;
                    return (
                      <button key={idx} onClick={() => setSelectedImage(imageUrl)} className="w-full h-44 block rounded overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <img 
                          src={imageUrl} 
                          alt={img.altText || img.alt || roomName} 
                          className="w-full h-full object-cover" 
                          onError={(e) => { e.target.src = '/placeholder-image.png' }} 
                        />
                      </button>
                    )
                  })
                ) : (
                  <div className="w-full h-44 bg-gray-100 rounded flex items-center justify-center text-gray-500">Không có hình ảnh</div>
                )}
              </div>
  
              {/* Mô tả từ backend */}
              <div className="mt-3 text-sm text-gray-700 whitespace-pre-line">{description}</div>
            </div>
  
            <aside className="bg-gray-50 p-4 rounded">
              {/* Sức chứa từ backend */}
              <div className="mb-3">
                <div className="text-sm text-gray-500">Sức chứa</div>
                <div className="font-medium">{capacity} người</div>
              </div>
  
              {/* Giá từ backend */}
              <div className="mb-3">
                <div className="text-sm text-gray-500">Giá mỗi đêm</div>
                <div className="text-indigo-600 font-semibold">{formatPrice(pricePerNight)}</div>
              </div>
  
              {/* Tiện nghi từ backend */}
              <div>
                <div className="text-sm text-gray-500">Tiện nghi</div>
                <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
                  {(Array.isArray(amenities) && amenities.length > 0) ? (
                    amenities.map((a) => <li key={a.amenityId || a.name}>{a.name}</li>)
                  ) : (
                    <li>Không có dữ liệu tiện nghi</li>
                  )}
                </ul>
              </div>

              {/* Form đặt phòng */}
              <div className="mt-4 border-t pt-4">
                <div className="text-sm text-gray-500 mb-2">Chọn ngày</div>
                <div className="flex gap-2 mb-2">
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="p-2 border rounded w-1/2"
                    aria-label="Ngày nhận phòng"
                  />
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="p-2 border rounded w-1/2"
                    aria-label="Ngày trả phòng"
                  />
                </div>

                <div className="mb-2">
                  <div className="text-sm text-gray-500">Số lượng phòng</div>
                  <input
                    type="number"
                    min="1"
                    max={capacity || 10}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="p-2 border rounded w-full"
                    aria-label="Số lượng phòng"
                  />
                </div>

                <div className="mb-3">
                  <div className="text-sm text-gray-500">Ghi chú (tuỳ chọn)</div>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="p-2 border rounded w-full"
                    rows={2}
                  />
                </div>

                <div>
                  <button
                    onClick={async () => {
                      const token = localStorage.getItem('authToken');
                      if (!token) {
                        navigate('/?showLogin=1');
                        return;
                      }

                      if (!checkIn || !checkOut) return alert('Vui lòng chọn ngày nhận và trả phòng');
                      if (new Date(checkOut) <= new Date(checkIn)) return alert('Ngày trả phải sau ngày nhận');
                      if (!roomType) return alert('Dữ liệu phòng không hợp lệ');

                      const hotelId = hotelIdProp ?? roomType.hotelId ?? roomType.hotel?.id;
                      if (!hotelId) return alert('Không xác định được khách sạn để đặt phòng');

                      const roomTypeId = roomType.id ?? roomType.roomTypeId;
                      if (!roomTypeId) return alert('Không xác định được loại phòng');

                      setLoading(true);
                      try {
                        const payload = {
                          hotelId,
                          hotelName: hotelName || roomType.hotelName || roomType.hotel?.name,
                          rooms: [
                            {
                                roomTypeId,
                                roomTypeName: roomType.name || roomType.roomTypeName,
                                nightlyRate: pricePerNight ?? roomType.pricePerNight ?? roomType.price,
                                checkInDate: checkIn,
                                checkOutDate: checkOut,
                                quantity: Number(quantity) || 1,
                            },
                          ],
                          note: note || undefined,
                        };

                        sessionStorage.setItem('pendingBooking', JSON.stringify(payload));
                        if (onClose) onClose();
                        if (onBooking) onBooking();
                        navigate('/payment');
                      } catch (err) {
                        alert(err?.message || 'Đặt phòng thất bại');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-60"
                  >
                    {loading ? 'Đang xử lý...' : 'Đặt phòng'}
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <ImageViewer src={selectedImage} alt="Xem ảnh chi tiết" onClose={() => setSelectedImage(null)} />
    </>
  )
}

export default RoomTypeDetails
