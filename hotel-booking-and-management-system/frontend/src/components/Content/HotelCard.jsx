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

const HotelCard = ({
  coverImageUrl = '',
  name = 'Hotel name',
  starRating = 0, // 0-5
  city = '',
  country = '',
  averageUserRating = null, // number out of 10
  startingPrice = null, // number or string
  onClick = null,
}) => {
  const filledStars = Math.max(0, Math.min(5, Math.round(starRating)))

  return (
    <article
      className={`bg-white rounded-lg shadow-md overflow-hidden transition hover:shadow-lg ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(e) } : undefined}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
        <div className="md:col-span-1">
          <img
            src={coverImageUrl}
            alt={name}
            className="w-full h-56 md:h-full object-cover"
            onError={(e) => { e.target.src = '/placeholder-image.png' }}
          />
        </div>

        <div className="p-4 md:col-span-3 flex flex-col justify-between">
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900">{name}</h3>

            <div className="mt-2 flex items-center gap-3">
              <div className="flex items-center" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="inline-block mr-1">
                    <Star filled={i < filledStars} />
                  </span>
                ))}
              </div>

              <div className="text-sm text-gray-600">{city}{city && country ? ', ' : ''}{country}</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 items-end">
            <div>
              <div className="text-sm text-gray-500">Điểm người dùng</div>
              <div className="text-lg font-bold text-gray-800">
                {averageUserRating !== null && averageUserRating !== undefined ? `${averageUserRating}/10` : '—/10'}
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-500">Giá từ</div>
              <div className="text-lg font-bold text-indigo-600">
                {startingPrice !== null && startingPrice !== undefined ? (
                  <>
                    {startingPrice} <span className="text-sm text-gray-600">/ đêm</span>
                  </>
                ) : (
                  'Liên hệ'
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default HotelCard