import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSuggestions, searchHotels } from '../../serviece/ApiSearch';
import { getHotelById } from '../../serviece/ApiHotel';
import { login } from '../../serviece/ApiAuth'; 
import HotelCard from '../Content/HotelCard';
import HotelDetails from '../Content/HotelDetails';

const debounce = (fn, delay = 300) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
};

const Search = () => {
  const [filters, setFilters] = useState({
    Location: '',
    CheckInDate: '',
    CheckOutDate: '',
    Adults: '',
    Children: '',
    Rooms: ''
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const [results, setResults] = useState(null);
  const [showResultsPopup, setShowResultsPopup] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [fullResults, setFullResults] = useState(null);
  const [fullResultsLoading, setFullResultsLoading] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  const formatPrice = (value) => {
    if (value === null || value === undefined) return null;
    const num = Number(value);
    if (Number.isNaN(num)) return String(value);
    try {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(num);
    } catch { return String(num); }
  };

  const getNumericPriceFromHotel = (hotel) => {
    if (!hotel) return null;
    const candidates = [];
    const pushIfNumber = (v) => { const n = Number(v); if (!Number.isNaN(n) && isFinite(n) && n > 0) candidates.push(n); };
    pushIfNumber(hotel.startingPrice); pushIfNumber(hotel.priceFrom); pushIfNumber(hotel.minPrice);
    pushIfNumber(hotel.pricePerNight); pushIfNumber(hotel.price); pushIfNumber(hotel.priceAmount);
    if (Array.isArray(hotel.roomTypes)) hotel.roomTypes.forEach(rt => { pushIfNumber(rt.pricePerNight ?? rt.nightlyRate ?? rt.price ?? rt.minPrice); if (Array.isArray(rt.prices)) rt.prices.forEach(p => pushIfNumber(p)); });
    if (Array.isArray(hotel.rooms)) hotel.rooms.forEach(r => pushIfNumber(r.pricePerNight ?? r.price));
    if (hotel.priceRange) { pushIfNumber(hotel.priceRange.min); pushIfNumber(hotel.priceRange.max); }
    if (hotel.rooms && hotel.rooms[0]) pushIfNumber(hotel.rooms[0].price);
    return candidates.length > 0 ? Math.min(...candidates) : null;
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (q) => {
    if (!q || q.trim().length < 2) { setSuggestions([]); return; }
    try {
      const res = await getSuggestions(q.trim());
      setSuggestions(Array.isArray(res) ? res : (res?.items || []));
      setShowSuggestions(true);
    } catch (e) { setSuggestions([]); }
  };

  const debouncedFetch = useRef(debounce((q) => fetchSuggestions(q), 300)).current;

  const handleLocationChange = (e) => {
    const val = e.target.value;
    setFilters(prev => ({ ...prev, Location: val }));
    debouncedFetch(val);
  };

  const handleSelectSuggestion = (item) => {
    const text = typeof item === 'string' ? item : item.name || item.title || '';
    setFilters(prev => ({ ...prev, Location: text }));
    setShowSuggestions(false);
  };

  const cleanParams = (params) => {
    const cleaned = {};
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        cleaned[key] = params[key];
      }
    });
    return cleaned;
  };

  const performSearch = async () => {
    setIsSearching(true);
    setResults(null);
    setFullResults(null);
    
    try {
      const params = cleanParams(filters);
      if (filters.Location) params.query = filters.Location;

      const res = await searchHotels(params);
      setResults(res);

      const list = Array.isArray(res) ? res : (res.items || (res.data ? (Array.isArray(res.data) ? res.data : [res.data]) : []));
      
      if (Array.isArray(list) && list.length > 0) {
        setFullResultsLoading(true);
        const detailed = await Promise.all(list.map(async (h) => {
          const id = h?.hotelId || h?.id || h?.hotelID || h?.value;
          if (!id) return h;
          try {
            const detailRes = await getHotelById(id);
            return Array.isArray(detailRes) ? detailRes[0] : (detailRes?.data || detailRes || h);
          } catch (err) { return h; }
        }));
        setFullResults(detailed);
      } else {
        setFullResults([]);
      }
      setShowResultsPopup(true);
    } catch (e) {
      console.error(e);
      alert('Lỗi tìm kiếm');
    } finally {
      setIsSearching(false);
      setFullResultsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    performSearch();
  };

  const handleReset = () => {
    setFilters({
      Location: '', CheckInDate: '', CheckOutDate: '', Adults: '', Children: '', Rooms: ''
    });
    setSuggestions([]);
  };

  const handleHotelClick = async (summaryHotel) => {
    const hotelId = summaryHotel.hotelId || summaryHotel.id;
    if (!hotelId) { setSelectedHotel(summaryHotel); return; }

    setIsLoadingDetail(true);
    try {
      const fullDetailRes = await getHotelById(hotelId);
      const fullHotelData = Array.isArray(fullDetailRes) ? fullDetailRes[0] : (fullDetailRes?.data || fullDetailRes);
      setSelectedHotel(fullHotelData);
    } catch (error) {
      setSelectedHotel(summaryHotel);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleBookingAttempt = (bookingData) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        setShowLoginModal(true);
    } else {
        const hotelToBook = selectedHotel;
        
        setSelectedHotel(null);
        setShowResultsPopup(false);
        
        navigate('/checkout', { 
            state: { 
                hotel: hotelToBook,
                bookingDetails: bookingData 
            } 
        });
    }
  };

  const handleLoginSubmitInSearch = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
        const res = await login(loginEmail, loginPass);
        if(res) {
            setShowLoginModal(false);
            alert("Đăng nhập thành công! Vui lòng bấm 'Đặt phòng' lại.");
            window.location.reload(); 
        }
    } catch (err) {
        alert("Đăng nhập thất bại. Vui lòng kiểm tra lại.");
    } finally {
        setIsLoggingIn(false);
    }
  };

  return (
    <>
      {/* Loading Overlay */}
      {isLoadingDetail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30">
          <div className="bg-white p-4 rounded shadow flex items-center gap-3">
             <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
             <span>Đang tải...</span>
          </div>
        </div>
      )}

      {/* --- THANH TÌM KIẾM --- */}
      <div className="w-full max-w-5xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm p-4" ref={wrapperRef}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end mb-4">
            
            {/* Vị trí (4 cột) */}
            <div className="md:col-span-4 relative">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Vị trí</label>
              <input type="text" placeholder="VD: Hà Nội" value={filters.Location} onChange={handleLocationChange} onFocus={() => { if (suggestions.length) setShowSuggestions(true); }} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" />
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg max-h-48 overflow-auto">
                  {suggestions.map((s, idx) => (
                    <li key={idx} className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm" onClick={() => handleSelectSuggestion(s)}>{typeof s === 'string' ? s : s.name || s.title}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Ngày nhận (2 cột) */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Ngày nhận</label>
              <input type="date" value={filters.CheckInDate} onChange={(e) => setFilters(prev => ({ ...prev, CheckInDate: e.target.value }))} className="w-full px-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" />
            </div>

            {/* Ngày trả (2 cột) */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Ngày trả</label>
              <input type="date" value={filters.CheckOutDate} onChange={(e) => setFilters(prev => ({ ...prev, CheckOutDate: e.target.value }))} className="w-full px-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" />
            </div>

            {/* Sức chứa (2 cột) */}
            <div className="md:col-span-2 flex gap-2">
                <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Người lớn</label>
                    <input type="number" min="1" placeholder="1" value={filters.Adults} onChange={(e) => setFilters(prev => ({ ...prev, Adults: e.target.value }))} className="w-full px-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" />
                </div>
                <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Trẻ em</label>
                    <input type="number" min="0" placeholder="0" value={filters.Children} onChange={(e) => setFilters(prev => ({ ...prev, Children: e.target.value }))} className="w-full px-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" />
                </div>
            </div>

            {/* Phòng (2 cột) */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Phòng</label>
              <input type="number" min="1" placeholder="1" value={filters.Rooms} onChange={(e) => setFilters(prev => ({ ...prev, Rooms: e.target.value }))} className="w-full px-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <button type="button" onClick={handleReset} className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm font-medium transition">
              Xóa lọc
            </button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium transition flex items-center gap-2 shadow-sm">
              {isSearching && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>}
              Tìm kiếm
            </button>
          </div>
        </form>
      </div>

      {/* POPUP KẾT QUẢ TÌM KIẾM */}
      {showResultsPopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={() => setShowResultsPopup(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b shrink-0">
              <h3 className="text-lg font-bold text-gray-800">
                Kết quả tìm kiếm {fullResults ? `(${fullResults.length})` : ''}
              </h3>
              <button onClick={() => setShowResultsPopup(false)} className="text-gray-500 hover:text-red-500 text-2xl">&times;</button>
            </div>

            <div className="flex-1 overflow-auto p-4 bg-gray-50">
              {fullResultsLoading ? (
                <div className="flex justify-center items-center py-10 flex-col">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                    <p className="text-gray-500">Đang tìm kiếm khách sạn phù hợp...</p>
                </div>
              ) : (fullResults && fullResults.length > 0) ? (
                <div className="grid grid-cols-1 gap-4">
                  {fullResults.map((hotel, idx) => {
                    const rawPrice = getNumericPriceFromHotel(hotel);
                    const startingPrice = formatPrice(rawPrice);
                    return (
                      <HotelCard 
                        key={hotel.hotelId || hotel.id || idx}
                        coverImageUrl={hotel.coverImageUrl || (hotel.images && hotel.images[0]?.url)}
                        name={hotel.name}
                        starRating={hotel.starRating}
                        city={hotel.city}
                        country={hotel.country}
                        averageUserRating={hotel.averageUserRating}
                        startingPrice={startingPrice}
                        onClick={() => handleHotelClick(hotel)}
                      />
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-10">
                    <p className="text-gray-500 text-lg">Không tìm thấy khách sạn nào phù hợp.</p>
                    <button onClick={() => setShowResultsPopup(false)} className="mt-4 text-blue-600 hover:underline">Thử lại với bộ lọc khác</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL CHI TIẾT */}
      {selectedHotel && (
        <HotelDetails 
            hotel={selectedHotel} 
            onClose={() => setSelectedHotel(null)} 
            onBooking={handleBookingAttempt} 
            zIndex={9999} 
        />
      )}

      {/* MODAL ĐĂNG NHẬP */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[99999]" onClick={() => setShowLoginModal(false)}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 relative animate-fade-in-down" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Đăng nhập để đặt phòng</h2>
                <form onSubmit={handleLoginSubmitInSearch} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email / SĐT</label>
                        <input type="text" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                        <input type="password" required value={loginPass} onChange={(e) => setLoginPass(e.target.value)} className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <button type="submit" disabled={isLoggingIn} className="w-full py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition disabled:bg-gray-400">
                        {isLoggingIn ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-500 mt-4">Bạn chưa có tài khoản? Vui lòng đăng ký ở trang chủ.</p>
            </div>
        </div>
      )}
    </>
  );
};

export default Search;