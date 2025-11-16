import React, { useState, useEffect } from 'react';

const loaiCoSoLuuTru = [
  "Khách sạn",
  "Căn hộ",
  "Resort",
  "Biệt thự",
  "Nhà nghỉ",
];

const danhSachQuocGia = [
  { name: "Việt Nam", code: "+84" },
  { name: "Hoa Kỳ", code: "+1" },
  { name: "Nhật Bản", code: "+81" },
  { name: "Hàn Quốc", code: "+82" },
];

const ThongTinKhachSan = () => {
  const [selectedCountry, setSelectedCountry] = useState(danhSachQuocGia[0]);
  const [countryCode, setCountryCode] = useState(danhSachQuocGia[0].code);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (selectedCountry) {
      setCountryCode(selectedCountry.code);
    }
  }, [selectedCountry]);

  const handleCountryChange = (e) => {
    const countryName = e.target.value;
    const country = danhSachQuocGia.find(c => c.name === countryName);
    setSelectedCountry(country);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      url: URL.createObjectURL(file),
      file: file,
      description: ''
    }));
    setImages(prevImages => [...prevImages, ...newImages]);
  };

  const handleImageDelete = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleImageDescriptionChange = (index, description) => {
    const newImages = [...images];
    newImages[index].description = description;
    setImages(newImages);
  };

  return (
    <>
      <div className="p-8 font-sans text-gray-800">
        {/* Phần Thông tin về cơ sở lưu trú */}
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-cyan-800">Thông tin về cơ sở lưu trú</h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="flex flex-col">
              <label htmlFor="tenCoSo" className="mb-2 font-semibold">Tên cơ sở lưu trú</label>
              <input type="text" id="tenCoSo" className="w-full p-3 border border-gray-300 rounded text-base" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="tenDiaPhuong" className="mb-2 font-semibold">Tên cơ sở lưu trú bằng Ngôn ngữ địa phương</label>
              <p className="text-sm text-gray-600 mt-1">Hãy điền vào trường này nếu bạn có tên cơ sở lưu trú khác bằng ngôn ngữ địa phương</p>
              <input type="text" id="tenDiaPhuong" className="w-full p-3 border border-gray-300 rounded text-base" />
              <div className="flex items-center mt-2">
                <input type="checkbox" id="khongTenKhac" className="mr-2" />
                <label htmlFor="khongTenKhac">Cơ sở lưu trú này không có tên khác trong ngôn ngữ địa phương</label>
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="loaiCoSo" className="mb-2 font-semibold">Loại cơ sở lưu trú</label>
              <select id="loaiCoSo" className="w-full p-3 border border-gray-300 rounded text-base">
                {loaiCoSoLuuTru.map(loai => <option key={loai} value={loai}>{loai}</option>)}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-semibold">Lễ tân của bạn có mở cửa 24 giờ không?</label>
              <div className="flex gap-4">
                <label className="flex items-center"><input type="radio" name="reception" value="yes" className="mr-2" /> Có</label>
                <label className="flex items-center"><input type="radio" name="reception" value="no" className="mr-2" /> Không</label>
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="checkin-from" className="mb-2 font-semibold">Giờ nhận phòng</label>
              <div className="flex items-center gap-2">
                <span>từ</span>
                <input type="time" id="checkin-from" className="w-full p-3 border border-gray-300 rounded text-base" />
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="checkout-to" className="mb-2 font-semibold">Giờ trả phòng</label>
              <div className="flex items-center gap-2">
                <span>cho đến</span>
                <input type="time" id="checkout-to" className="w-full p-3 border border-gray-300 rounded text-base" />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-semibold">Ảnh cơ sở lưu trú</label>
              <input type="file" id="imageUpload" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
              <label htmlFor="imageUpload" className="w-max py-2 px-4 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600">Thêm hình ảnh</label>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img src={image.url} alt={`Preview ${index}`} className="w-full h-40 object-cover rounded" />
                    <button onClick={() => handleImageDelete(index)} className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm">X</button>
                    <input
                      type="text"
                      placeholder="Mô tả hình ảnh"
                      value={image.description}
                      onChange={(e) => handleImageDescriptionChange(index, e.target.value)}
                      className="w-full p-2 mt-2 border border-gray-300 rounded text-base" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Phần Địa chỉ cơ sở lưu trú */}
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-cyan-800">Địa chỉ cơ sở lưu trú</h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="flex flex-col">
              <label htmlFor="quocGia" className="mb-2 font-semibold">Quốc gia</label>
              <select id="quocGia" value={selectedCountry.name} onChange={handleCountryChange} className="w-full p-3 border border-gray-300 rounded text-base">
                {danhSachQuocGia.map(qg => <option key={qg.name} value={qg.name}>{qg.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="viTri" className="mb-2 font-semibold">Vị trí</label>
              <input type="text" id="viTri" placeholder="Nhập tên khách sạn để tìm trên bản đồ" className="w-full p-3 border border-gray-300 rounded text-base" />
              <div className="w-full h-[300px] bg-gray-200 flex items-center justify-center text-gray-600 rounded mt-4">Google Map sẽ hiển thị ở đây</div>
            </div>
            <div className="flex flex-col"><label htmlFor="diaChi" className="mb-2 font-semibold">Địa chỉ</label><input type="text" id="diaChi" className="w-full p-3 border border-gray-300 rounded text-base" /></div>
            <div className="flex flex-col"><label htmlFor="maBuuChinh" className="mb-2 font-semibold">Mã bưu chính</label><input type="text" id="maBuuChinh" className="w-full p-3 border border-gray-300 rounded text-base" /></div>
          </div>
        </div>

        {/* Phần Thông tin liên hệ */}
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-cyan-800">Thông tin liên hệ với cơ sở lưu trú</h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="flex flex-col">
              <label className="mb-2 font-semibold">Số điện thoại</label>
              <div className="flex gap-4">
                <div className="flex flex-col w-24"><label htmlFor="maQuocGia" className="mb-2 font-semibold">Mã quốc gia</label><input type="text" id="maQuocGia" value={countryCode} readOnly className="w-full p-3 border border-gray-300 rounded text-base bg-gray-100" /></div>
                <div className="flex flex-col flex-1"><label htmlFor="soDienThoai" className="mb-2 font-semibold">Số điện thoại</label><input type="tel" id="soDienThoai" className="w-full p-3 border border-gray-300 rounded text-base" /></div>
              </div>
            </div>
            <div className="flex flex-col"><label htmlFor="email" className="mb-2 font-semibold">Email</label><input type="email" id="email" className="w-full p-3 border border-gray-300 rounded text-base" /></div>
          </div>
        </div>

        <button className="py-3 px-6 bg-blue-600 text-white rounded font-bold text-base cursor-pointer transition-colors hover:bg-blue-700">Lưu thông tin</button>
      </div>
    </>
  );
};

export default ThongTinKhachSan