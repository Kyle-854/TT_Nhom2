import React, { useState } from 'react'

// Component để hiển thị ảnh lớn (lightbox)
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

const RoomTypeDetails = ({ roomType, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  if (!roomType) return null

  // Hàm format tiền theo định dạng Việt Nam
  const formatPrice = (value) => {
    if (value === null || value === undefined) return 'Liên hệ'
    try {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value)
    } catch {
      return String(value)
    }
  }

  // Lấy dữ liệu từ backend, hỗ trợ các tên property khác nhau
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
            </aside>
          </div>
        </div>
      </div>
      <ImageViewer src={selectedImage} alt="Xem ảnh chi tiết" onClose={() => setSelectedImage(null)} />
    </>
  )
}

export default RoomTypeDetails
