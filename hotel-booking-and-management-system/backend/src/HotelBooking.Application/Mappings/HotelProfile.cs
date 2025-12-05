using AutoMapper;
using HotelBooking.Application.DataTransferObjects.Amenity;
using HotelBooking.Application.DataTransferObjects.Hotel;
using HotelBooking.Application.DataTransferObjects.Media;
using HotelBooking.Application.DataTransferObjects.RoomType;
using HotelBooking.Domain.Entities;

namespace HotelBooking.Application.Mappings
{
    public class HotelProfile : Profile
    {
        public HotelProfile()
        {
            CreateMap<Media, MediaDto>()
                .ForMember(dest => dest.AltText,
                           opt => opt.MapFrom(src => src.Caption));

            CreateMap<Amenity, AmenityDto>();

            CreateMap<RoomType, RoomTypeSummaryDto>()
                .ForMember(dest => dest.Capacity,
                           opt => opt.MapFrom(src => src.MaxAdults))
                .ForMember(dest => dest.PricePerNight,
                           opt => opt.MapFrom(src => src.DefaultPrice));

            CreateMap<RoomType, RoomTypeDto>()
                .ForMember(dest => dest.Capacity,
                           opt => opt.MapFrom(src => src.MaxAdults))
                .ForMember(dest => dest.PricePerNight,
                           opt => opt.MapFrom(src => src.DefaultPrice))
                .ForMember(dest => dest.Images,
                           opt => opt.MapFrom(src => src.Media.OrderBy(m => m.SortOrder)))
                .ForMember(dest => dest.Amenities,
                           opt => opt.MapFrom(src => src.RoomTypeAmenities.Select(ra => ra.Amenity)));


            CreateMap<Hotel, HotelSummaryDto>()
                .ForMember(dest => dest.CoverImageUrl,
                           opt => opt.MapFrom(src => src.Medias.FirstOrDefault(m => m.IsMain).Url))
                .ForMember(dest => dest.AverageUserRating,
                           opt => opt.MapFrom(src => src.Reviews.Any(r => r.IsPublished == true)
                                                        ? src.Reviews.Where(r => r.IsPublished == true).Average(r => r.Rating)
                                                        : (double?)null))
                .ForMember(dest => dest.StartingPrice,
                           opt => opt.MapFrom(src => src.RoomTypes.Any(rt => rt.IsActive == true)
                                                       ? src.RoomTypes.Where(rt => rt.IsActive == true).Min(rt => rt.DefaultPrice)
                                                       : (decimal?)null));

            CreateMap<Hotel, HotelDetailDto>()
                .ForMember(dest => dest.AverageUserRating,
                           opt => opt.MapFrom(src => src.Reviews.Any(r => r.IsPublished == true)
                                                       ? src.Reviews.Where(r => r.IsPublished == true).Average(r => r.Rating)
                                                       : (double?)null))
                .ForMember(dest => dest.ReviewCount,
                           opt => opt.MapFrom(src => src.Reviews.Count(r => r.IsPublished == true)))
                .ForMember(dest => dest.Images,
                           opt => opt.MapFrom(src => src.Medias.OrderBy(m => m.SortOrder)))
                .ForMember(dest => dest.Amenities,
                           opt => opt.MapFrom(src => src.HotelAmenities.Select(ha => ha.Amenity))) 
                .ForMember(dest => dest.RoomTypes,
                           opt => opt.MapFrom(src => src.RoomTypes.Where(rt => rt.IsActive == true)));

            CreateMap<Hotel, AdminHotelSummaryDto>()
                .ForMember(dest => dest.OwnerName,
                           opt => opt.MapFrom(src => src.OwnerUser != null ? src.OwnerUser.FullName : "N/A"))
                .ForMember(dest => dest.OwnerEmail,
                           opt => opt.MapFrom(src => src.OwnerUser != null ? src.OwnerUser.Email : "N/A"))
                .ForMember(dest => dest.OwnerPhone,
                           opt => opt.MapFrom(src => src.OwnerUser != null ? src.OwnerUser.Phone : null))
                .ForMember(dest => dest.TotalBookings,
                           opt => opt.MapFrom(src => src.Bookings != null ? src.Bookings.Count : 0));
        }
    }
}
