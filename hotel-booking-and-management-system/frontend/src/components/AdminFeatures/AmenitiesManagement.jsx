import React, { useState, useEffect } from 'react'
import { getAllAmenities, createAmenity, updateAmenity, deleteAmenity } from '../../serviece/ApiAdminSettings'

const AmenitiesManagement = () => {
  const [amenities, setAmenities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [processingId, setProcessingId] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({ name: '', category: '' })
  const [showEditModal, setShowEditModal] = useState(false)
  const [editData, setEditData] = useState({ id: null, name: '', category: '' })

  useEffect(() => {
    fetchAmenities()
  }, [])

  const fetchAmenities = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllAmenities()
      console.log('[AmenitiesManagement] getAllAmenities response:', data)

      if (Array.isArray(data)) {
        setAmenities(data)
      } else if (data && Array.isArray(data.items)) {
        setAmenities(data.items)
      } else if (data && Array.isArray(data.amenities)) {
        setAmenities(data.amenities)
      } else {
        setAmenities(data || [])
      }
    } catch (err) {
      setError(err?.message || 'Lỗi khi lấy danh sách tiện ích')
    } finally {
      setLoading(false)
    }
  }


  const handleDelete = async (amenityId) => {
    if (!amenityId) return
    if (!window.confirm('Bạn chắc chắn muốn xóa tiện ích này?')) return

    try {
      setProcessingId(amenityId)
      await deleteAmenity(amenityId)
      alert('Xóa tiện ích thành công')
      
      fetchAmenities() 
    } catch (err) {
      console.error('[AmenitiesManagement] delete error', err)
      alert('Xóa tiện ích thất bại: ' + (err?.message || 'Lỗi không xác định'))
    } finally {
      setProcessingId(null)
    }
  }


  const handleOpenCreateModal = () => {
    setFormData({ name: '', category: '' })
    setShowCreateModal(true)
  }

  const handleCloseCreateModal = () => {
    setShowCreateModal(false)
    setFormData({ name: '', category: '' })
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCreateAmenity = async () => {
    if (!formData.name.trim()) {
      alert('Tên tiện ích không được để trống')
      return
    }

    try {
      setProcessingId('creating')
      await createAmenity(formData)
      alert('Thêm tiện ích thành công')
      handleCloseCreateModal()
      
      fetchAmenities()
    } catch (err) {
      console.error('[AmenitiesManagement] create error', err)
      alert('Thêm tiện ích thất bại: ' + (err?.message || 'Lỗi không xác định'))
    } finally {
      setProcessingId(null)
    }
  }


  const handleOpenEditModal = (amenity) => {
    setEditData({ id: amenity.amenityId, name: amenity.name, category: amenity.category || '' })
    setShowEditModal(true)
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
    setEditData({ id: null, name: '', category: '' })
  }

  const handleEditFormChange = (e) => {
    const { name, value } = e.target
    setEditData(prev => ({ ...prev, [name]: value }))
  }

  const handleUpdateAmenity = async () => {
    if (!editData.name.trim()) {
      alert('Tên tiện ích không được để trống')
      return
    }

    try {
      setProcessingId('updating')
      await updateAmenity(editData.id, { name: editData.name, category: editData.category })
      alert('Cập nhật tiện ích thành công')
      handleCloseEditModal()
      
      fetchAmenities()
    } catch (err) {
      console.error('[AmenitiesManagement] update error', err)
      alert('Cập nhật tiện ích thất bại: ' + (err?.message || 'Lỗi không xác định'))
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Đang tải danh sách tiện ích...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={fetchAmenities}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">Quản lý Tiện ích</h1>
            <p className="text-gray-500 text-sm">Tổng số tiện ích: <span className="font-semibold text-gray-800">{amenities.length}</span></p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
          Thêm tiện ích
        </button>
      </div>

      {(!Array.isArray(amenities) || amenities.length === 0) ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">Chưa có tiện ích nào được tạo.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tên tiện ích</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Danh mục</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {amenities.map((amenity, index) => (
                  <tr key={amenity.amenityId || index} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-500">#{amenity.amenityId}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{amenity.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                        {amenity.category ? (
                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">{amenity.category}</span>
                        ) : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          disabled={processingId === amenity.amenityId}
                          onClick={() => handleOpenEditModal(amenity)}
                          className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100 transition disabled:opacity-50"
                        >
                          Sửa
                        </button>
                        <button
                          disabled={processingId === amenity.amenityId}
                          onClick={() => handleDelete(amenity.amenityId)}
                          className="px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 transition disabled:opacity-50"
                        >
                          {processingId === amenity.amenityId ? '...' : 'Xóa'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full animate-fade-in-down">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Thêm tiện ích mới</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên tiện ích <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Ví dụ: Hồ bơi vô cực"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  placeholder="Ví dụ: Ngoài trời"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCloseCreateModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateAmenity}
                disabled={processingId === 'creating'}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50 flex items-center"
              >
                {processingId === 'creating' && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>}
                Thêm mới
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full animate-fade-in-down">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Cập nhật tiện ích</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên tiện ích <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleEditFormChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                <input
                  type="text"
                  name="category"
                  value={editData.category}
                  onChange={handleEditFormChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCloseEditModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateAmenity}
                disabled={processingId === 'updating'}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 flex items-center"
              >
                {processingId === 'updating' && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>}
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AmenitiesManagement