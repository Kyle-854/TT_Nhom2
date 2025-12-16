import React, { useState, useEffect } from 'react'
import { getInfo, updateInfo } from '../../serviece/ApiUser'

const Profile = () => {
  const [user, setUser] = useState({
    userId: '',
    fullName: '',
    email: '',
    phone: '',
    isActive: true,
    roleName: ''
  })
  const [formData, setFormData] = useState({ fullName: '', phone: '' })
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const userData = await getInfo()
        setUser(userData)
        setFormData(userData)
        setError(null)
      } catch (err) {
        setError(err.message || 'Lỗi khi lấy thông tin người dùng')
        console.error('Fetch user error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchUserData()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCancel = () => {
    setFormData(user)
    setIsEditing(false)
    setError(null)
  }

  const handleEdit = () => {
   
    setFormData(prev => ({
      ...prev,
      fullName: '',
      phone: ''
    }))
    setIsEditing(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

   
    if (!formData.fullName || !formData.phone) {
      setError('Họ tên và số điện thoại không được để trống')
      return
    }

    try {
      setLoading(true)
     
      const updateData = {
        fullName: formData.fullName,
        phone: formData.phone
      }
      await updateInfo(updateData)
      setSuccess('Cập nhật thông tin thành công!')
      setIsEditing(false)
     
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (err) {
      setError(err.message || 'Lỗi khi cập nhật thông tin')
      console.error('Update user error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
            <p className="text-gray-600 mt-2">Quản lý thông tin cá nhân của bạn</p>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-medium">✓ {success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* User ID (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User ID
                </label>
                <input
                  type="text"
                  value={formData.userId || ''}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Họ tên <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={isEditing ? formData.fullName : user.fullName || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder={isEditing ? 'Nhập họ tên' : ''}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                    !isEditing ? 'bg-gray-100 text-gray-700 cursor-not-allowed' : 'bg-white'
                  }`}
                />
              </div>

              {/* Email (always read-only) */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={user.email || ''}
                  readOnly
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={isEditing ? formData.phone : user.phone || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder={isEditing ? 'Nhập số điện thoại' : ''}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                    !isEditing ? 'bg-gray-100 text-gray-700 cursor-not-allowed' : 'bg-white'
                  }`}
                />
              </div>

              {/* Role Name (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vai trò
                </label>
                <input
                  type="text"
                  value={formData.roleName || ''}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Is Active (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <div className="flex items-center px-4 py-2 bg-gray-100 rounded-lg">
                  <span className={`inline-block w-3 h-3 rounded-full mr-3 ${
                    formData.isActive ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                  <span className="text-gray-700">
                    {formData.isActive ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex gap-4">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium transition"
                >
                  Chỉnh sửa
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Đang lưu...' : 'Lưu'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex-1 bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Hủy
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile