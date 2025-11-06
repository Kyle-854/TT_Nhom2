using AutoMapper;
using HotelBooking.Application.DataTransferObjects.Booking;
using HotelBooking.Domain.Entities;

namespace HotelBooking.Application.Mappings
{
    public class BookingProfile : Profile
    {
        public BookingProfile()
        {
            CreateMap<Booking, BookingHistoryDto>()
                .ForMember(dest => dest.HotelName,
                    opt => opt.MapFrom(src => src.Hotel != null ? src.Hotel.Name : "N/A"))

                .ForMember(dest => dest.HotelMainImageUrl,
                    opt => opt.MapFrom(src =>
                        src.Hotel != null && src.Hotel.Medias.Any()
                        ? src.Hotel.Medias.FirstOrDefault(m => m.IsMain).Url
                        : null))

                .ForMember(dest => dest.StatusName,
                    opt => opt.MapFrom(src => src.Status != null ? src.Status.StatusName : "Unknown"))

                .ForMember(dest => dest.OverallCheckInDate,
                    opt => opt.MapFrom(src =>
                        src.BookingRooms.Any()
                        ? src.BookingRooms.Min(r => r.CheckInDate)
                        : default(DateOnly)))

                .ForMember(dest => dest.OverallCheckOutDate,
                    opt => opt.MapFrom(src =>
                        src.BookingRooms.Any()
                        ? src.BookingRooms.Max(r => r.CheckOutDate)
                        : default(DateOnly)));


            CreateMap<Booking, BookingDetailDto>()
                .ForMember(dest => dest.StatusName,
                    opt => opt.MapFrom(src => src.Status != null ? src.Status.StatusName : "Unknown"))
                .ForMember(dest => dest.HotelInfo, opt => opt.MapFrom(src => src.Hotel));


            CreateMap<Hotel, BookingHotelInfoDto>();


            CreateMap<BookingRoom, BookingRoomDetailDto>()
                .ForMember(dest => dest.RoomTypeName,
                    opt => opt.MapFrom(src => src.RoomType != null ? src.RoomType.Name : "N/A"));


            CreateMap<PaymentTransaction, BookingPaymentTransactionDto>()
                .ForMember(dest => dest.StatusName,
                    opt => opt.MapFrom(src => src.Status != null ? src.Status.StatusName : "Unknown"));
        }
    }
}
