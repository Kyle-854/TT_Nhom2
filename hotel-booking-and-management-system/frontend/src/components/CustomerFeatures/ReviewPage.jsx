import React from 'react'

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

const ReviewPage = ({ review, onClose }) => {
  if (!review) return null

  const filledStars = Math.max(0, Math.min(5, review.rating || 0))

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto mt-8">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-semibold">Chi tiết đánh giá</h3>
          <button onClick={onClose} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">Đóng</button>
        </div>

        <div className="p-6">
          {/* Rating Stars */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="inline-block">
                  <Star filled={i < filledStars} />
                </span>
              ))}
            </div>
            <span className="text-lg font-bold text-gray-900">{review.rating || 0}/5</span>
          </div>

          {/* Review Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {review.title || 'Không có tiêu đề'}
          </h2>

          {/* Guest Info */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <div>
              <p className="text-sm text-gray-600">
                <strong>Khách:</strong> {review.userName || review.guestName || 'Ẩn danh'}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Ngày đánh giá:</strong> {review.createdAt ? new Date(review.createdAt).toLocaleDateString('vi-VN') : 'Không xác định'}
              </p>
            </div>
          </div>

          {/* Review Content */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nội dung đánh giá</h3>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {review.content || review.comment || 'Không có nội dung'}
            </p>
          </div>

          {/* Additional Info */}
          {review.bookingId && (
            <div className="bg-gray-50 p-3 rounded text-sm text-gray-600">
              <strong>ID Đặt phòng:</strong> {review.bookingId}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReviewPage