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

            if (!string.IsNullOrWhiteSpace(request.PromotionCode))
            {
                DateTimeOffset now = DateTimeOffset.Now;

                Promotion? validPromo = await _unitOfWork.BookingRepo.GetPromotionByCodeAsync(request.HotelId, request.PromotionCode, now);
                if (validPromo == null)
                {
                    throw new InvalidOperationException("Mã khuyến mãi không hợp lệ hoặc đã hết hạn.");
                }
            }

            foreach (BookingRoomRequestDto room in request.Rooms)
            {
                if (room.Quantity <= 0)
                {
                    throw new InvalidOperationException($"Số lượng phòng phải lớn hơn 0.");
                }

                if (room.CheckOutDate <= room.CheckInDate)
                {
                    throw new InvalidOperationException($"Ngày trả phòng phải sau ngày nhận phòng.");
                }

                (RoomType? RoomInfo, List<RoomInventory> Inventories) data = await _unitOfWork.BookingRepo.GetRoomAvailabilityDataAsync(room.RoomTypeId, room.CheckInDate, room.CheckOutDate);

                if (data.RoomInfo == null)
                {
                    throw new KeyNotFoundException($"Loại phòng với ID {room.RoomTypeId} không tồn tại.");
                }

                if (data.RoomInfo.HotelId != request.HotelId)
                {
                    throw new InvalidOperationException($"Loại phòng {room.RoomTypeId} không thuộc về khách sạn {request.HotelId}.");
                }

                DateOnly currentDate = room.CheckInDate;
                int totalRooms = data.RoomInfo.TotalRooms;

                while (currentDate < room.CheckOutDate)
                {
                    RoomInventory? inventoryRecord = data.Inventories.FirstOrDefault(ri => ri.Date == currentDate);

                    int availableRooms;

                    if (inventoryRecord != null)
                    {
                        availableRooms = inventoryRecord.AvailableRooms;
                    }
                    else
                    {
                        availableRooms = totalRooms;
                    }

                    if (availableRooms < room.Quantity)
                    {
                        throw new InvalidOperationException($"Loại phòng {room.RoomTypeId} không đủ số lượng vào ngày {currentDate:dd/MM/yyyy} (Còn lại: {availableRooms}, Yêu cầu: {room.Quantity}).");
                    }

                    currentDate = currentDate.AddDays(1);
                }
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
