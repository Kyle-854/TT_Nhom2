using AutoMapper;
using HotelBooking.Application.DataTransferObjects.Booking;
using HotelBooking.Application.Interfaces.UnitOfWork;
using HotelBooking.Domain.Entities;
using System.ComponentModel.DataAnnotations;
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
            Hotel? existHotel = await _unitOfWork.HotelRepo.GetByIdAsync(request.HotelId);

            if (existHotel == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy khách sạn có ID {request.HotelId}.");
            }

            if (request.Rooms == null || !request.Rooms.Any())
            {
                throw new InvalidOperationException("Yêu cầu đặt phòng phải có ít nhất một phòng.");
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
                    commissionPct
                );

                if (newBookingId <= 0)
                {
                    throw new InvalidOperationException("Không tạo được đặt chỗ, SP trả về ID không hợp lệ.");
                }
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Đã xảy ra lỗi khi tạo đặt chỗ.", ex);
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

                if (existRoomType == null)
                {
                    throw new InvalidOperationException($"Không tìm thấy loại phòng có ID {room.RoomTypeId}");
                }    

                if (room.CheckOutDate <= room.CheckInDate || room.Quantity <= 0)
                {
                    throw new InvalidOperationException($"Dữ liệu không hợp lệ cho RoomTypeId {room.RoomTypeId}: Ngày CheckOut phải nhỏ hơn CheckIn và Quantity phải > 0.");
                }

                table.Rows.Add(
                    room.RoomTypeId,
                    room.CheckInDate.ToDateTime(TimeOnly.MinValue),
                    room.CheckOutDate.ToDateTime(TimeOnly.MinValue),
                    room.Quantity);
            }

            return table;
        }
    }
}
