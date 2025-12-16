import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { changePassword, forgotPassword, resetPassword, getCurrentUser } from '../../serviece/ApiAuth'

const ChangePassword = () => {

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)


  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false)


  const [forgotIdentifier, setForgotIdentifier] = useState('')
  const [isForgotLoading, setIsForgotLoading] = useState(false)
  const [forgotError, setForgotError] = useState('')


  const [resetCode, setResetCode] = useState('') 
  const [newPasswordForReset, setNewPasswordForReset] = useState('')
  const [confirmNewPasswordForReset, setConfirmNewPasswordForReset] = useState('')
  const [isResetting, setIsResetting] = useState(false)
  const [resetError, setResetError] = useState('')
  const [resetSuccess, setResetSuccess] = useState('')

  const navigate = useNavigate()


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser()

        if (user && user.email) {
          setForgotIdentifier(user.email)
        }
      } catch (error) {
        console.error('Không thể lấy thông tin người dùng:', error)
      }
    }
    fetchUser()
  }, []) 

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Vui lòng điền đủ các trường')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và xác nhận không khớp')
      return
    }

    setLoading(true)
    try {
      await changePassword({ currentPassword, newPassword })
      setSuccess('Đổi mật khẩu thành công')

      setTimeout(() => navigate('/customer'), 800)
    } catch (err) {
      setError(err.message || 'Đổi mật khẩu thất bại')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault()
    if (!forgotIdentifier) {
      setForgotError('Vui lòng nhập địa chỉ email của bạn.')
      return
    }
    setIsForgotLoading(true)
    setForgotError('')
    try {
      await forgotPassword(forgotIdentifier)
    
      setIsForgotPasswordOpen(false)
      setIsResetPasswordOpen(true)
     
    } catch (error) {
      setForgotError(error.message || 'Có lỗi xảy ra, vui lòng thử lại.')
    } finally {
      setIsForgotLoading(false)
    }
  }

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault()
    setResetError('')
    setResetSuccess('')

    if (!resetCode || !newPasswordForReset || !confirmNewPasswordForReset) {
      setResetError('Vui lòng điền đầy đủ các trường.')
      return
    }
    if (newPasswordForReset !== confirmNewPasswordForReset) {
      setResetError('Mật khẩu mới và xác nhận không khớp.')
      return
    }

    setIsResetting(true)
    try {
    
      await resetPassword({ token: resetCode, newPassword: newPasswordForReset })
      setResetSuccess('Mật khẩu đã được đặt lại thành công!')
      
      setTimeout(() => navigate('/'), 3000)
    } catch (error) {
      setResetError(error.message || 'Mã xác nhận không hợp lệ hoặc đã hết hạn.')
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <>
      <div className="p-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Đổi mật khẩu</h2>

        <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4 space-y-4">
          {error && <div className="text-sm text-red-600">{error}</div>}
          {success && <div className="text-sm text-green-600">{success}</div>}

          <div>
            <label className="text-sm text-gray-600">Mật khẩu hiện tại</label>
            <input
              type="password"
              className="w-full mt-1 px-3 py-2 border rounded"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="text-right text-sm">
            <button
              type="button"
              onClick={() => setIsForgotPasswordOpen(true)}
              className="font-medium text-blue-600 hover:text-blue-500 bg-transparent border-none p-0 cursor-pointer"
            >
              Quên mật khẩu?
            </button>
          </div>

          <div>
            <label className="text-sm text-gray-600">Mật khẩu mới</label>
            <input
              type="password"
              className="w-full mt-1 px-3 py-2 border rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              className="w-full mt-1 px-3 py-2 border rounded"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Lưu thay đổi'}
            </button>
            <button type="button" className="px-4 py-2 border rounded" onClick={() => navigate(-1)} disabled={loading}>
              Hủy
            </button>
          </div>
        </form>
      </div>

      {/* --- Dialog Quên mật khẩu --- */}
      {isForgotPasswordOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
          onClick={() => setIsForgotPasswordOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 sm:p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setIsForgotPasswordOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-center mb-6">Quên mật khẩu</h2>
            <form onSubmit={handleForgotPasswordSubmit} className="grid gap-y-4">
              {forgotError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  {forgotError}
                </div>
              )}
              <div>
                <label htmlFor="forgot-identifier" className="block text-sm font-medium text-gray-700 mb-1">Email của bạn:</label>
                <input
                  type="text"
                  id="forgot-identifier"
                  value={forgotIdentifier}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={isForgotLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-2 disabled:bg-gray-400"
              >
                {isForgotLoading ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
              <p className="text-sm text-center text-gray-600 mt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(false)}
                  className="font-medium text-blue-600 hover:text-blue-500 bg-transparent border-none p-0 cursor-pointer"
                >Quay lại</button>
              </p>
            </form>
          </div>
        </div>
      )}

      {/* --- Dialog Reset Mật khẩu --- */}
      {isResetPasswordOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
          onClick={() => setIsResetPasswordOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 sm:p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setIsResetPasswordOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-center mb-4">Đặt Lại Mật Khẩu</h2>
            <p className="text-gray-600 text-sm mb-6 text-center">Vui lòng kiểm tra email và nhập mã xác nhận (token) cùng với mật khẩu mới.</p>

            <form onSubmit={handleResetPasswordSubmit} className="grid gap-y-4 text-left">
              {resetError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{resetError}</div>}
              {resetSuccess && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{resetSuccess}</div>}

              <div>
                <label htmlFor="reset-code" className="block text-sm font-medium text-gray-700 mb-1">Mã Xác Nhận (Token)</label>
                <input
                  id="reset-code"
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="new-password-reset" className="block text-sm font-medium text-gray-700 mb-1">Mật Khẩu Mới</label>
                <input
                  id="new-password-reset"
                  type="password"
                  value={newPasswordForReset}
                  onChange={(e) => setNewPasswordForReset(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="confirm-new-password-reset" className="block text-sm font-medium text-gray-700 mb-1">Xác Nhận Mật Khẩu Mới</label>
                <input
                  id="confirm-new-password-reset"
                  type="password"
                  value={confirmNewPasswordForReset}
                  onChange={(e) => setConfirmNewPasswordForReset(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isResetting || !!resetSuccess}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-2 disabled:bg-gray-400"
              >
                {isResetting ? 'Đang xử lý...' : 'Đặt Lại Mật Khẩu'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default ChangePassword
