using AutoMapper;
using HotelBooking.Application.DataTransferObjects.Amenity;
using HotelBooking.Domain.Entities;

namespace HotelBooking.Application.Mappings
{
    public class AmenityProfile : Profile
    {
        public AmenityProfile()
        {
            CreateMap<Amenity, AmenityDto>();

            CreateMap<CreateAmenityDto, Amenity>()
                .ForMember(dest => dest.AmenityId, opt => opt.Ignore());

            CreateMap<UpdateAmenityDto, Amenity>()
                .ForMember(dest => dest.AmenityId, opt => opt.Ignore());
        }
    }
}
