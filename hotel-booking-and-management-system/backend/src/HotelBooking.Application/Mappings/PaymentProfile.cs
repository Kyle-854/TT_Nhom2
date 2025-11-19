using AutoMapper;
using HotelBooking.Application.DataTransferObjects.Payment;
using HotelBooking.Domain.Entities;

namespace HotelBooking.Application.Mappings
{
    public class PaymentProfile : Profile
    {
        public PaymentProfile()
        {
            CreateMap<PaymentTransaction, PaymentIntentResponseDto>()
                .ForMember(
                    dest => dest.FakePaymentUrl,
                    opt => opt.Ignore() // Bỏ qua thuộc tính này
                );


            CreateMap<Booking, PaymentStatusResponseDto>()
                .ForMember(
                    dest => dest.BookingStatus,
                    opt => opt.MapFrom(src =>
                        src.Status != null ? src.Status.StatusName : null)
                )
                .ForMember(
                    dest => dest.LastPaymentStatus,
                    opt => opt.MapFrom(src =>
                        // Tìm giao dịch cuối cùng
                        src.PaymentTransactions != null && src.PaymentTransactions.Any()
                            ? src.PaymentTransactions
                                 .OrderByDescending(p => p.CreatedAt)
                                 .First() // Lấy giao dịch mới nhất
                                 .Status.StatusName // Lấy tên trạng thái
                            : "NotAttempted" // Nếu chưa có giao dịch
                    )
                )
                .ForMember(
                    dest => dest.LastPaymentAttemptAt,
                    opt => opt.MapFrom(src =>
                        // Tìm thời gian của giao dịch cuối cùng
                        src.PaymentTransactions != null && src.PaymentTransactions.Any()
                            ? src.PaymentTransactions
                                 .OrderByDescending(p => p.CreatedAt)
                                 .First() // Lấy giao dịch mới nhất
                                 .CreatedAt // Lấy thời gian tạo
                            : (DateTimeOffset?)null // Nếu chưa có
                    )
                );
        }
    }
}
