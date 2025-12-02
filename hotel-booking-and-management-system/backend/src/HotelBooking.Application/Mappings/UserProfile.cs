using AutoMapper;
using HotelBooking.Application.DataTransferObjects.Auth;
using HotelBooking.Application.DataTransferObjects.User;
using HotelBooking.Domain.Entities;

namespace HotelBooking.Application.Mappings
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<User, UserSummaryDto>()
                .ForMember(
                    dest => dest.RoleName,
                    opt => opt.MapFrom(src => src.Role.RoleName)
                );

            CreateMap<User, UserDetailDto>()
                .ForMember(
                    dest => dest.RoleName,
                    opt => opt.MapFrom(src => src.Role.RoleName)
                )
                .ForMember(
                    dest => dest.TotalBookings,
                    opt => opt.MapFrom(src => src.Bookings.Count) 
                )
                .ForMember(
                    dest => dest.TotalReviews,
                    opt => opt.MapFrom(src => src.Reviews.Count) 
                );

            CreateMap<UserRegisterDto, User>()
                .ForMember(
                    dest => dest.PasswordHash, 
                    opt => opt.Ignore() 
                );

            CreateMap<UserProfileUpdateDto, User>();

            CreateMap<AdminUserCreateDto, User>()
                .ForMember(
                    dest => dest.PasswordHash,
                    opt => opt.Ignore()
                );

            CreateMap<AdminUserUpdateDto, User>();
        }
    }
}
