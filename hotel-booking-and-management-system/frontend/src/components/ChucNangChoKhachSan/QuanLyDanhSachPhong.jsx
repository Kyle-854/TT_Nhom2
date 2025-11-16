import React, { useState } from 'react';
import AddRoom from './AddRoom';
import { FaEdit, FaTrash, FaCopy } from 'react-icons/fa';

const QuanLyDanhSachPhong = () => {
  const [view, setView] = useState('list'); // 'list', 'add', 'edit'
  const [rooms, setRooms] = useState([]);
  const [editingRoom, setEditingRoom] = useState(null);

  const handleSaveRoom = (roomData) => {
    if (editingRoom) {
      // Update existing room
      setRooms(rooms.map(room => room.id === editingRoom.id ? { ...roomData, id: room.id } : room));
    } else {
      // Add new room with a unique id
      setRooms([...rooms, { ...roomData, id: Date.now() }]);
    }
    setView('list');
    setEditingRoom(null);
  };

  const handleEdit = (roomToEdit) => {
    setEditingRoom(roomToEdit);
    setView('edit');
  };

  const handleDelete = (roomId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phòng này không?')) {
      setRooms(rooms.filter(room => room.id !== roomId));
    }
  };

  const handleDuplicate = (roomToDuplicate) => {
    const newName = `${roomToDuplicate.roomName} (Copy)`;
    // Check if a room with the new name already exists and add a number if it does
    let finalName = newName;
    let counter = 1;
    while (rooms.some(room => room.roomName === finalName)) {
      counter++;
      finalName = `${newName} ${counter}`;
    }

    const newRoom = {
      ...roomToDuplicate,
      roomName: finalName,
      id: Date.now(), // new unique id
    };
    setRooms([...rooms, newRoom]);
  };

  if (view === 'add' || view === 'edit') {
    return (
      <AddRoom
        onSave={handleSaveRoom}
        onCancel={() => {
          setView('list');
          setEditingRoom(null);
        }}
        initialData={editingRoom}
      />
    );
  }

  return (
    <div className="p-8 font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-cyan-800">Danh sách phòng</h1>
        <button
          onClick={() => {
            setEditingRoom(null);
            setView('add');
          }}
          className="py-2 px-6 bg-blue-600 text-white rounded-lg font-bold text-base cursor-pointer transition-colors hover:bg-blue-700"
        >
          Thêm phòng
        </button>
      </div>

      {rooms.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Chưa có phòng nào được thêm.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rooms.map(room => (
            <div key={room.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-cyan-700">{room.roomName}</h3>
                <div className="text-sm text-gray-600 mt-2 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                  <p><span className="font-semibold">Loại phòng:</span> {room.roomType}</p>
                  <p><span className="font-semibold">Kích thước:</span> {room.roomSize} {room.sizeUnit}</p>
                  <p><span className="font-semibold">Sức chứa:</span> Tối đa {room.adultCapacity} người lớn</p>
                  <p><span className="font-semibold">Phòng ngủ:</span> {room.bedroomOption === 'single' ? '1 phòng ngủ' : `${room.bedrooms.length} phòng ngủ`}</p>
                  <p><span className="font-semibold">Giường:</span> {room.bedrooms.map(b => `${b.bedCount} ${b.bedType}`).join(', ')}</p>
                  <p><span className="font-semibold">Trẻ em:</span> {room.allowChildren === 'yes' ? 'Cho phép' : 'Không cho phép'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-600 flex-shrink-0">
                <button onClick={() => handleDuplicate(room)} title="Sao chép" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <FaCopy className="text-blue-500" />
                </button>
                <button onClick={() => handleEdit(room)} title="Chỉnh sửa" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <FaEdit className="text-green-500" />
                </button>
                <button onClick={() => handleDelete(room.id)} title="Xóa" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <FaTrash className="text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuanLyDanhSachPhong;