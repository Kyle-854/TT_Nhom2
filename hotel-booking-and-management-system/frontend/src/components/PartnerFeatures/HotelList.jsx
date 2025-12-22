import React, { useEffect, useState } from 'react';
import { getMyHotels, getDetail, createHotel, updateInfo, uploadImage, getAmenitiesLookup, updateAmenities } from '../../serviece/ApiPartnerHotel'; 


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
  );
}


const ImageViewer = ({ src, alt, onClose }) => {
  if (!src) return null;

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-white text-3xl z-10 hover:text-gray-300 transition"
        aria-label="Đóng"
      >
        ×
      </button>
      <div className="relative max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={alt} className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
      </div>
    </div>
  );
};


const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedHotel, setSelectedHotel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newHotel, setNewHotel] = useState({
    name: '', description: '', address: '', city: '', country: 'Việt Nam', starRating: 3
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editForm, setEditForm] = useState({
    id: null,
    name: '',
    description: '',
    address: '',
    city: '',
    country: '',
    latitude: 0,
    longitude: 0,
    starRating: 5,
    isActive: true
  });

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadHotelId, setUploadHotelId] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    file: null,
    caption: '',
    isMain: false
  });


  const [isAmenityModalOpen, setIsAmenityModalOpen] = useState(false);
  const [loadingAmenities, setLoadingAmenities] = useState(false);
  const [allAmenities, setAllAmenities] = useState([]);
  const [selectedAmenityIds, setSelectedAmenityIds] = useState([]);
  const [amenityHotelId, setAmenityHotelId] = useState(null);
  const [savingAmenities, setSavingAmenities] = useState(false);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const data = await getMyHotels();
      if (Array.isArray(data)) {
        setHotels(data);
      } else if (data && data.data) {
        setHotels(data.data);
      } else {
        setHotels([]); 
      }
    } catch (err) {
      console.error("Lỗi fetch:", err);
      setError(err.message || "Không thể tải danh sách khách sạn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleViewDetail = async (id) => {
    try {
      setLoadingDetail(true);
      setIsModalOpen(true);
      const detailData = await getDetail(id);
      setSelectedHotel(detailData);
    } catch (err) {
      alert("Lỗi khi tải thông tin chi tiết: " + err.message);
      setIsModalOpen(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedHotel(null);
    setSelectedImage(null);
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewHotel(prev => ({
      ...prev,
      [name]: name === 'starRating' ? parseInt(value) : value
    }));
  };

  const handleCreateHotel = async (e) => {
    e.preventDefault();
    if (!newHotel.name || !newHotel.address || !newHotel.city) {
      alert("Vui lòng điền đầy đủ Tên, Địa chỉ và Thành phố!");
      return;
    }
    try {
      setCreating(true);
      await createHotel(newHotel);
      alert("Thêm khách sạn thành công!");
      setIsAddModalOpen(false);
      setNewHotel({ name: '', description: '', address: '', city: '', country: 'Việt Nam', starRating: 3 });
      fetchHotels();
    } catch (err) {
      alert("Lỗi khi tạo khách sạn: " + err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleOpenEdit = async (id, e) => {
    e.stopPropagation();
    try {
      const data = await getDetail(id);
      setEditForm({
        id: data.id,
        name: data.name,
        description: data.description || '',
        address: data.address,
        city: data.city,
        country: data.country,
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
        starRating: data.starRating,
        isActive: data.isActive
      });
      setIsEditModalOpen(true);
    } catch (err) {
      alert("Không thể lấy thông tin để sửa: " + err.message);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'starRating' ? parseInt(value) : value)
    }));
  };

  const handleUpdateHotel = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const payload = {
        name: editForm.name,
        description: editForm.description,
        address: editForm.address,
        city: editForm.city,
        country: editForm.country,
        latitude: parseFloat(editForm.latitude || 0),
        longitude: parseFloat(editForm.longitude || 0),
        starRating: parseInt(editForm.starRating),
        isActive: editForm.isActive
      };
      await updateInfo(editForm.id, payload);
      alert("Cập nhật thành công!");
      setIsEditModalOpen(false);
      fetchHotels();
    } catch (err) {
      alert("Lỗi cập nhật: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleOpenUpload = (id, e) => {
    e.stopPropagation();
    setUploadHotelId(id);
    setUploadForm({ file: null, caption: '', isMain: false });
    setIsUploadModalOpen(true);
  };

  const handleUploadFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadForm(prev => ({ ...prev, file: e.target.files[0] }));
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadForm.file) {
      alert("Vui lòng chọn một file ảnh!");
      return;
    }

    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('imageFile', uploadForm.file);
      formData.append('caption', uploadForm.caption);
      formData.append('isMain', uploadForm.isMain);

      await uploadImage(uploadHotelId, formData);
      
      alert("Upload ảnh thành công!");
      setIsUploadModalOpen(false);
      fetchHotels();

    } catch (err) {
      alert("Lỗi upload: " + err.message);
    } finally {
      setUploading(false);
    }
  };


  const handleOpenAmenities = async (id, e) => {
    e.stopPropagation();
    setAmenityHotelId(id);
    setIsAmenityModalOpen(true);
    setLoadingAmenities(true);

    try {
      const [detailData, lookupData] = await Promise.all([
        getDetail(id),
        allAmenities.length > 0 ? Promise.resolve(allAmenities) : getAmenitiesLookup()
      ]);

      if (allAmenities.length === 0) setAllAmenities(lookupData);

      const currentIds = detailData.amenities 
        ? detailData.amenities.map(a => a.amenityId || a.id) 
        : [];
      
      setSelectedAmenityIds(currentIds);

    } catch (err) {
      alert("Lỗi tải dữ liệu tiện nghi: " + err.message);
      setIsAmenityModalOpen(false);
    } finally {
      setLoadingAmenities(false);
    }
  };

  const handleAmenityToggle = (amenityId) => {
    setSelectedAmenityIds(prev => {
      if (prev.includes(amenityId)) {
        return prev.filter(id => id !== amenityId);
      } else {
        return [...prev, amenityId];
      }
    });
  };

  const handleSaveAmenities = async () => {
    try {
      setSavingAmenities(true);
      const payload = {
        amenityIds: selectedAmenityIds
      };
      await updateAmenities(amenityHotelId, payload);
      alert("Cập nhật tiện nghi thành công!");
      setIsAmenityModalOpen(false);
      fetchHotels(); 
    } catch (err) {
      alert("Lỗi cập nhật: " + err.message);
    } finally {
      setSavingAmenities(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const renderStars = (rating) => {
    const filledStars = Math.max(0, Math.min(5, Math.round(rating || 0)));
    return (
      <div className="flex items-center" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="inline-block mr-1">
            <Star filled={i < filledStars} />
          </span>
        ))}
      </div>
    );
  };

  if (loading) return <div className="p-4">Đang tải dữ liệu...</div>;
  if (error) return <div className="p-4 text-red-500">Lỗi: {error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">Danh sách khách sạn</h1>
        </div>
        <div className="flex gap-3">
          <button 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow-sm flex items-center gap-2 transition"
            onClick={() => setIsAddModalOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Thêm khách sạn
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {hotels.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">Bạn chưa có khách sạn nào.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Hình ảnh</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Tên & Địa chỉ</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Khu vực</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Hạng sao</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Ngày tạo</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {hotels.map((hotel) => (
                <tr key={hotel.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-500">#{hotel.id}</td>
                  <td className="px-6 py-4">
                    <img 
                      src={hotel.thumbnailUrl || "/placeholder-image.png"} 
                      alt={hotel.name} 
                      className="w-16 h-16 object-cover rounded-md border border-gray-300"
                      onError={(e)=> e.target.src='/placeholder-image.png'}
                    />
                  </td>
                  <td className="px-6 py-4 max-w-xs cursor-pointer group" onClick={() => handleViewDetail(hotel.id)}>
                    <div className="font-bold text-blue-600 group-hover:underline text-base mb-1">
                      {hotel.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate" title={hotel.address}>
                      {hotel.address}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">{hotel.city}</div>
                    <div className="text-xs text-gray-500">{hotel.country}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">{renderStars(hotel.starRating)}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${hotel.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {hotel.isActive ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-500 text-xs">
                    {formatDate(hotel.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    {/* Nút Tiện Nghi */}
                    <button 
                      onClick={(e) => handleOpenAmenities(hotel.id, e)}
                      className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded border border-indigo-200 transition mr-2"
                    >
                      Tiện nghi
                    </button>
                    {/* Nút Ảnh */}
                    <button 
                      onClick={(e) => handleOpenUpload(hotel.id, e)}
                      className="text-purple-600 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded border border-purple-200 transition mr-2"
                    >
                      Ảnh
                    </button>
                    {/* Nút Sửa */}
                    <button 
                      onClick={(e) => handleOpenEdit(hotel.id, e)}
                      className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded border border-blue-200 transition"
                    >
                      Sửa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>


      {isModalOpen && (
        <div className="fixed inset-0 flex items-start justify-center p-4 bg-black/40" style={{ zIndex: 50 }}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto flex flex-col animate-fadeIn">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
              <h3 className="text-xl font-semibold">
                {loadingDetail ? "Đang tải..." : selectedHotel?.name}
              </h3>
              <div className="flex items-center gap-3">
                <button onClick={closeModal} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">Đóng</button>
              </div>
            </div>
            <div className="p-6">
              {loadingDetail ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                </div>
              ) : selectedHotel && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(selectedHotel.images && selectedHotel.images.length > 0) ? (
                        selectedHotel.images.map((img, idx) => {
                          const imageUrl = img.url || '/placeholder-image.png';
                          return (
                            <button key={idx} onClick={() => setSelectedImage(imageUrl)} className="w-full h-44 block rounded overflow-hidden focus:outline-none hover:opacity-90 transition shadow-sm">
                              <img src={imageUrl} alt={img.caption} className="w-full h-full object-cover" onError={(e)=> e.target.src='/placeholder-image.png'} />
                            </button>
                          )
                        })
                      ) : (
                        <button onClick={() => setSelectedImage(selectedHotel.thumbnailUrl || '/placeholder-image.png')} className="w-full h-44 block rounded overflow-hidden">
                          <img src={selectedHotel.thumbnailUrl || '/placeholder-image.png'} alt={selectedHotel.name} className="w-full h-full object-cover" onError={(e)=> e.target.src='/placeholder-image.png'} />
                        </button>
                      )}
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center gap-3">
                         {renderStars(selectedHotel.starRating)}
                         <div className="text-sm text-gray-600">{selectedHotel.city}, {selectedHotel.country}</div>
                      </div>
                      <h4 className="text-lg font-semibold mt-4 mb-2">Mô tả</h4>
                      <p className="text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded-lg">{selectedHotel.description || 'Không có mô tả.'}</p>
                    </div>
                  </div>
                  <aside className="lg:col-span-1 bg-gray-50 p-4 rounded-lg h-fit border border-gray-100">
                    <div className="mb-4">
                       <h4 className="font-bold text-gray-800 mb-2">Thông tin chung</h4>
                       <div className="text-sm mb-1"><span className={`px-2 py-1 rounded-full text-xs font-bold ${selectedHotel.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{selectedHotel.isActive ? 'HOẠT ĐỘNG' : 'ĐÃ KHÓA'}</span></div>
                       <div className="text-sm text-gray-600 mt-2"><strong>ID:</strong> {selectedHotel.id}</div>
                       <div className="text-sm text-gray-600"><strong>Ngày tạo:</strong> {formatDate(selectedHotel.createdAt)}</div>
                    </div>
                    <div className="mb-4">
                      <div className="text-sm text-gray-500 font-bold">Địa chỉ</div>
                      <div className="text-sm text-gray-700 mt-1">{selectedHotel.address || '—'}</div>
                      {(selectedHotel.latitude && selectedHotel.longitude) ? (
                        <div className="mt-3 w-full h-48 rounded overflow-hidden border shadow-sm">
                          <iframe title="hotel-location" src={`https://maps.google.com/maps?q=${selectedHotel.latitude},${selectedHotel.longitude}&hl=vi&z=15&output=embed`} className="w-full h-full border-0" allowFullScreen loading="lazy"/>
                        </div>
                      ) : (<div className="mt-2 text-xs italic text-gray-500">Chưa có bản đồ</div>)}
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 font-bold">Tiện nghi</div>
                      <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
                        {(selectedHotel.amenities && selectedHotel.amenities.length > 0) ? selectedHotel.amenities.map(a => <li key={a.amenityId || a.name}>{a.name}</li>) : <li className="italic text-gray-400">Không có dữ liệu tiện nghi</li>}
                      </ul>
                    </div>
                  </aside>
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/50" style={{ zIndex: 55 }}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800">Thêm khách sạn mới</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <form onSubmit={handleCreateHotel} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên khách sạn <span className="text-red-500">*</span></label>
                <input type="text" name="name" value={newHotel.name} onChange={handleAddInputChange} required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hạng sao</label>
                  <select name="starRating" value={newHotel.starRating} onChange={handleAddInputChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {[1, 2, 3, 4, 5].map(star => <option key={star} value={star}>{star} Sao</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quốc gia</label>
                  <input type="text" name="country" value={newHotel.country} onChange={handleAddInputChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thành phố <span className="text-red-500">*</span></label>
                <input type="text" name="city" value={newHotel.city} onChange={handleAddInputChange} required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ cụ thể <span className="text-red-500">*</span></label>
                <input type="text" name="address" value={newHotel.address} onChange={handleAddInputChange} required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea name="description" value={newHotel.description} onChange={handleAddInputChange} rows="4" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition">Hủy bỏ</button>
                <button type="submit" disabled={creating} className={`px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 transition flex items-center ${creating ? 'opacity-70 cursor-not-allowed' : ''}`}>
                  {creating ? "Đang xử lý..." : "Lưu Khách Sạn"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/50" style={{ zIndex: 55 }}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-bold text-black">Cập nhật khách sạn</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <form onSubmit={handleUpdateHotel} className="p-6 space-y-4">
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên khách sạn <span className="text-red-500">*</span></label>
                  <input type="text" name="name" value={editForm.name} onChange={handleEditInputChange} required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"/>
                </div>
                <div className="w-24">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Hoạt động</label>
                   <div className="flex items-center h-[42px]">
                      <input type="checkbox" name="isActive" checked={editForm.isActive} onChange={handleEditInputChange} className="w-5 h-5 text-yellow-600 rounded focus:ring-yellow-500"/>
                   </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hạng sao</label>
                  <select name="starRating" value={editForm.starRating} onChange={handleEditInputChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                    {[1, 2, 3, 4, 5].map(star => <option key={star} value={star}>{star} Sao</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quốc gia</label>
                  <input type="text" name="country" value={editForm.country} onChange={handleEditInputChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thành phố <span className="text-red-500">*</span></label>
                <input type="text" name="city" value={editForm.city} onChange={handleEditInputChange} required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ cụ thể <span className="text-red-500">*</span></label>
                <input type="text" name="address" value={editForm.address} onChange={handleEditInputChange} required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"/>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded border border-gray-200">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Vĩ độ (Latitude)</label>
                  <input type="number" step="any" name="latitude" value={editForm.latitude} onChange={handleEditInputChange} className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Kinh độ (Longitude)</label>
                  <input type="number" step="any" name="longitude" value={editForm.longitude} onChange={handleEditInputChange} className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea name="description" value={editForm.description} onChange={handleEditInputChange} rows="4" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition">Hủy bỏ</button>
                <button type="submit" disabled={updating} className={`px-4 py-2 text-white bg-yellow-600 rounded hover:bg-yellow-700 transition flex items-center ${updating ? 'opacity-70 cursor-not-allowed' : ''}`}>
                  {updating ? "Đang lưu..." : "Cập nhật"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {isUploadModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/50" style={{ zIndex: 55 }}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-auto flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-purple-50">
              <h3 className="text-xl font-bold text-purple-800">Thêm hình ảnh</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            
            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chọn ảnh <span className="text-red-500">*</span></label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleUploadFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chú thích (Caption)</label>
                <input 
                  type="text" 
                  value={uploadForm.caption} 
                  onChange={(e) => setUploadForm({...uploadForm, caption: e.target.value})} 
                  placeholder="Ví dụ: Hồ bơi, Phòng ngủ..."
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="isMainImage" 
                  checked={uploadForm.isMain} 
                  onChange={(e) => setUploadForm({...uploadForm, isMain: e.target.checked})} 
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="isMainImage" className="text-sm font-medium text-gray-700">Đặt làm ảnh chính</label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsUploadModalOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition">Hủy bỏ</button>
                <button 
                  type="submit" 
                  disabled={uploading} 
                  className={`px-4 py-2 text-white bg-purple-600 rounded hover:bg-purple-700 transition flex items-center ${uploading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {uploading ? "Đang tải lên..." : "Lưu ảnh"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {isAmenityModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/50" style={{ zIndex: 60 }}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-auto flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-indigo-50">
              <h3 className="text-xl font-bold text-indigo-800">Cập nhật tiện nghi</h3>
              <button onClick={() => setIsAmenityModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            
            <div className="p-6">
              {loadingAmenities ? (
                <div className="flex justify-center items-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : allAmenities.length === 0 ? (
                <p className="text-gray-500 text-center">Không có dữ liệu tiện nghi.</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {allAmenities.map((amenity) => (
                    <div 
                      key={amenity.id || amenity.amenityId} 
                      className="flex items-center gap-2 p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer select-none" 
                      onClick={() => handleAmenityToggle(amenity.id || amenity.amenityId)}
                    >
                      <input 
                        type="checkbox" 
                        checked={selectedAmenityIds.includes(amenity.id || amenity.amenityId)}
                        onChange={() => {}}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer pointer-events-none"
                      />
                      <span className="text-sm text-gray-700">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
              <button onClick={() => setIsAmenityModalOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition">Hủy bỏ</button>
              <button 
                onClick={handleSaveAmenities} 
                disabled={savingAmenities} 
                className={`px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 transition flex items-center ${savingAmenities ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {savingAmenities ? "Đang lưu..." : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ImageViewer 
        src={selectedImage} 
        alt="Xem ảnh chi tiết" 
        onClose={() => setSelectedImage(null)} 
      />
    </div>
  );
};

export default HotelList;