import React from 'react'

const RoomTypeDetails = ({ roomType, onClose }) => {
  if (!roomType) return null

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="text-lg font-semibold">{roomType.name}</h4>
          <button onClick={onClose} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">Đóng</button>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {/* Images */}
            <div className="grid grid-cols-1 gap-2">
              {(roomType.images && roomType.images.length > 0) ? (
                roomType.images.map((img, idx) => (
                  <img key={idx} src={img.url} alt={img.altText || roomType.name} className="w-full h-44 object-cover rounded" onError={(e)=> e.target.src='/placeholder-image.png'} />
                ))
              ) : (
                <div className="w-full h-44 bg-gray-100 rounded flex items-center justify-center text-gray-500">No image</div>
              )}
            </div>

            <div className="mt-3 text-sm text-gray-700 whitespace-pre-line">{roomType.description || 'Không có mô tả.'}</div>
          </div>

          <aside className="bg-gray-50 p-4 rounded">
            <div className="mb-3">
              <div className="text-sm text-gray-500">Sức chứa</div>
              <div className="font-medium">{roomType.capacity}</div>
            </div>

            <div className="mb-3">
              <div className="text-sm text-gray-500">Giá mỗi đêm</div>
              <div className="text-indigo-600 font-semibold">{roomType.pricePerNight ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(roomType.pricePerNight) : 'Liên hệ'}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500">Tiện nghi</div>
              <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
                {(roomType.amenities && roomType.amenities.length > 0) ? (
                  roomType.amenities.map(a => <li key={a.amenityId || a.name}>{a.name}</li>)
                ) : (
                  <li>Không có dữ liệu tiện nghi</li>
                )}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default RoomTypeDetails
