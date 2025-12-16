import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSuggestions, searchHotels } from '../../serviece/ApiSearch';
import { getHotelById } from '../../serviece/ApiHotel';
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
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [advancedModalOpen, setAdvancedModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(null);
  

  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const [filters, setFilters] = useState({ 
    Location: '', 
    CheckInDate: '', 
    CheckOutDate: '', 
    Adults: '', 
    Children: '', 
    Rooms: '', 
    Page: '', 
    PageSize: '', 
    SortBy: '' 
  });

  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  const [showResultsPopup, setShowResultsPopup] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [fullResults, setFullResults] = useState(null);
  const [fullResultsLoading, setFullResultsLoading] = useState(false);

  const formatPrice = (value) => {
    if (value === null || value === undefined) return null;
    if (typeof value === 'string' && value.trim() === '') return null;
    const num = Number(value);
    if (Number.isNaN(num)) return String(value);
    try {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(num);
    } catch {
      return String(num);
    }
  };

  const getNumericPriceFromHotel = (hotel) => {
    if (!hotel) return null;
    const candidates = [];
    const pushIfNumber = (v) => {
      const n = Number(v);
      if (!Number.isNaN(n) && isFinite(n) && n > 0) candidates.push(n);
    };

    pushIfNumber(hotel.startingPrice);
    pushIfNumber(hotel.priceFrom);
    pushIfNumber(hotel.minPrice);
    pushIfNumber(hotel.pricePerNight);
    pushIfNumber(hotel.price);
    pushIfNumber(hotel.priceAmount);

    if (Array.isArray(hotel.roomTypes)) {
      hotel.roomTypes.forEach(rt => {
        pushIfNumber(rt.pricePerNight ?? rt.nightlyRate ?? rt.price ?? rt.minPrice);
        if (Array.isArray(rt.prices)) rt.prices.forEach(p => pushIfNumber(p));
      });
    }
    if (Array.isArray(hotel.rooms)) {
      hotel.rooms.forEach(r => pushIfNumber(r.pricePerNight ?? r.price));
    }
    if (hotel.priceRange) {
      pushIfNumber(hotel.priceRange.min);
      pushIfNumber(hotel.priceRange.max);
    }
    if (hotel.rooms && hotel.rooms[0]) pushIfNumber(hotel.rooms[0].price);
    if (candidates.length === 0) return null;
    return Math.min(...candidates);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (q) => {
    if (!q || q.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await getSuggestions(q.trim());
      setSuggestions(Array.isArray(res) ? res : (res?.items || []));
      setShowSuggestions(true);
    } catch (e) {
      setSuggestions([]);
    }
  };

  const debouncedFetch = useRef(debounce((q) => fetchSuggestions(q), 300)).current;

  useEffect(() => {
    debouncedFetch(query);
  }, [query, debouncedFetch]);

 
  const handleHotelClick = async (summaryHotel) => {
    const hotelId = summaryHotel.hotelId || summaryHotel.id;
    
    if (!hotelId) {
     
      setSelectedHotel(summaryHotel);
      return;
    }

    setIsLoadingDetail(true); 
    try {
      const fullDetailRes = await getHotelById(hotelId);
      
      const fullHotelData = Array.isArray(fullDetailRes) ? fullDetailRes[0] : (fullDetailRes?.data || fullDetailRes);

      setSelectedHotel(fullHotelData);
    } catch (error) {
      console.error("Lỗi lấy chi tiết khách sạn:", error);
    
      setSelectedHotel(summaryHotel);
    } finally {
      setIsLoadingDetail(false); 
    }
  };

  const handleSelectSuggestion = (item) => {
    const text = typeof item === 'string' ? item : item.name || item.title || item.label || '';
    setQuery(text);
    setFilters(f => ({ ...f, Location: text }));
    setShowSuggestions(false);
    
    const hotelId = item?.hotelId || item?.id || item?.value || item?.hotelID;
    if (hotelId) {
     
      handleHotelClick({ hotelId: hotelId });
    } else {
    
      performSearch({ ...filters, Location: text, query: text }).then(() => setShowResultsPopup(true));
    }
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

  const performSearch = async (params = {}) => {
    setIsSearching(true);
    setResults(null);
    try {
      let p = { ...params };
      if (!p.query && query) p.query = query;

      p = cleanParams(p); 
    
      
      const res = await searchHotels(p);
      setResults(res);
    
      try {
        const list = Array.isArray(res) ? res : (res.items || (res.data ? (Array.isArray(res.data) ? res.data : [res.data]) : []));
        if (Array.isArray(list) && list.length > 0) {
          setFullResultsLoading(true);
          const detailed = await Promise.all(list.map(async (h) => {
            const id = h?.hotelId || h?.id || h?.hotelID || h?.value;
            if (!id) return h;
            try {
              const detailRes = await getHotelById(id);
              return Array.isArray(detailRes) ? detailRes[0] : (detailRes?.data || detailRes || h);
            } catch (err) {
              return h;
            }
          }));
          setFullResults(detailed);
        } else {
          setFullResults([]);
        }
      } catch (err) {
        setFullResults([]);
      } finally {
        setFullResultsLoading(false);
      }
      return res;
    } catch (e) {
      console.error(e);
      setResults({ error: true, message: 'Lỗi tìm kiếm' });
      setShowResultsPopup(true);
      return null;
    } finally {
      setIsSearching(false);
    }
  };

 
  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setShowSuggestions(false);
    const res = await performSearch({ ...filters, query });
    
  
    if (res) {
      const list = Array.isArray(res) ? res : (res.items || (res.data ? (Array.isArray(res.data) ? res.data : [res.data]) : null));
      if (Array.isArray(list) && list.length === 1) {
        handleHotelClick(list[0]);
        return;
      }
    }
    setShowResultsPopup(true);
  };

  return (
    <>
      {/* Loading Overlay: Hiện khi click vào thẻ để xem chi tiết */}
      {isLoadingDetail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30">
          <div className="bg-white p-4 rounded shadow-lg flex items-center gap-3">
             <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
             <span className="text-sm font-medium text-gray-700">Đang tải thông tin chi tiết...</span>
          </div>
        </div>
      )}

      <div className="w-full relative" ref={wrapperRef}>
        {/* Form tìm kiếm cơ bản */}
        <form onSubmit={handleSubmit} className="flex w-full">
          <input
            type="text"
            placeholder="Tìm kiếm khách sạn, địa điểm..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if (suggestions.length) setShowSuggestions(true); }}
            className="w-full px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="button" onClick={() => setAdvancedModalOpen(true)} className="px-4 md:px-6 bg-blue-600 text-white rounded-r-full hover:bg-blue-700 whitespace-nowrap">
             {isSearching ? '...' : 'Nâng cao'}
          </button>
        </form>

        {/* Danh sách gợi ý */}
        {showSuggestions && suggestions && suggestions.length > 0 && (
          <ul className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-56 overflow-auto">
            {suggestions.map((s, idx) => (
              <li key={idx} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-left" onClick={() => handleSelectSuggestion(s)}>
                {typeof s === 'string' ? s : s.name || s.title || JSON.stringify(s)}
              </li>
            ))}
          </ul>
        )}

        {/* Modal Tìm kiếm Nâng cao */}
        {advancedModalOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4" onClick={() => setAdvancedModalOpen(false)}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold mb-4 text-center sm:text-left">Tìm nâng cao</h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setAdvancedModalOpen(false);
                
                await performSearch({ ...filters, query });
                
                setShowResultsPopup(true); 
                
              }} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Form Inputs (đã rút gọn cho gọn code, giữ nguyên logic của bạn) */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
                  <input id="filter-location" value={filters.Location} onChange={(e) => setFilters(f => ({ ...f, Location: e.target.value }))} placeholder="Nhập tên thành phố..." className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày nhận phòng</label>
                  <input type="date" value={filters.CheckInDate} onChange={(e) => setFilters(f => ({ ...f, CheckInDate: e.target.value }))} className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày trả phòng</label>
                  <input type="date" value={filters.CheckOutDate} onChange={(e) => setFilters(f => ({ ...f, CheckOutDate: e.target.value }))} className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Người lớn</label>
                  <input type="number" min="1" value={filters.Adults} onChange={(e) => setFilters(f => ({ ...f, Adults: e.target.value }))} className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trẻ em</label>
                  <input type="number" min="0" value={filters.Children} onChange={(e) => setFilters(f => ({ ...f, Children: e.target.value }))} className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số phòng</label>
                  <input type="number" min="1" value={filters.Rooms} onChange={(e) => setFilters(f => ({ ...f, Rooms: e.target.value }))} className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sắp xếp</label>
                  <select value={filters.SortBy} onChange={(e) => setFilters(f => ({ ...f, SortBy: e.target.value }))} className="w-full px-3 py-2 border rounded">
                    <option value="">Mặc định</option>
                    <option value="price_asc">Giá: Thấp đến Cao</option>
                    <option value="price_desc">Giá: Cao đến Thấp</option>
                    <option value="rating">Đánh giá sao</option>
                  </select>
                </div>

                <div className="sm:col-span-2 flex gap-2 mt-2">
                  <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Tìm kiếm</button>
                  <button type="button" onClick={() => { setFilters({ Location: '', CheckInDate: '', CheckOutDate: '', Adults: '', Children: '', Rooms: '', Page: '', PageSize: '', SortBy: '' }); setQuery(''); setResults(null); }} className="w-full border border-gray-300 py-2 rounded">Xóa</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Popup modal: Danh sách kết quả tìm kiếm */}
      {showResultsPopup && results && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={() => setShowResultsPopup(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b shrink-0">
              <h3 className="text-lg font-semibold">Kết quả tìm kiếm</h3>
              <button onClick={() => setShowResultsPopup(false)} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-gray-50">
              {fullResultsLoading && (
                <div className="text-sm text-gray-600 mb-3">Đang tải thông tin chi tiết cho các kết quả...</div>
              )}
              {((fullResults && fullResults.length > 0) || (Array.isArray(results) ? results.length > 0 : (results?.items && results.items.length > 0))) ? (
                 <div className="grid grid-cols-1 gap-4">
                  {(fullResults && fullResults.length > 0 ? fullResults : (Array.isArray(results) ? results : results.items || [])).map((hotel, idx) => {
                    const rawPrice = getNumericPriceFromHotel(hotel);
                    const startingPrice = formatPrice(rawPrice);
                    return (
                      <HotelCard key={hotel.hotelId || hotel.id || idx} {...{
                        coverImageUrl: hotel.coverImageUrl || (hotel.images && hotel.images[0]?.url),
                        name: hotel.name,
                        starRating: hotel.starRating,
                        city: hotel.city,
                        country: hotel.country,
                        averageUserRating: hotel.averageUserRating,
                        startingPrice: startingPrice,
                      }} 
                      onClick={() => handleHotelClick(hotel)} />
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">Không tìm thấy khách sạn nào phù hợp.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết khách sạn (Chỉ mở khi selectedHotel có dữ liệu) */}
      {selectedHotel && (
        <HotelDetails hotel={selectedHotel} onClose={() => setSelectedHotel(null)} onBooking={() => {
          setSelectedHotel(null);
          setShowResultsPopup(false);
        }} zIndex={9999} />
      )}
    </>
  );
};

export default Search;