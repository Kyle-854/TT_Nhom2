using AutoMapper;
using HotelBooking.Application.DataTransferObjects.Amenity;
using HotelBooking.Application.Interfaces.UnitOfWork;
using HotelBooking.Domain.Entities;

namespace HotelBooking.Application.Services
{
    public class AmenityService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AmenityService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<AmenityDto>> GetAllAmenitiesAsync()
        {
            IEnumerable<Amenity>? amenities = await _unitOfWork.AmenitieRepo.GetAllAsync();
            return _mapper.Map<IEnumerable<AmenityDto>>(amenities);
        }

        public async Task<AmenityDto> CreateAmenityAsync(CreateAmenityDto dto)
        {
            bool isExists = await _unitOfWork.AmenitieRepo.IsNameExistsAsync(dto.Name);
            if (isExists)
            {
                throw new InvalidOperationException($"Tiện nghi '{dto.Name}' đã tồn tại trong hệ thống.");
            }

            Amenity? amenity = _mapper.Map<Amenity>(dto);

            await _unitOfWork.AmenitieRepo.AddAsync(amenity);
            await _unitOfWork.CompleteAsync();

            return _mapper.Map<AmenityDto>(amenity);
        }

        public async Task UpdateAmenityAsync(int id, UpdateAmenityDto dto)
        {
            Amenity? existingAmenity = await _unitOfWork.AmenitieRepo.GetByIdAsync(id);
            if (existingAmenity == null)
            {
                throw new KeyNotFoundException("Không tìm thấy tiện nghi.");
            }

            bool isDuplicate = await _unitOfWork.AmenitieRepo.IsNameExistsForUpdateAsync(id, dto.Name);
            if (isDuplicate)
            {
                throw new InvalidOperationException($"Tên tiện nghi '{dto.Name}' đã được sử dụng.");
            }

            _mapper.Map(dto, existingAmenity);
            _unitOfWork.AmenitieRepo.Update(existingAmenity);
            await _unitOfWork.CompleteAsync();
        }

        public async Task DeleteAmenityAsync(int id)
        {
            Amenity? existingAmenity = await _unitOfWork.AmenitieRepo.GetByIdAsync(id);
            if (existingAmenity == null)
            {
                throw new KeyNotFoundException("Không tìm thấy tiện nghi.");
            }

            bool isInUse = await _unitOfWork.AmenitieRepo.IsAmenityInUseAsync(id);
            if (isInUse)
            {
                throw new InvalidOperationException("Không thể xóa tiện nghi này vì đang được sử dụng cho Khách sạn hoặc Loại phòng.");
            }

            _unitOfWork.AmenitieRepo.Delete(existingAmenity);
            await _unitOfWork.CompleteAsync();
        }
    }
}
