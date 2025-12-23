using AutoMapper;
using HotelBooking.Application.DataTransferObjects.Amenity;
using HotelBooking.Application.DataTransferObjects.Media;
using HotelBooking.Application.DataTransferObjects.RoomType;
using HotelBooking.Domain.Entities;

namespace HotelBooking.Application.Mappings
{
    public class RoomTypeProfile : Profile
    {
        public RoomTypeProfile()
        {
            CreateMap<Amenity, AmenityDto>()
                .ForMember(dest => dest.AmenityId, opt => opt.MapFrom(src => src.AmenityId));

            CreateMap<Media, RoomTypeMediaDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.MediaId));

            CreateMap<RoomType, RoomTypeDto>()
                .ForMember(dest => dest.RoomTypeId, opt => opt.MapFrom(src => src.RoomTypeId))
                .ForMember(dest => dest.Capacity,opt => opt.MapFrom(src => src.MaxAdults))
                .ForMember(dest => dest.PricePerNight,opt => opt.MapFrom(src => src.DefaultPrice))
                .ForMember(dest => dest.Images, opt => opt.MapFrom(src => src.Media))
                .ForMember(dest => dest.Amenities, opt => opt.MapFrom(src =>src.RoomTypeAmenities.Select(rta => rta.Amenity)));


            CreateMap<CreateRoomTypeRequestDto, RoomType>()
                .ForMember(dest => dest.RoomTypeId, opt => opt.Ignore())
                .ForMember(dest => dest.RoomTypeAmenities, opt => opt.Ignore())
                .ForMember(dest => dest.Media, opt => opt.Ignore())
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true))
                .ForMember(dest => dest.Currency, opt => opt.MapFrom(src => "VND"));

            CreateMap<UpdateRoomTypeRequestDto, RoomType>()
                .ForMember(dest => dest.RoomTypeId, opt => opt.Ignore())
                .ForMember(dest => dest.RoomTypeAmenities, opt => opt.Ignore())
                .ForMember(dest => dest.Media, opt => opt.Ignore())
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
