import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  getRoomTypesByHotel, 
  createRoomType, 
  getRoomTypeAmenitiesLookup, 
  getRoomTypeDetail,
  updateRoomType,
  uploadRoomTypeImage,
  deleteRoomType 
} from '../../serviece/ApiPartnerRoomType'; 

const PartnerRoomType = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hotelId = location.state?.hotelId;

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editForm, setEditForm] = useState({
    id: null, name: '', code: '', description: '', defaultPrice: '',
    totalRooms: 1, maxAdults: '', maxChildren: '', amenityIds: [], isActive: true
  });

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadRoomId, setUploadRoomId] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    file: null, caption: '', isMain: false
  });

  const [allAmenities, setAllAmenities] = useState([]); 
  
  const [newRoomType, setNewRoomType] = useState({
    name: '', code: '', description: '', defaultPrice: '',
    totalRooms: 1, maxAdults: '', maxChildren: '', amenityIds: [] 
  });

  useEffect(() => {
    if (hotelId) {
      fetchRoomTypes();
      fetchAmenities();
    }
  }, [hotelId]);

  const fetchRoomTypes = async () => {
    try {
      setLoading(true);
      const data = await getRoomTypesByHotel(hotelId);
      setRooms(data);
    } catch (err) {
      console.error("Lỗi lấy danh sách phòng:", err);
      setError(err.message || "Không thể tải danh sách loại phòng.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAmenities = async () => {
    try {
      const data = await getRoomTypeAmenitiesLookup();
      setAllAmenities(data);
    } catch (err) {
      console.error("Lỗi lấy tiện nghi:", err);
    }
  };

  const handleViewDetail = async (id) => {
    try {
      setLoadingDetail(true);
      setIsDetailModalOpen(true);
      const data = await getRoomTypeDetail(id);
      setSelectedRoom(data);
    } catch (err) {
      alert("Lỗi tải thông tin chi tiết: " + err.message);
      setIsDetailModalOpen(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedRoom(null);
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoomType(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (id) => {
    setNewRoomType(prev => {
      const currentIds = prev.amenityIds;
      if (currentIds.includes(id)) return { ...prev, amenityIds: currentIds.filter(x => x !== id) };
      else return { ...prev, amenityIds: [...currentIds, id] };
    });
  };

  const handleCreateRoomType = async (e) => {
    e.preventDefault();
    if (!newRoomType.name || !newRoomType.defaultPrice || !newRoomType.totalRooms || !newRoomType.maxAdults) {
      alert("Vui lòng điền đủ: Tên, Giá, Tổng số phòng và Số lượng người lớn!");
      return;
    }
    try {
      setCreating(true);
      const payload = {
        name: newRoomType.name,
        code: newRoomType.code,
        description: newRoomType.description,
        defaultPrice: parseFloat(newRoomType.defaultPrice),
        totalRooms: parseInt(newRoomType.totalRooms),
        maxAdults: parseInt(newRoomType.maxAdults),
        maxChildren: newRoomType.maxChildren === '' ? 0 : parseInt(newRoomType.maxChildren),
        amenityIds: newRoomType.amenityIds.filter(id => id != null)
      };
      await createRoomType(hotelId, payload);
      alert("Thêm loại phòng thành công!");
      setIsAddModalOpen(false);
      setNewRoomType({
        name: '', code: '', description: '', defaultPrice: '',
        totalRooms: 1, maxAdults: '', maxChildren: '', amenityIds: []
      });
      fetchRoomTypes();
    } catch (err) {
      alert("Lỗi khi tạo phòng: " + err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleOpenEdit = async (id, e) => {
    e.stopPropagation();
    try {
      const data = await getRoomTypeDetail(id);
      setEditForm({
        id: data.roomTypeId || data.id,
        name: data.name,
        code: data.code || '',
        description: data.description || '',
        defaultPrice: data.pricePerNight || data.defaultPrice,
        totalRooms: data.totalRooms || 1,
        maxAdults: data.maxAdults || 1,
        maxChildren: data.maxChildren || 0,
        amenityIds: data.amenities ? data.amenities.map(a => a.amenityId || a.id) : [],
        isActive: data.isActive !== undefined ? data.isActive : true
      });
      setIsEditModalOpen(true);
    } catch (err) {
      alert("Không thể tải thông tin phòng để sửa: " + err.message);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditAmenityToggle = (id) => {
    setEditForm(prev => {
      const currentIds = prev.amenityIds;
      if (currentIds.includes(id)) return { ...prev, amenityIds: currentIds.filter(x => x !== id) };
      else return { ...prev, amenityIds: [...currentIds, id] };
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editForm.name || !editForm.defaultPrice || !editForm.totalRooms || !editForm.maxAdults) {
      alert("Vui lòng điền đủ các trường bắt buộc!");
      return;
    }
    try {
      setUpdating(true);
      const payload = {
        name: editForm.name,
        code: editForm.code,
        description: editForm.description,
        defaultPrice: parseFloat(editForm.defaultPrice),
        totalRooms: parseInt(editForm.totalRooms),
        maxAdults: parseInt(editForm.maxAdults),
        maxChildren: editForm.maxChildren === '' ? 0 : parseInt(editForm.maxChildren),
        amenityIds: editForm.amenityIds.filter(id => id != null),
        isActive: editForm.isActive
      };
      await updateRoomType(editForm.id, payload);
      alert("Cập nhật thành công!");
      setIsEditModalOpen(false);
      fetchRoomTypes();
    } catch (err) {
      alert("Cập nhật thất bại: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleOpenUpload = (id, e) => {
    e.stopPropagation();
    setUploadRoomId(id);
    setUploadForm({ file: null, caption: '', isMain: false });
    setIsUploadModalOpen(true);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadForm.file) {
      alert("Vui lòng chọn file ảnh!");
      return;
    }
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('imageFile', uploadForm.file);
      formData.append('caption', uploadForm.caption);
      formData.append('isMain', uploadForm.isMain); 
      
      await uploadRoomTypeImage(uploadRoomId, formData);
      alert("Upload ảnh thành công!");
      setIsUploadModalOpen(false);
      fetchRoomTypes();
    } catch (err) {
      alert("Lỗi upload: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleHideRoom = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Bạn có chắc chắn muốn ẩn loại phòng này không?")) return;
    try {
      await deleteRoomType(id);
      alert("Đã ẩn loại phòng thành công!");
      fetchRoomTypes();
    } catch (err) {
      alert("Lỗi khi ẩn phòng: " + err.message);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const ImageViewer = ({ src, onClose }) => {
    if (!src) return null;
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4" onClick={onClose}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300">×</button>
        <img src={src} alt="Full view" className="max-w-full max-h-[90vh] object-contain rounded" onClick={e => e.stopPropagation()} />
      </div>
    );
  };

  if (!hotelId) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy khách sạn được chọn.</p>
          <button onClick={() => navigate('/hotelowner/hotel-list')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
            Quay lại danh sách khách sạn
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <button onClick={() => navigate('/hotelowner/hotel-list')} className="text-sm text-blue-600 hover:underline mb-1 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Quay lại danh sách khách sạn
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý loại phòng <span className="text-gray-500 text-lg font-normal">(Hotel ID: #{hotelId})</span></h1>
        </div>
        
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-sm transition flex items-center gap-2" onClick={() => setIsAddModalOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
          Thêm loại phòng
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded border border-red-200">Lỗi: {error}</div>
      ) : rooms.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-10 text-center border-2 border-dashed border-gray-300">
          <p className="text-gray-500">Khách sạn này chưa có loại phòng nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div 
              key={room.roomTypeId} 
              onClick={() => handleViewDetail(room.roomTypeId)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer group"
            >
              <div className="h-48 bg-gray-200 relative">
                <img 
                  src={room.images && room.images.length > 0 ? room.images[0].url : "https://via.placeholder.com/400x300?text=No+Image"} 
                  alt={room.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.src = "https://via.placeholder.com/400x300?text=No+Image"}
                />
                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">ID: {room.roomTypeId}</div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <h3 className="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition" title={room.name}>{room.name}</h3>
                  <span className={`shrink-0 px-2 py-0.5 text-xs rounded-full font-medium border ${room.isActive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                    {room.isActive ? 'Hoạt động' : 'Đã ẩn'}
                  </span>
                </div>

                <div className="mb-3">
                  <span className="text-xl font-bold text-blue-600">{formatCurrency(room.pricePerNight)}</span>
                  <span className="text-sm text-gray-500"> / đêm</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    <span>{room.capacity} người</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-4 h-16 overflow-hidden content-start">
                  {room.amenities && room.amenities.length > 0 ? (
                    room.amenities.slice(0, 5).map((amenity) => (
                      <span key={amenity.amenityId || amenity.id} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200">{amenity.name}</span>
                    ))
                  ) : <span className="text-xs text-gray-400 italic">Chưa có tiện nghi</span>}
                  {room.amenities && room.amenities.length > 5 && <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded border border-gray-200">+{room.amenities.length - 5}</span>}
                </div>
                
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <button onClick={(e) => handleOpenUpload(room.roomTypeId, e)} className="flex-1 bg-purple-50 text-purple-600 hover:bg-purple-100 py-2 rounded text-sm font-medium transition border border-purple-200">Ảnh</button>
                  <button onClick={(e) => handleOpenEdit(room.roomTypeId, e)} className="flex-1 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 py-2 rounded text-sm font-medium transition border border-yellow-200">Sửa</button>
                  <button onClick={(e) => handleHideRoom(room.roomTypeId, e)} className="flex-1 bg-gray-50 text-gray-600 hover:bg-gray-100 py-2 rounded text-sm font-medium transition border border-gray-200">Ẩn</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}


      {isDetailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in-down">
            <div className="flex justify-between p-4 border-b bg-gray-50 sticky top-0"><h3 className="text-xl font-bold">{loadingDetail ? "Loading..." : selectedRoom?.name}</h3><button onClick={closeDetailModal} className="text-2xl text-gray-500">×</button></div>
            <div className="p-6 overflow-y-auto">
              {loadingDetail ? <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div> : selectedRoom && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="h-64 bg-gray-200 rounded-lg overflow-hidden border border-gray-200 cursor-pointer" onClick={() => setSelectedImage(selectedRoom.images?.[0]?.url)}>
                      <img src={selectedRoom.images?.[0]?.url || "/placeholder.png"} className="w-full h-64 object-cover rounded border" onError={e=>e.target.src="/placeholder.png"} onClick={()=>setSelectedImage(selectedRoom.images?.[0]?.url)}/>
                    </div>
                    {selectedRoom.images && selectedRoom.images.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">{selectedRoom.images.slice(1, 5).map((img, idx) => (<div key={idx} className="h-20 bg-gray-100 rounded overflow-hidden border cursor-pointer" onClick={() => setSelectedImage(img.url)}><img src={img.url} className="h-16 w-full object-cover hover:opacity-80 transition" /></div>))}</div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div><div className="flex items-center justify-between"><span className="text-sm text-gray-500">ID: #{selectedRoom.roomTypeId}</span></div><div className="text-2xl font-bold text-blue-600 mt-1">{formatCurrency(selectedRoom.pricePerNight)} <span className="text-sm font-normal text-gray-500">/ đêm</span></div></div>
                    <div className="grid grid-cols-2 gap-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <div><span className="block text-xs text-gray-500 uppercase font-semibold">Sức chứa</span><span className="font-medium text-gray-800">{selectedRoom.capacity || 0} người</span></div>
                      {selectedRoom.maxAdults && <div><span className="block text-xs text-gray-500 uppercase font-semibold">Chi tiết</span><span className="font-medium text-gray-800">{selectedRoom.maxAdults} Lớn, {selectedRoom.maxChildren} Trẻ</span></div>}
                    </div>
                    <div><h4 className="font-semibold text-gray-800 mb-2">Tiện nghi</h4><div className="flex flex-wrap gap-2">{selectedRoom.amenities && selectedRoom.amenities.length > 0 ? (selectedRoom.amenities.map(am => (<span key={am.amenityId} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-200">{am.name}</span>))) : (<span className="text-gray-500 text-sm italic">Không có tiện nghi.</span>)}</div></div>
                    <div><h4 className="font-semibold text-gray-800 mb-2">Mô tả</h4><div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line bg-gray-50 p-3 rounded border border-gray-100 max-h-40 overflow-y-auto">{selectedRoom.description || "Chưa có mô tả."}</div></div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t flex justify-end"><button onClick={closeDetailModal} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Đóng</button></div>
          </div>
        </div>
      )}


      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto flex flex-col animate-fadeIn">
            <div className="flex justify-between p-4 border-b bg-gray-50 sticky top-0 z-10"><h3 className="text-xl font-bold text-gray-800">Thêm loại phòng mới</h3><button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button></div>
            <form onSubmit={handleCreateRoomType} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Tên phòng *</label><input name="name" value={newRoomType.name} onChange={handleAddInputChange} required className="w-full border rounded p-2" /></div>
                <div><label className="block text-sm font-medium mb-1">Mã phòng</label><input name="code" value={newRoomType.code} onChange={handleAddInputChange} className="w-full border rounded p-2" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Giá (VNĐ) *</label><input type="number" name="defaultPrice" value={newRoomType.defaultPrice} onChange={handleAddInputChange} required min="0" className="w-full border rounded p-2 font-bold text-blue-600" /></div>
                <div><label className="block text-sm font-medium mb-1">Tổng số phòng *</label><input type="number" name="totalRooms" value={newRoomType.totalRooms} onChange={handleAddInputChange} required min="1" className="w-full border rounded p-2" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-blue-50 p-3 rounded">
                <div><label className="block text-xs font-bold uppercase mb-1">Người lớn *</label><input type="number" name="maxAdults" value={newRoomType.maxAdults} onChange={handleAddInputChange} required min="1" className="w-full border rounded p-1" /></div>
                <div><label className="block text-xs font-bold uppercase mb-1">Trẻ em</label><input type="number" name="maxChildren" value={newRoomType.maxChildren} onChange={handleAddInputChange} min="0" className="w-full border rounded p-1" /></div>
              </div>
              <div><label className="block text-sm font-medium mb-2">Tiện nghi</label><div className="grid grid-cols-3 gap-2 border p-3 rounded max-h-40 overflow-y-auto">{allAmenities.map(am => (<div key={am.id || am.amenityId} className="flex gap-2"><input type="checkbox" checked={newRoomType.amenityIds.includes(am.id || am.amenityId)} onChange={() => handleAmenityToggle(am.id || am.amenityId)} /><label>{am.name}</label></div>))}</div></div>
              <div><label className="block text-sm font-medium mb-1">Mô tả</label><textarea name="description" value={newRoomType.description} onChange={handleAddInputChange} rows="3" className="w-full border rounded p-2"></textarea></div>
              <div className="flex justify-end gap-3 pt-4 border-t"><button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded">Hủy</button><button type="submit" disabled={creating} className="px-6 py-2 bg-blue-600 text-white rounded">Lưu</button></div>
            </form>
          </div>
        </div>
      )}


      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto flex flex-col animate-fade-in-down">
            <div className="flex justify-between p-4 border-b bg-yellow-50 sticky top-0 z-10"><h3 className="text-xl font-bold text-yellow-800">Cập nhật loại phòng</h3><button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button></div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Tên phòng *</label><input name="name" value={editForm.name} onChange={handleEditInputChange} required className="w-full border rounded p-2"/></div>
                <div><label className="block text-sm font-medium mb-1">Mã phòng</label><input name="code" value={editForm.code} onChange={handleEditInputChange} className="w-full border rounded p-2"/></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Giá (VNĐ) *</label><input type="number" name="defaultPrice" value={editForm.defaultPrice} onChange={handleEditInputChange} required min="0" className="w-full border rounded p-2 font-bold text-blue-600"/></div>
                <div><label className="block text-sm font-medium mb-1">Tổng số phòng *</label><input type="number" name="totalRooms" value={editForm.totalRooms} onChange={handleEditInputChange} required min="1" className="w-full border rounded p-2"/></div>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-yellow-50 p-3 rounded">
                <div><label className="block text-xs font-bold uppercase mb-1">Người lớn *</label><input type="number" name="maxAdults" value={editForm.maxAdults} onChange={handleEditInputChange} required min="1" className="w-full border rounded p-1"/></div>
                <div><label className="block text-xs font-bold uppercase mb-1">Trẻ em</label><input type="number" name="maxChildren" value={editForm.maxChildren} onChange={handleEditInputChange} min="0" className="w-full border rounded p-1"/></div>
              </div>
              <div><label className="block text-sm font-medium mb-2">Tiện nghi</label><div className="grid grid-cols-3 gap-2 border p-3 rounded max-h-40 overflow-y-auto">{allAmenities.map(am => (<div key={am.id || am.amenityId} className="flex gap-2"><input type="checkbox" checked={editForm.amenityIds.includes(am.id || am.amenityId)} onChange={() => handleEditAmenityToggle(am.id || am.amenityId)}/><label>{am.name}</label></div>))}</div></div>
              <div><label className="block text-sm font-medium mb-1">Mô tả</label><textarea name="description" value={editForm.description} onChange={handleEditInputChange} rows="3" className="w-full border rounded p-2"></textarea></div>
              <div className="flex items-center gap-2 pt-2"><input type="checkbox" name="isActive" checked={editForm.isActive} onChange={handleEditInputChange}/><label>Đang hoạt động</label></div>
              <div className="flex justify-end gap-3 pt-4 border-t"><button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded">Hủy</button><button type="submit" disabled={updating} className="px-6 py-2 bg-yellow-600 text-white rounded">Lưu thay đổi</button></div>
            </form>
          </div>
        </div>
      )}


      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-auto flex flex-col animate-fadeIn">
            <div className="flex justify-between p-4 border-b bg-purple-50 sticky top-0 z-10"><h3 className="text-xl font-bold text-purple-800">Thêm hình ảnh</h3><button onClick={() => setIsUploadModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button></div>
            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              <div><label className="block text-sm font-medium mb-1">Chọn ảnh *</label><input type="file" accept="image/*" onChange={(e) => setUploadForm({...uploadForm, file: e.target.files[0]})} className="w-full text-sm"/></div>
              <div><label className="block text-sm font-medium mb-1">Chú thích</label><input type="text" value={uploadForm.caption} onChange={(e) => setUploadForm({...uploadForm, caption: e.target.value})} className="w-full border rounded p-2"/></div>
              
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={uploadForm.isMain} 
                  onChange={(e) => setUploadForm({...uploadForm, isMain: e.target.checked})} 
                  className="w-4 h-4 text-purple-600 rounded" 
                />
                <label className="text-sm">Đặt làm ảnh chính</label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t"><button type="button" onClick={() => setIsUploadModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded">Hủy</button><button type="submit" disabled={uploading} className="px-6 py-2 bg-purple-600 text-white rounded">{uploading ? "Đang tải..." : "Lưu ảnh"}</button></div>
            </form>
          </div>
        </div>
      )}

      <ImageViewer src={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
};

export default PartnerRoomType;