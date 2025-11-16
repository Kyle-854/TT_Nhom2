import React, { useState, useMemo } from 'react';

const roomTypes = ["Phòng đơn", "Phòng đôi", "Phòng suite", "Phòng gia đình"];
const bedTypes = ["Giường đơn", "Giường đôi", "Giường cỡ Queen", "Giường cỡ King"];
const sizeUnits = ["sqm", "sqft"];
const imageCategories = ["Bedroom", "Bathroom", "Others"];

const allAmenities = {
  "Tiện nghi tích hợp": ["Ban công sân thượng", "Hồ bơi riêng", "Phòng thông nhau"],
  "Tiện nghi phòng": ["Điều hòa không khí", "Máy sấy tóc", "Bàn làm việc", "Wifi", "Lò vi sóng", "Bàn ủi", "Tivi", "Tủ lạnh", "Quầy bar nhỏ", "Máy pha cà phê", "Nước đóng chai miễn phí"],
  "Phòng tắm": ["Đồ vệ sinh cá nhân", "Vòi sen", "Áo choàng tắm", "Phòng tắm riêng", "Bồn tắm", "Nước nóng"],
};

const AddRoom = ({ onSave, onCancel, initialData }) => {
  const [roomData, setRoomData] = useState(initialData || {
    roomType: roomTypes[0],
    roomName: '',
    roomSize: '',
    sizeUnit: sizeUnits[0],
    smoking: 'no',
    bedroomOption: 'single',
    bedrooms: [{ bedType: bedTypes[0], bedCount: 1 }],
    adultCapacity: 1,
    allowChildren: 'no',
    allowExtraBed: 'no',
    minPrice: '',
    images: [],
    selectedAmenities: [],
  });

  const {
    roomType, roomName, roomSize, sizeUnit, smoking, bedroomOption, bedrooms,
    adultCapacity, allowChildren, allowExtraBed, minPrice, images, selectedAmenities
  } = roomData;

  const fileInputRef = React.useRef(null);

  const handleInputChange = (field, value) => {
    setRoomData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiRoomCountChange = (e) => {
    const count = Math.max(1, parseInt(e.target.value, 10) || 1);
    const newBedrooms = Array.from({ length: count }, (_, i) => bedrooms[i] || ({ bedType: bedTypes[0], bedCount: 1 }));
    handleInputChange('bedrooms', newBedrooms);
  };

  const handleBedroomChange = (index, field, value) => {
    const newBedrooms = [...bedrooms];
    newBedrooms[index] = { ...newBedrooms[index], [field]: value };
    handleInputChange('bedrooms', newBedrooms);
  };

  const handleAmenityChange = (category, amenity, isChecked) => {
    if (isChecked) {
      handleInputChange('selectedAmenities', [...selectedAmenities, { category, amenity }]);
    } else {
      handleInputChange('selectedAmenities', selectedAmenities.filter(a => !(a.category === category && a.amenity === amenity)));
    }
  };

  const removeAmenity = (amenityToRemove) => {
    handleInputChange('selectedAmenities', selectedAmenities.filter(a => a.amenity !== amenityToRemove.amenity));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      url: URL.createObjectURL(file),
      category: imageCategories[0],
      file: file
    }));
    handleInputChange('images', [...images, ...newImages]);
  };

  const handleImageCategoryChange = (index, category) => {
    const newImages = [...images];
    newImages[index].category = category;
    handleInputChange('images', newImages);
  };

  const selectedAmenitiesSet = useMemo(() => new Set(selectedAmenities.map(a => a.amenity)), [selectedAmenities]);

  const groupedAmenities = useMemo(() => {
    return selectedAmenities.reduce((acc, { category, amenity }) => {
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(amenity);
      return acc;
    }, {});
  }, [selectedAmenities]);

  const handleSave = () => {
    // Basic validation
    if (!roomName.trim()) return alert('Vui lòng nhập tên phòng.');
    onSave(roomData);
  };
  return (
    <div className="p-8 font-sans text-gray-800 bg-white">
      <h1 className="text-3xl font-bold mb-8 text-cyan-800">Dữ liệu phòng</h1>

      {/* Phần Thông tin phòng */}
      <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-cyan-700">Thông tin phòng</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="roomType" className="mb-2 font-semibold">Loại phòng</label>
            <select id="roomType" value={roomType} onChange={e => handleInputChange('roomType', e.target.value)} className="w-full p-3 border border-gray-300 rounded text-base">
              {roomTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="roomName" className="mb-2 font-semibold">Tên phòng</label>
            <input type="text" id="roomName" value={roomName} onChange={e => handleInputChange('roomName', e.target.value)} className="w-full p-3 border border-gray-300 rounded text-base mt-2" />
          </div>
        </div>
      </div>

      {/* Phần Chi tiết phòng */}
      <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-cyan-700">Chi tiết phòng</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="mb-2 font-semibold">Kích cỡ phòng/ đơn vị</label>
            <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                    <label htmlFor="roomSize" className="text-sm text-gray-600">Kích thước</label>
                    <input type="number" id="roomSize" value={roomSize} onChange={e => handleInputChange('roomSize', e.target.value)} className="w-full p-3 border border-gray-300 rounded text-base" />
                </div>
                <div>
                    <label htmlFor="sizeUnit" className="text-sm text-gray-600">Đơn vị</label>
                    <select id="sizeUnit" value={sizeUnit} onChange={e => handleInputChange('sizeUnit', e.target.value)} className="w-full p-3 border border-gray-300 rounded text-base">
                        {sizeUnits.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                    </select>
                </div>
            </div>
          </div>
          <div>
            <label className="mb-2 font-semibold">Hút thuốc</label>
            <div className="flex gap-4 pt-2 mt-2">
              <label className="flex items-center"><input type="radio" name="smoking" value="no" checked={smoking === 'no'} onChange={e => handleInputChange('smoking', e.target.value)} className="mr-2" /> Cấm hút thuốc</label>
              <label className="flex items-center"><input type="radio" name="smoking" value="yes" checked={smoking === 'yes'} onChange={e => handleInputChange('smoking', e.target.value)} className="mr-2" /> Cho phép</label>
            </div>
          </div>
        </div>
      </div>

      {/* Phần Giường ngủ */}
      <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-cyan-700">Giường ngủ</h2>
        <div>
          <p className="font-semibold">Số lượng phòng ngủ</p>
          <div className="flex gap-4 mb-4">
            <label className="flex items-center">
              <input type="radio" name="bedroomOption" value="single" checked={bedroomOption === 'single'} onChange={() => handleInputChange('bedroomOption', 'single')} className="mr-2" />
              Phòng ngủ đơn
            </label>
            <label className="flex items-center">
              <input type="radio" name="bedroomOption" value="multiple" checked={bedroomOption === 'multiple'} onChange={() => handleInputChange('bedroomOption', 'multiple')} className="mr-2" />
              Nhiều phòng ngủ
            </label>
          </div>

          {bedroomOption === 'single' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4">
              <div>
                <label htmlFor="bedType" className="mb-2 font-semibold">Loại Giường</label>
                <select id="bedType" value={bedrooms[0]?.bedType || bedTypes[0]} onChange={e => handleBedroomChange(0, 'bedType', e.target.value)} className="w-full p-3 border border-gray-300 rounded text-base mt-2">
                  {bedTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="bedCount" className="mb-2 font-semibold">Số lượng giường</label>
                <input type="number" id="bedCount" value={bedrooms[0]?.bedCount || 1} onChange={e => handleBedroomChange(0, 'bedCount', parseInt(e.target.value, 10) || 1)} className="w-full p-3 border border-gray-300 rounded text-base mt-2" />
              </div>
            </div>
          )}

          {bedroomOption === 'multiple' && (
            <div className="border-t pt-4">
              <div className="flex flex-col mb-4 w-full md:w-1/3">
                <label htmlFor="multiRoomCount" className="font-semibold">Số lượng phòng</label>
                <input type="number" id="multiRoomCount" value={bedrooms.length} onChange={handleMultiRoomCountChange} className="w-full p-3 border border-gray-300 rounded text-base mt-2" />
              </div>
              {bedrooms.map((bedroom, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4 mt-4">
                  <p className="md:col-span-2 font-bold">Phòng ngủ {index + 1}</p>
                  <div>
                    <label htmlFor={`bedType-${index}`} className="mb-2 font-semibold">Loại Giường</label>
                    <select id={`bedType-${index}`} value={bedroom.bedType} onChange={(e) => handleBedroomChange(index, 'bedType', e.target.value)} className="w-full p-3 border border-gray-300 rounded text-base mt-2">
                      {bedTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor={`bedCount-${index}`} className="mb-2 font-semibold">Số lượng giường</label>
                    <input type="number" id={`bedCount-${index}`} value={bedroom.bedCount} onChange={(e) => handleBedroomChange(index, 'bedCount', parseInt(e.target.value, 10))} className="w-full p-3 border border-gray-300 rounded text-base mt-2" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Phần Công suất phòng */}
      <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-cyan-700">Công suất phòng</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
          <div>
            <label htmlFor="adultCapacity" className="mb-2 font-semibold">Sức chứa người lớn tối đa</label>
            <input type="number" id="adultCapacity" value={adultCapacity} onChange={e => handleInputChange('adultCapacity', parseInt(e.target.value, 10) || 1)} min="1" className="w-full p-3 border border-gray-300 rounded text-base mt-2" />
          </div>
          <div />
          <div>
            <label className="mb-2 font-semibold">Sức chứa trẻ em</label>
            <p className="text-sm text-gray-600">Nếu cho phép, sức chứa trẻ em tối đa sẽ được đặt thành một.</p>
            <div className="flex gap-4 pt-2 mt-2">
              <label className="flex items-center">
                <input type="radio" name="childrenPolicy" value="yes" checked={allowChildren === 'yes'} onChange={(e) => handleInputChange('allowChildren', e.target.value)} className="mr-2" /> Cho phép
              </label>
              <label className="flex items-center">
                <input type="radio" name="childrenPolicy" value="no" checked={allowChildren === 'no'} onChange={(e) => handleInputChange('allowChildren', e.target.value)} className="mr-2" /> Không cho phép
              </label>
            </div>
          </div>
          <div>
            <label className="mb-2 font-semibold">Giường phụ</label>
            <p className="text-sm text-gray-600">Nếu cho phép, giường phụ tối đa sẽ được đặt thành một.</p>
            <div className="flex gap-4 pt-2 mt-2">
              <label className="flex items-center">
                <input type="radio" name="extraBedPolicy" value="yes" checked={allowExtraBed === 'yes'} onChange={(e) => handleInputChange('allowExtraBed', e.target.value)} className="mr-2" /> Cho phép
              </label>
              <label className="flex items-center">
                <input type="radio" name="extraBedPolicy" value="no" checked={allowExtraBed === 'no'} onChange={(e) => handleInputChange('allowExtraBed', e.target.value)} className="mr-2" /> Không cho phép
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Phần Mức bảo hộ */}
      <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-2 text-cyan-700">Mức bảo hộ</h2>
        <p className="text-sm text-gray-600 mb-4">Đặt mức giá tối thiểu cho phòng này. Thao tác này đảm bảo rằng phòng của bạn sẽ không được bán với mức giá thấp hơn mức giá này sau khi đã áp dụng giảm giá và khuyến mãi.</p>
        <div className="relative w-full md:w-1/3">
          <input type="number" id="minPrice" value={minPrice} onChange={e => handleInputChange('minPrice', e.target.value)} className="w-full p-3 border border-gray-300 rounded text-base pl-4" placeholder="Nhập giá" />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">VNĐ</span>
        </div>
      </div>

      {/* Phần Ảnh */}
      <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-cyan-700">Ảnh</h2>
        <input type="file" multiple accept="image/*" onChange={handleImageUpload} ref={fileInputRef} className="hidden" />
        <button onClick={() => fileInputRef.current.click()} className="mb-6 py-2 px-4 bg-blue-500 text-white rounded-lg font-semibold cursor-pointer transition-colors hover:bg-blue-600">
          Thêm hình ảnh
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <img src={image.url} alt={`Upload preview ${index}`} className="w-full h-40 object-cover" />
              <div className="p-2">
                <select id={`category-${index}`} value={image.category} onChange={(e) => handleImageCategoryChange(index, e.target.value)} className="w-full p-2 border border-gray-300 rounded text-base">
                  {imageCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phần Tiện nghi phòng */}
      <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-2 text-cyan-700">Tiện nghi phòng</h2>
        <p className="text-sm text-gray-600 mb-4">Vui lòng chọn ít nhất 1 tiện nghi</p>

        <div className="min-h-[100px] bg-white border border-dashed border-gray-400 rounded-lg p-4 mb-6 flex flex-col gap-4">
          {selectedAmenities.length === 0 ? (
            <p className="text-gray-500">Các tiện nghi đã chọn sẽ hiện ở đây</p>
          ) : (
            Object.entries(groupedAmenities).map(([category, amenities]) => (
              <div key={category}>
                <h4 className="font-semibold text-gray-700 mb-2">{category}</h4>
                <div className="flex flex-wrap gap-2">
                  {amenities.map(amenity => (
                     <div key={amenity} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1.5 rounded-full flex items-center">
                       <span>{amenity}</span>
                       <button onClick={() => removeAmenity({ category, amenity })} className="ml-2 font-bold text-blue-600 hover:text-blue-800">x</button>
                     </div>
                  ))}
                </div>
              </div>    
            ))
          )}
        </div>

        {Object.entries(allAmenities).map(([category, amenities]) => (
          <div key={category} className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">{category}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {amenities.map(amenity => (
                <label key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedAmenitiesSet.has(amenity)}
                    onChange={(e) => handleAmenityChange(category, amenity, e.target.checked)}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button onClick={handleSave} className="w-full md:w-auto py-3 px-8 bg-blue-600 text-white rounded-lg font-bold text-base cursor-pointer transition-colors hover:bg-blue-700">
          Lưu thông tin phòng
        </button>
        <button onClick={onCancel} className="w-full md:w-auto py-3 px-8 bg-gray-300 text-gray-800 rounded-lg font-bold text-base cursor-pointer transition-colors hover:bg-gray-400">
          Hủy
        </button>
      </div>
    </div>
  );
};

export default AddRoom;