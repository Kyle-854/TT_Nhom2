using AutoMapper;
using HotelBooking.Application.DataTransferObjects.Booking;
using HotelBooking.Application.Interfaces.UnitOfWork;
using HotelBooking.Domain.Entities;
using System.Data;

namespace HotelBooking.Application.Services
{
    public class BookingService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper; 

        public BookingService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<BookingDetailDto> CreateBookingAsync(CreateBookingRequestDto request, long customerUserId)
        {
            bool isHotelActive = await _unitOfWork.BookingRepo.IsHotelActiveAsync(request.HotelId);
            if (!isHotelActive)
            {
                throw new KeyNotFoundException($"Không tìm thấy khách sạn có ID {request.HotelId}.");
            }

            if (request.Rooms == null || !request.Rooms.Any())
            {
                throw new InvalidOperationException("Yêu cầu đặt phòng phải có ít nhất một phòng.");
            }

            if (!string.IsNullOrEmpty(request.PromotionCode))
            {
                Promotion? validPromo = await _unitOfWork.BookingRepo.GetValidPromotionAsync(request.HotelId, request.PromotionCode);
                if (validPromo == null)
                {
                    throw new InvalidOperationException("Mã khuyến mãi không hợp lệ, đã hết hạn hoặc không áp dụng cho khách sạn này.");
                }
            }

            foreach (BookingRoomRequestDto room in request.Rooms)
            {
                bool isValidDates = _unitOfWork.BookingRepo.ValidateBookingDates(room.CheckInDate, room.CheckOutDate, room.Quantity);
                if (!isValidDates)
                {
                    throw new InvalidOperationException($"Dữ liệu không hợp lệ cho loại phòng {room.RoomTypeId}: Ngày check-out phải sau check-in và số lượng > 0.");
                }

                await _unitOfWork.BookingRepo.CheckRoomAvailabilityAsync(request.HotelId, room.RoomTypeId,room.CheckInDate,room.CheckOutDate,room.Quantity);
            }

            DataTable bookingRoomsTable = await CreateBookingRoomTypeTVP(request.Rooms);

            const string currency = "VND";
            const decimal commissionPct = 10.0m;

            long newBookingId;

            try
            {
                newBookingId = await _unitOfWork.BookingRepo.CreateBookingViaSPAsync(
                    customerUserId,
                    request.HotelId,
                    bookingRoomsTable,
                    currency,
                    commissionPct,
                    request.Note,
                    request.PromotionCode
                );

                if (newBookingId <= 0)
                {
                    throw new InvalidOperationException("Không tạo được đặt chỗ, SP trả về ID không hợp lệ.");
                }
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Đã xảy ra lỗi khi tạo đặt chỗ: {ex.Message}", ex);
            }

            BookingDetailDto? createdBookingDetails = await GetBookingDetailsAsync(newBookingId, customerUserId);

            if (createdBookingDetails == null)
            {
                throw new KeyNotFoundException($"Đã tạo thành công đặt chỗ (ID: {newBookingId}) nhưng không lấy được thông tin chi tiết.");
            }

            return createdBookingDetails;
        }

        public async Task<IEnumerable<BookingHistoryDto>> GetMyBookingsAsync(long customerUserId)
        {
            IEnumerable<Booking>? bookings = await _unitOfWork.BookingRepo.GetBookingsByCustomerIdAsync(customerUserId);

            return _mapper.Map<IEnumerable<BookingHistoryDto>>(bookings);
        }

        public async Task<BookingDetailDto?> GetBookingDetailsAsync(long bookingId, long customerUserId)
        {
            Booking? booking = await _unitOfWork.BookingRepo.GetBookingDetailsAsync(bookingId, customerUserId);

            if (booking == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy đặt chỗ có ID {bookingId} cho UserID {customerUserId}.");
            }

            return _mapper.Map<BookingDetailDto>(booking);
        }


        private async Task<DataTable> CreateBookingRoomTypeTVP(List<BookingRoomRequestDto> rooms)
        {
            DataTable table = new DataTable();
            table.Columns.Add("RoomTypeId", typeof(int));
            table.Columns.Add("CheckInDate", typeof(DateTime));
            table.Columns.Add("CheckOutDate", typeof(DateTime));
            table.Columns.Add("Quantity", typeof(int));

            foreach (BookingRoomRequestDto room in rooms)
            {
                RoomType? existRoomType = await _unitOfWork.RoomTypeRepo.GetByIdAsync(room.RoomTypeId);

                table.Rows.Add
                (
                    room.RoomTypeId,
                    room.CheckInDate.ToDateTime(TimeOnly.MinValue),
                    room.CheckOutDate.ToDateTime(TimeOnly.MinValue),
                    room.Quantity
                );
            }

            return table;
        }
    }
}
