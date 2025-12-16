import React, { useState } from 'react'
import { createReview } from '../../serviece/ApiReview'

function Star({ filled, onClick }) {
  return (
    <svg
      onClick={onClick}
      className={`w-6 h-6 ${filled ? 'text-yellow-400' : 'text-gray-300'} cursor-pointer`}
      viewBox="0 0 20 20"
      fill={filled ? 'currentColor' : 'none'}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M10 1.5l2.59 5.25 5.81.84-4.2 4.09.99 5.78L10 14.9 4.81 17.46l.99-5.78L1.6 7.59l5.81-.84L10 1.5z" />
    </svg>
  )
}

const ReviewForm = ({ bookingId, onClose, onCreated }) => {
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    if (!bookingId) return setError('Thiếu thông tin đặt phòng')
    setLoading(true)
    setError(null)
    try {
      await createReview({ bookingId, rating, title, content })
      onCreated && onCreated()
    } catch (err) {
      setError(err?.message || 'Gửi đánh giá thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto mt-8">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-semibold">Gửi đánh giá</h3>
          <button onClick={onClose} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">Đóng</button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <div className="flex items-center gap-3">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} filled={i < rating} onClick={() => setRating(i + 1)} />
                ))}
              </div>
              <div className="text-sm text-gray-600">{rating}/5</div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">Tiêu đề</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Nhập tiêu đề" />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">Nội dung</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full border rounded px-3 py-2 min-h-[120px]" placeholder="Chia sẻ trải nghiệm của bạn..." />
          </div>

          {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded">Hủy</button>
            <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-60">
              {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewForm
