using AutoMapper;
using HotelBooking.Application.DataTransferObjects.Hotel;
using HotelBooking.Application.Interfaces.Storage;
using HotelBooking.Application.Interfaces.UnitOfWork;
using HotelBooking.Application.Utilities;
using HotelBooking.Domain.Entities;

namespace HotelBooking.Application.Services
{
    public class PartnerHotelService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IStorageService _storageService;

        public PartnerHotelService(IUnitOfWork unitOfWork, IMapper mapper, IStorageService storageService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _storageService = storageService;
        }

        public async Task<IEnumerable<PartnerHotelSummaryDto>> GetMyHotelsAsync(long ownerUserId)
        {
            IEnumerable<Hotel>? hotels = await _unitOfWork.HotelRepo.GetHotelsByOwnerIdAsync(ownerUserId);
            return _mapper.Map<IEnumerable<PartnerHotelSummaryDto>>(hotels);
        }

        public async Task<PartnerHotelDetailDto> GetHotelDetailAsync(long hotelId, long ownerUserId)
        {
            Hotel? hotel = await _unitOfWork.HotelRepo.GetHotelWithDetailsAsync(hotelId);

            if (hotel == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy khách sạn với ID: {hotelId}");
            }

            if (hotel.OwnerUserId != ownerUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền truy cập thông tin khách sạn này.");
            }

            return _mapper.Map<PartnerHotelDetailDto>(hotel);
        }

        public async Task<PartnerHotelSummaryDto> CreateHotelAsync(long ownerUserId, CreateHotelDto dto)
        {
            Hotel? hotel = _mapper.Map<Hotel>(dto);

            string baseSlug = SlugGenerator.GenerateSlug(hotel.Name);
            string finalSlug = baseSlug;
            int count = 1;

            while (await _unitOfWork.HotelRepo.ExistsBySlugAsync(finalSlug))
            {
                finalSlug = $"{baseSlug}-{count}";
                count++;
            }

            hotel.Slug = finalSlug;
            hotel.OwnerUserId = ownerUserId;
            hotel.IsActive = false;
            hotel.CreatedAt = DateTime.UtcNow;
            hotel.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.HotelRepo.AddAsync(hotel);
            await _unitOfWork.CompleteAsync();

            return _mapper.Map<PartnerHotelSummaryDto>(hotel);
        }

        public async Task UpdateHotelInfoAsync(long hotelId, long ownerUserId, UpdateHotelInfoDto dto)
        {
            Hotel? hotel = await _unitOfWork.HotelRepo.GetByIdAsync(hotelId);

            if (hotel == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy khách sạn với ID: {hotelId}");
            }

            if (hotel.OwnerUserId != ownerUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền chỉnh sửa khách sạn này.");
            }

            _mapper.Map(dto, hotel);

            hotel.UpdatedAt = DateTime.UtcNow;

            _unitOfWork.HotelRepo.Update(hotel);
            await _unitOfWork.CompleteAsync();
        }

        public async Task<string> UploadHotelImageAsync(long hotelId, long ownerUserId, UploadHotelImageDto dto)
        {
            var hotel = await _unitOfWork.HotelRepo.GetByIdAsync(hotelId);
            if (hotel == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy khách sạn với ID: {hotelId}");
            }

            if (hotel.OwnerUserId != ownerUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền tải ảnh lên cho khách sạn này.");
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
                //throw new InvalidOperationException("Có lỗi xảy ra trong quá trình lưu trữ hình ảnh. Vui lòng thử lại.");
                throw new InvalidOperationException($"Google Drive Error: {ex.Message}");
            }

            Media media = new Media
            {
                HotelId = hotelId,
                Url = uploadedUrl,
                Caption = dto.Caption,
                IsMain = dto.IsMain,
                CreatedAt = DateTime.UtcNow
            };

            if (dto.IsMain)
            {
                IEnumerable<Media>? existingImages = await _unitOfWork.MediaRepo.GetByHotelIdAsync(hotelId);
                foreach (Media img in existingImages)
                {
                    img.IsMain = false;
                    _unitOfWork.Medias.Update(img);
                }
            }

            await _unitOfWork.Medias.AddAsync(media);
            await _unitOfWork.CompleteAsync();

            return uploadedUrl;
        }

        public async Task UpdateHotelAmenitiesAsync(long hotelId, long ownerUserId, UpdateHotelAmenitiesDto dto)
        {
            Hotel? hotel = await _unitOfWork.HotelRepo.GetByIdAsync(hotelId);
            if (hotel == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy khách sạn với ID: {hotelId}");
            }

            if (hotel.OwnerUserId != ownerUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền thay đổi tiện nghi của khách sạn này.");
            }

            if (dto.AmenityIds != null && dto.AmenityIds.Any())
            {
                bool isValid = await _unitOfWork.AmenitieRepo.AreAllAmenitiesValidAsync(dto.AmenityIds);
                if (!isValid)
                {
                    throw new InvalidOperationException("Danh sách tiện nghi chứa ID không tồn tại trong hệ thống.");
                }
            }

            IEnumerable<HotelAmenity>? currentAmenities = await _unitOfWork.HotelAmenityRepo.GetByHotelIdAsync(hotelId);

            if (currentAmenities.Any())
            {
                _unitOfWork.HotelAmenityRepo.RemoveRange(currentAmenities);
            }

            if (dto.AmenityIds != null && dto.AmenityIds.Any())
            {
                IEnumerable<int> distinctIds = dto.AmenityIds.Distinct();

                foreach (int amenityId in distinctIds)
                {
                    HotelAmenity hotelAmenity = new HotelAmenity
                    {
                        HotelId = hotelId,
                        AmenityId = amenityId,
                        AddedAt = DateTime.UtcNow
                    };
                    await _unitOfWork.HotelAmenityRepo.AddAsync(hotelAmenity);
                }
            }

            await _unitOfWork.CompleteAsync();
        }
    }
}
