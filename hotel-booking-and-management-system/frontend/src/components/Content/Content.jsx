import React, { useEffect, useState } from 'react'
import HotelCard from './HotelCard'
import HotelDetails from './HotelDetails'
import { getHotels, getHotelById } from '../../serviece/ApiHotel'

function formatPrice(value) {
  if (value === null || value === undefined) return null
  try {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value)
  } catch {
    return String(value)
  }
}

const extractHotelList = (resp) => {
  return Array.isArray(resp) ? resp : [];
}

const Content = () => {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  useEffect(() => {
    let mounted = true
    const fetchHotels = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getHotels()
        if (!mounted) return
        const list = extractHotelList(data)
        setHotels(list)
      } catch (err) {
        if (!mounted) return
        setError(err.message || 'Lấy danh sách khách sạn thất bại')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchHotels()
    return () => { mounted = false }
  }, [])

  const openHotelDetails = async (hotelId) => {
    if (!hotelId) return
    setLoadingDetail(true)
    setSelectedHotel(null)
    try {
      const data = await getHotelById(hotelId)
      const hotel = data && data.data ? data.data : data
      setSelectedHotel(hotel)
    } catch (err) {
      setError(err.message || 'Lấy thông tin khách sạn thất bại')
    } finally {
      setLoadingDetail(false)
    }
  }

  return (
    <main className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Danh sách khách sạn</h2>

      {loading && <div>Đang tải danh sách khách sạn...</div>}
      {error && <div className="text-red-600">Lỗi: {error}</div>}

      <div className="grid gap-6 grid-cols-1">
        {hotels.map((hotel) => {
          const id = hotel.hotelId;
          return (
            <HotelCard
              key={id || hotel.slug || hotel.name}
              coverImageUrl={hotel.coverImageUrl || ''}
              name={hotel.name}
              starRating={hotel.starRating}
              city={hotel.city}
              country={hotel.country}
              averageUserRating={hotel.averageUserRating}
              startingPrice={formatPrice(hotel.startingPrice)}
              onClick={() => openHotelDetails(id)}
            />
          )
        })}
      </div>

      {loadingDetail && <div className="mt-4">Đang tải chi tiết khách sạn...</div>}

      {selectedHotel && (
        <HotelDetails hotel={selectedHotel} onClose={() => setSelectedHotel(null)} />
      )}
    </main>
  )
}

export default Content