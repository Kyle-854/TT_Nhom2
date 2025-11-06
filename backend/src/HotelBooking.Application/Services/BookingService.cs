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

        public async Task<BookingDetailDto> CreateBookingAsync( CreateBookingRequestDto request, long customerUserId)
        {
            if (request.Rooms == null || !request.Rooms.Any())
            {
                throw new ArgumentException("Booking request must contain at least one room.");
            }

            DataTable bookingRoomsTable = CreateBookingRoomTypeTVP(request.Rooms);

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
                    throw new Exception("Failed to create booking, SP returned invalid ID.");
                }
            }
            catch (Exception ex)
            {
                throw new ValidationException($"Booking failed: {ex.Message}");
            }

            BookingDetailDto? createdBookingDetails = await GetBookingDetailsAsync(newBookingId, customerUserId);

            if (createdBookingDetails == null)
            {
                throw new KeyNotFoundException($"Successfully created booking (ID: {newBookingId}) but failed to retrieve its details.");
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
                return null;
            }

            return _mapper.Map<BookingDetailDto>(booking);
        }


        private DataTable CreateBookingRoomTypeTVP(List<BookingRoomRequestDto> rooms)
        {
            DataTable table = new DataTable();
            table.Columns.Add("RoomTypeId", typeof(int));
            table.Columns.Add("CheckInDate", typeof(DateTime));
            table.Columns.Add("CheckOutDate", typeof(DateTime));
            table.Columns.Add("Quantity", typeof(int));

            foreach (BookingRoomRequestDto room in rooms)
            {
                if (room.CheckOutDate <= room.CheckInDate || room.Quantity <= 0)
                {
                    throw new ArgumentException($"Invalid data for RoomTypeId {room.RoomTypeId}: CheckOut must be after CheckIn and Quantity > 0.");
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
