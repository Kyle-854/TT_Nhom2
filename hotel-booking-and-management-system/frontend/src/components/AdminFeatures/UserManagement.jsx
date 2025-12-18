import React, { useState, useEffect } from 'react'
import { 
    getAdminUsers, 
    changeUserStatus, 
    createAdminUser, 
    getAdminUserById, 
    updateAdminUser, 
    changeUserRole 
} from '../../serviece/ApiAdminUser'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [keyword, setKeyword] = useState('')
  const [roleName, setRoleName] = useState('')
  const [isActive, setIsActive] = useState('')
  const [sortBy, setSortBy] = useState('Id')
  const [isDescending, setIsDescending] = useState('false') 
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    roleId: 1, 
    isActive: true
  })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [editUser, setEditUser] = useState({ id: null, fullName: '', phone: '' })
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [isUpdatingRole, setIsUpdatingRole] = useState(false)
  const [roleEditUser, setRoleEditUser] = useState({ id: null, roleId: 1 })

  useEffect(() => {
    fetchUsers()
  }, [pageIndex, pageSize]) 

  const fetchUsers = async (isFilter = false) => {
    try {
      setLoading(true)
      setError(null)
      const currentPage = isFilter ? 1 : pageIndex;
      if (isFilter) setPageIndex(1);

      const params = {
        PageIndex: currentPage,
        PageSize: pageSize,
        SortBy: sortBy,
        IsDescending: isDescending === 'true'
      }
      if (keyword.trim()) params.Keyword = keyword.trim()
      if (roleName.trim()) params.RoleName = roleName.trim()
      if (isActive !== '') params.IsActive = isActive === 'true'

      const data = await getAdminUsers(params)
      
      let userList = [];
      if (Array.isArray(data)) {
        userList = data;
      } else if (data && Array.isArray(data.items)) {
        userList = data.items;
        if (data.hasNextPage !== undefined) setHasNextPage(data.hasNextPage);
      } else if (data && Array.isArray(data.data)) {
        userList = data.data;
      }
      if (!data?.hasNextPage) setHasNextPage(userList.length === pageSize);

      setUsers(userList)
    } catch (err) {
      const errorMsg = err.message || 'Lỗi khi lấy danh sách người dùng';
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleApplyFilter = () => fetchUsers(true) 

  const handleReset = () => {
    setKeyword('')
    setRoleName('')
    setIsActive('')
    setSortBy('Id')
    setIsDescending('false')
    setPageIndex(1)
    
    getAdminUsers({ PageIndex: 1, PageSize: 10, SortBy: 'Id', IsDescending: false })
      .then(data => {
         const list = Array.isArray(data) ? data : (data?.items || data?.data || []);
         setUsers(list);
         setHasNextPage(list.length === 10);
      })
      .catch(err => setError(err.message))
  }

  const handleToggleStatus = async (userId, currentStatus) => {
    if(!window.confirm(`Bạn có chắc muốn ${currentStatus ? 'khóa' : 'mở khóa'} người dùng này?`)) return;
    try {
        await changeUserStatus(userId, !currentStatus);
        setUsers(users.map(u => u.userId === userId ? { ...u, isActive: !currentStatus } : u));

        if (selectedUser && (selectedUser.userId === userId || selectedUser.id === userId)) {
            setSelectedUser(prev => ({ ...prev, isActive: !currentStatus }));
        }
    } catch (err) {
        alert(err.message || "Thao tác thất bại");
    }
  }

  const handleViewUser = async (userId) => {
    try {
        setLoadingDetail(true);
        setShowDetailModal(true);
        const data = await getAdminUserById(userId);
        setSelectedUser(data);
    } catch (err) {
        alert("Không thể lấy thông tin chi tiết");
        setShowDetailModal(false);
    } finally {
        setLoadingDetail(false);
    }
  }

  const handleEditClick = (user, e) => {
    e.stopPropagation();
    setEditUser({
        id: user.userId || user.id,
        fullName: user.fullName || '',
        phone: user.phone || ''
    });
    setShowEditModal(true);
  }

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editUser.fullName.trim()) { alert("Họ tên không được để trống"); return; }
    const phoneRegex = /^\d+$/; 
    if (editUser.phone && !phoneRegex.test(editUser.phone)) { alert("Số điện thoại không hợp lệ!"); return; }

    try {
        setIsUpdating(true);
        await updateAdminUser(editUser.id, { fullName: editUser.fullName, phone: editUser.phone });
        alert("Cập nhật thông tin thành công!");
        setShowEditModal(false);
        fetchUsers();
    } catch (err) {
        alert(err.message || "Cập nhật thất bại");
    } finally {
        setIsUpdating(false);
    }
  }

  const handleRoleEditClick = (user, e) => {
    e.stopPropagation();
    let currentRoleId = 1;
    if (user.roleName === 'HotelOwner' || user.roleName === 'HotelManager') currentRoleId = 2;
    if (user.roleName === 'Admin') currentRoleId = 3;

    setRoleEditUser({
        id: user.userId || user.id,
        roleId: currentRoleId
    });
    setShowRoleModal(true);
  }

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    try {
        setIsUpdatingRole(true);
        await changeUserRole(roleEditUser.id, roleEditUser.roleId);
        alert("Cập nhật vai trò thành công!");
        setShowRoleModal(false);
        fetchUsers();
    } catch (err) {
        alert(err.message || "Thay đổi vai trò thất bại");
    } finally {
        setIsUpdatingRole(false);
    }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.email || !newUser.password || !newUser.fullName) { alert("Vui lòng điền đủ thông tin (*)"); return; }
    if (newUser.password !== confirmPassword) { alert("Mật khẩu không khớp!"); return; }
    if (newUser.password.length < 6) { alert("Mật khẩu quá ngắn!"); return; }
    const phoneRegex = /^\d+$/; 
    if (newUser.phone && !phoneRegex.test(newUser.phone)) { alert("SĐT không hợp lệ!"); return; }

    const isEmailExist = users.some(u => u.email?.toLowerCase() === newUser.email.toLowerCase());
    if (isEmailExist) { alert("Email này đã tồn tại!"); return; }

    try {
        setIsCreating(true);
        await createAdminUser(newUser);
        alert("Tạo người dùng thành công!");
        setShowCreateModal(false);
        setNewUser({ email: '', password: '', fullName: '', phone: '', roleId: 1, isActive: true });
        setConfirmPassword(''); 
        fetchUsers(); 
    } catch (err) {
        alert(err.message || "Tạo thất bại");
    } finally {
        setIsCreating(false);
    }
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-red-600 bg-red-50 p-4 rounded border border-red-200 mb-4">Lỗi: {error}</div>
        <button onClick={() => fetchUsers()} className="bg-blue-600 text-white px-4 py-2 rounded">Thử lại</button>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
            <div className="text-sm text-gray-500">Tổng quan hệ thống</div>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow-sm flex items-center gap-2 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
            Thêm người dùng
        </button>
      </div>
      
      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm p-5 mb-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Từ khóa</label>
            <input type="text" placeholder="Tên, Email, SĐT..." value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Vai trò</label>
            <select value={roleName} onChange={(e) => setRoleName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              <option value="">-- Tất cả --</option>
              <option value="Admin">Admin</option>
              <option value="Customer">Customer</option>
              <option value="HotelOwner">HotelOwner</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Trạng thái</label>
            <select value={isActive} onChange={(e) => setIsActive(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              <option value="">-- Tất cả --</option>
              <option value="true">Hoạt động</option>
              <option value="false">Đã khóa</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Sắp xếp</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              <option value="Id">ID</option>
              <option value="FullName">Họ tên</option>
              <option value="Email">Email</option>
              <option value="CreatedAt">Ngày tạo</option>
              <option value="Phone">Điện thoại</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Thứ tự</label>
            <select value={isDescending} onChange={(e) => setIsDescending(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              <option value="true">Giảm dần</option>
              <option value="false">Tăng dần</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
            <button onClick={handleReset} className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 font-medium text-sm transition">Xóa bộ lọc</button>
            <button onClick={handleApplyFilter} className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 font-medium text-sm shadow-sm transition">Áp dụng lọc</button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
            <div className="p-10 text-center"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div><p className="mt-2 text-gray-500 text-sm">Đang tải dữ liệu...</p></div>
        ) : (
            <>
            <div className="overflow-x-auto">
                <table className="w-full whitespace-nowrap">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Thông tin cá nhân</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Vai trò</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Trạng thái</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Hành động</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.length > 0 ? (
                    users.map((user) => (
                        <tr key={user.userId || user.id} onClick={() => handleViewUser(user.userId || user.id)} className="hover:bg-gray-50 transition cursor-pointer">
                        <td className="px-6 py-4 text-sm text-gray-500">#{user.userId || user.id}</td>
                        <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{user.fullName || 'Chưa cập nhật tên'}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            <div className="text-xs text-gray-400">{user.phone}</div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded border text-xs font-medium 
                            ${(user.roleName === 'Admin') ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                              (user.roleName === 'HotelOwner' || user.roleName === 'HotelManager') ? 'bg-orange-50 text-orange-700 border-orange-200' :
                              'bg-blue-50 text-blue-700 border-blue-200'}`}>
                            {user.roleName || 'Customer'}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                            ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {user.isActive ? '● Hoạt động' : '● Đã khóa'}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                            {/* Nút Sửa Vai Trò */}
                            <button onClick={(e) => handleRoleEditClick(user, e)} className="text-orange-600 hover:text-orange-900 bg-orange-50 hover:bg-orange-100 px-3 py-1 rounded border border-orange-200 transition mr-2">Vai trò</button>
                            {/* Nút Sửa Thông Tin */}
                            <button onClick={(e) => handleEditClick(user, e)} className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded border border-blue-200 transition mr-2">Sửa</button>
                            {/* Nút Khóa/Mở */}
                            {user.isActive ? (
                                <button onClick={(e) => { e.stopPropagation(); handleToggleStatus(user.userId || user.id, true); }} className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded border border-red-200 transition">Khóa</button>
                            ) : (
                                <button onClick={(e) => { e.stopPropagation(); handleToggleStatus(user.userId || user.id, false); }} className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded border border-green-200 transition">Mở khóa</button>
                            )}
                        </td>
                        </tr>
                    ))
                    ) : (
                    <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500"><p>Không tìm thấy dữ liệu phù hợp.</p></td></tr>
                    )}
                </tbody>
                </table>
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-500">Trang <span className="font-medium">{pageIndex}</span></div>
                <div className="flex gap-2">
                    <button onClick={() => setPageIndex(prev => Math.max(prev - 1, 1))} disabled={pageIndex === 1} className="px-3 py-1 border border-gray-300 rounded bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100">Trước</button>
                    <button onClick={() => setPageIndex(prev => prev + 1)} disabled={!hasNextPage && users.length < pageSize} className="px-3 py-1 border border-gray-300 rounded bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100">Sau</button>
                    <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPageIndex(1); }} className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm outline-none"><option value="10">10 / trang</option><option value="20">20 / trang</option><option value="50">50 / trang</option></select>
                </div>
            </div>
            </>
        )}
      </div>

      {/* --- MODAL TẠO NGƯỜI DÙNG --- */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-down">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center"><h3 className="text-lg font-bold text-gray-800">Thêm người dùng mới</h3><button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>
                <form onSubmit={handleCreateUser} className="p-6">
                    <div className="space-y-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label><input type="email" required className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu <span className="text-red-500">*</span></label><input type="password" required minLength="6" className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận Mật khẩu <span className="text-red-500">*</span></label><input type="password" required className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label><input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={newUser.fullName} onChange={(e) => setNewUser({...newUser, fullName: e.target.value})} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label><input type="text" className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={newUser.phone} onChange={(e) => setNewUser({...newUser, phone: e.target.value})} /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Vai trò <span className="text-red-500">*</span></label><select className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={newUser.roleId} onChange={(e) => setNewUser({...newUser, roleId: Number(e.target.value)})}><option value="1">Customer</option><option value="2">HotelOwner</option><option value="3">Admin</option></select></div>
                        </div>
                        <div className="flex items-center gap-2 mt-2"><input type="checkbox" id="isActiveUser" className="h-4 w-4 text-blue-600 border-gray-300 rounded" checked={newUser.isActive} onChange={(e) => setNewUser({...newUser, isActive: e.target.checked})} /><label htmlFor="isActiveUser" className="text-sm text-gray-700">Kích hoạt tài khoản ngay</label></div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition">Hủy</button>
                        <button type="submit" disabled={isCreating} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2 disabled:bg-blue-400">{isCreating && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>}{isCreating ? 'Đang tạo...' : 'Tạo mới'}</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* --- MODAL SỬA THÔNG TIN --- */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-down">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center"><h3 className="text-lg font-bold text-gray-800">Cập nhật thông tin</h3><button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>
                <form onSubmit={handleUpdateUser} className="p-6">
                    <div className="space-y-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label><input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={editUser.fullName} onChange={(e) => setEditUser({...editUser, fullName: e.target.value})} /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label><input type="text" className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={editUser.phone} onChange={(e) => setEditUser({...editUser, phone: e.target.value})} /></div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition">Hủy</button>
                        <button type="submit" disabled={isUpdating} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2 disabled:bg-blue-400">{isUpdating && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>}{isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* --- MODAL SỬA VAI TRÒ --- */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden animate-fade-in-down">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center"><h3 className="text-lg font-bold text-gray-800">Phân quyền</h3><button onClick={() => setShowRoleModal(false)} className="text-gray-400 hover:text-gray-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>
                <form onSubmit={handleUpdateRole} className="p-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Chọn vai trò mới <span className="text-red-500">*</span></label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={roleEditUser.roleId} onChange={(e) => setRoleEditUser({...roleEditUser, roleId: Number(e.target.value)})}>
                            <option value="1">Customer</option>
                            <option value="2">HotelOwner</option>
                            <option value="3">Admin</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-2">Lưu ý: Thay đổi vai trò có thể ảnh hưởng đến quyền truy cập.</p>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={() => setShowRoleModal(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition">Hủy</button>
                        <button type="submit" disabled={isUpdatingRole} className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition flex items-center gap-2 disabled:bg-orange-400">{isUpdatingRole && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>}{isUpdatingRole ? 'Đang lưu...' : 'Lưu vai trò'}</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* --- MODAL CHI TIẾT NGƯỜI DÙNG (Đã xóa avatar) --- */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-down">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-800">Thông tin chi tiết</h3>
                    <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                </div>
                <div className="p-6">
                    {loadingDetail ? (
                        <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
                    ) : selectedUser ? (
                        <div className="space-y-4">
                            <div className="mb-4">
                                <h2 className="text-xl font-bold text-gray-800">{selectedUser.fullName}</h2>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium mt-1 ${(selectedUser.roleName === 'Admin') ? 'bg-purple-100 text-purple-800' : (selectedUser.roleName === 'HotelOwner' || selectedUser.roleName === 'HotelManager') ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>{selectedUser.roleName}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs font-semibold text-gray-500 uppercase">ID</label><p className="text-sm font-medium text-gray-900">#{selectedUser.userId || selectedUser.id}</p></div>
                                <div><label className="block text-xs font-semibold text-gray-500 uppercase">Trạng thái</label><p className={`text-sm font-medium ${selectedUser.isActive ? 'text-green-600' : 'text-red-600'}`}>{selectedUser.isActive ? 'Hoạt động' : 'Đã khóa'}</p></div>
                                <div className="col-span-2"><label className="block text-xs font-semibold text-gray-500 uppercase">Email</label><p className="text-sm font-medium text-gray-900 break-words">{selectedUser.email}</p></div>
                                <div><label className="block text-xs font-semibold text-gray-500 uppercase">Số điện thoại</label><p className="text-sm font-medium text-gray-900">{selectedUser.phone || 'Chưa cập nhật'}</p></div>
                                <div><label className="block text-xs font-semibold text-gray-500 uppercase">Ngày tạo</label><p className="text-sm font-medium text-gray-900">{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString('vi-VN') : '—'}</p></div>
                                <div><label className="block text-xs font-semibold text-gray-500 uppercase">Tổng đặt phòng</label><p className="text-sm font-medium text-gray-900">{selectedUser.totalBookings ?? 0}</p></div>
                                <div><label className="block text-xs font-semibold text-gray-500 uppercase">Tổng đánh giá</label><p className="text-sm font-medium text-gray-900">{selectedUser.totalReviews ?? 0}</p></div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">Không có thông tin.</p>
                    )}
                </div>
                <div className="px-6 py-4 bg-gray-50 flex justify-end"><button onClick={() => setShowDetailModal(false)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium">Đóng</button></div>
            </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement