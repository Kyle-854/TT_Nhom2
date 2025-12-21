using HotelBooking.Application.Interfaces.Repositories;
using HotelBooking.Domain.Entities;

namespace HotelBooking.Application.Interfaces.UnitOfWork
{
    public interface IUnitOfWork : IAsyncDisposable
    {
        IAmenityRepository AmenitieRepo { get; }
        IUserRepository UserRepo { get; }
        IHotelRepository HotelRepo { get; }
        IRoomTypeRepository RoomTypeRepo { get; }
        IRoomInventoryRepository RoomInventorieRepo { get; }
        IBookingRepository BookingRepo { get; }
        IReviewRepository ReviewRepo { get; }
        IPromotionRepository PromotionRepo { get; }
        IRoleRepository RoleRepo { get; }
        IPaymentRepository PaymentRepo { get; }
        IMediaRepository MediaRepo { get; }
        IHotelAmenityRepository HotelAmenityRepo { get; }

        IGenericRepository<Invoice> Invoices { get; }
        IGenericRepository<Media> Medias { get; }
        IGenericRepository<HotelPaymentSettlement> HotelPaymentSettlements { get; }
        IGenericRepository<AuditLog> AuditLogs { get; }
        IGenericRepository<BookingStatus> BookingStatuses { get; }
        IGenericRepository<PaymentStatus> PaymentStatuses { get; }
        Task<int> CompleteAsync();
    }
}
