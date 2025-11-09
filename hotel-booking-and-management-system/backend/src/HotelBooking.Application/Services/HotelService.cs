using AutoMapper;
using HotelBooking.Application.DataTransferObjects.Hotel;
using HotelBooking.Application.DataTransferObjects.RoomType;
using HotelBooking.Application.Interfaces.UnitOfWork;
using HotelBooking.Domain.Entities;

namespace HotelBooking.Application.Services
{
    public class HotelService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public HotelService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<HotelSummaryDto>> GetActiveHotelsAsync()
        {
            IEnumerable<Hotel>? hotels = await _unitOfWork.HotelRepo.GetActiveHotelsSummaryAsync();

            return _mapper.Map<IEnumerable<HotelSummaryDto>>(hotels);
        }

        public async Task<HotelDetailDto?> GetHotelDetailByIdAsync(long hotelId)
        {
            Hotel? hotel = await _unitOfWork.HotelRepo.GetActiveHotelWithDetailsAsync(hotelId);

            if (hotel == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy khách sạn đang hoạt động với ID: {hotelId}");
            }

            return _mapper.Map<HotelDetailDto>(hotel);
        }

        public async Task<IEnumerable<RoomTypeDto>> GetRoomTypesForHotelAsync(long hotelId)
        {
            IEnumerable<RoomType>? roomTypes = await _unitOfWork.RoomTypeRepo.GetActiveRoomTypesByHotelAsync(hotelId);

            return _mapper.Map<IEnumerable<RoomTypeDto>>(roomTypes);
        }
    }
}
