using AutoMapper;
using HotelBooking.Application.DataTransferObjects.Review;
using HotelBooking.Domain.Entities;

namespace HotelBooking.Application.Mappings
{
    public class ReviewProfile : Profile
    {
        public ReviewProfile()
        {
            CreateMap<CreateReviewDto, Review>();

            CreateMap<UpdateReviewDto, Review>();

            CreateMap<Review, ReviewDto>()
                .ForMember(
                    dest => dest.CustomerFullName,
                    opt => opt.MapFrom(src => src.CustomerUser != null ? src.CustomerUser.FullName : "Anonymous")
                );
        }
    }
}
