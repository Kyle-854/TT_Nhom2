using AutoMapper;
using HotelBooking.Application.DataTransferObjects.Amenity;
using HotelBooking.Application.DataTransferObjects.Media;
using HotelBooking.Application.DataTransferObjects.RoomType;
using HotelBooking.Application.Interfaces.Storage;
using HotelBooking.Application.Interfaces.UnitOfWork;
using HotelBooking.Domain.Entities;

namespace HotelBooking.Application.Services
{
    public class PartnerRoomTypeService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IStorageService _storageService;

        public PartnerRoomTypeService(IUnitOfWork unitOfWork, IMapper mapper, IStorageService storageService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _storageService = storageService;
        }

        public async Task<List<RoomTypeDto>> GetRoomTypesAsync(long hotelId)
        {
            Hotel? hotelExists = await _unitOfWork.HotelRepo.GetByIdAsync(hotelId);
            if (hotelExists == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy khách sạn với ID {hotelId}.");
            }

            IEnumerable<RoomType>? roomTypes = await _unitOfWork.RoomTypeRepo.GetAllRoomTypesByHotelAsync(hotelId);
            return _mapper.Map<List<RoomTypeDto>>(roomTypes);
        }

        public async Task<RoomTypeDto?> GetRoomTypeByIdAsync(int id)
        {
            RoomType? roomType = await _unitOfWork.RoomTypeRepo.GetRoomTypeWithDetailsAsync(id);

            if (roomType == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy loại phòng với ID: {id}");
            }

            return _mapper.Map<RoomTypeDto>(roomType);
        }

        public async Task<List<AmenityDto>> GetAllAmenitiesAsync()
        {
            IEnumerable<Amenity>? amenities = await _unitOfWork.AmenitieRepo.GetAllAsync();

            return _mapper.Map<List<AmenityDto>>(amenities);
        }

        public async Task<RoomTypeDto> CreateRoomTypeAsync(long hotelId, long ownerUserId, CreateRoomTypeRequestDto request)
        {
            Hotel? hotel = await _unitOfWork.HotelRepo.GetByIdAsync(hotelId);
            if (hotel == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy khách sạn với ID {hotelId}.");
            }

            if (hotel.IsActive == false)
            {
                throw new InvalidOperationException("Khách sạn này đang bị khóa, không thể tạo thêm loại phòng.");
            }

            if (hotel.OwnerUserId != ownerUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền thực hiện thao tác trên khách sạn này.");
            }

            RoomType? roomType = _mapper.Map<RoomType>(request);
            roomType.HotelId = hotelId;
            roomType.CreatedAt = DateTime.UtcNow;
            roomType.IsActive = true;

            if (request.AmenityIds != null && request.AmenityIds.Any())
            {
                roomType.RoomTypeAmenities = request.AmenityIds
                .Select(amenityId => new RoomTypeAmenity
                {
                    AmenityId = amenityId
                })
                .ToList();
            }

            await _unitOfWork.RoomTypeRepo.AddAsync(roomType);
            await _unitOfWork.CompleteAsync();

            return await GetRoomTypeByIdAsync(roomType.RoomTypeId);
        }

        public async Task<RoomTypeDto?> UpdateRoomTypeAsync(int id, long ownerUserId, UpdateRoomTypeRequestDto request)
        {
            RoomType? roomType = await _unitOfWork.RoomTypeRepo.GetRoomTypeWithDetailsAsync(id);

            if (roomType == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy loại phòng cần cập nhật (ID: {id}).");
            }

            long hotelId = roomType.HotelId;
            Hotel? hotel = await _unitOfWork.HotelRepo.GetByIdAsync(hotelId);
            if (hotel == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy khách sạn với ID {hotelId}.");
            }

            if (hotel.IsActive == false)
            {
                throw new InvalidOperationException("Khách sạn này đang bị khóa, không thể cập nhật loại.");
            }

            if (hotel.OwnerUserId != ownerUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền thực hiện thao tác trên khách sạn này.");
            }

            if (request.DefaultPrice < 0)
            {
                throw new InvalidOperationException("Giá phòng không được phép là số âm.");
            }

            _mapper.Map(request, roomType);

            if (request.AmenityIds != null)
            {
                roomType.RoomTypeAmenities.Clear();
                foreach (int amenityId in request.AmenityIds)
                {
                    roomType.RoomTypeAmenities.Add(new RoomTypeAmenity
                    {
                        RoomTypeId = id,
                        AmenityId = amenityId
                    });
                }
            }

            _unitOfWork.RoomTypeRepo.Update(roomType);
            await _unitOfWork.CompleteAsync();

            return _mapper.Map<RoomTypeDto>(roomType);
        }

        public async Task<bool> DeleteRoomTypeAsync(int id, long ownerUserId)
        {
            RoomType? roomType = await _unitOfWork.RoomTypeRepo.GetByIdAsync(id);
            if (roomType == null)
            {
                throw new KeyNotFoundException($"Không thể xóa vì không tìm thấy loại phòng (ID: {id}).");
            }

            long hotelId = roomType.HotelId;
            Hotel? hotel = await _unitOfWork.HotelRepo.GetByIdAsync(hotelId);
            if (hotel == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy khách sạn với ID {hotelId}.");
            }

            if (hotel.IsActive == false)
            {
                throw new InvalidOperationException("Khách sạn này đang bị khóa, không thể xóa loại phòng.");
            }

            if (hotel.OwnerUserId != ownerUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền thực hiện thao tác trên khách sạn này.");
            }

            roomType.IsActive = false;

            _unitOfWork.RoomTypeRepo.Update(roomType);
            await _unitOfWork.CompleteAsync();

            return true;
        }

        public async Task<RoomTypeMediaDto> UploadRoomImageAsync(int roomTypeId, long ownerUserId, RoomImageUploadDto dto)
        {
            RoomType? roomType = await _unitOfWork.RoomTypeRepo.GetByIdAsync(roomTypeId);

            if (roomType == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy loại phòng với ID: {roomTypeId}");
            }

            Hotel? hotel = await _unitOfWork.HotelRepo.GetByIdAsync(roomType.HotelId);

            if (hotel == null || hotel.OwnerUserId != ownerUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền tải ảnh lên cho loại phòng này.");
            }

            if (dto.FileContent == null || dto.FileContent.Length == 0)
            {
                throw new InvalidOperationException("File hình ảnh không hợp lệ hoặc bị rỗng.");
            }

            string uploadedUrl;
            try
            {
                uploadedUrl = await _storageService.UploadFileAsync(
                    dto.FileContent,
                    dto.FileName,
                    dto.ContentType
                );
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Có lỗi xảy ra trong quá trình lưu trữ hình ảnh. Vui lòng thử lại.");
            }

            Media media = new Media
            {
                RoomTypeId = roomTypeId,
                HotelId = roomType.HotelId,
                Url = uploadedUrl,
                Caption = dto.Caption,
                IsMain = dto.IsMain,
                CreatedAt = DateTime.UtcNow
            };

            if (dto.IsMain)
            {
                IEnumerable<Media> existingImages = await _unitOfWork.MediaRepo.GetByRoomTypeIdAsync(roomTypeId);

                foreach (Media img in existingImages)
                {
                    if (img.IsMain)
                    {
                        img.IsMain = false;
                        _unitOfWork.Medias.Update(img);
                    }
                }
            }

            await _unitOfWork.Medias.AddAsync(media);
            await _unitOfWork.CompleteAsync();

            return _mapper.Map<RoomTypeMediaDto>(media);
        }
    }
}
