using HotelBooking.Application.Interfaces.Repositories;
using HotelBooking.Domain.Entities;

namespace HotelBooking.Application.Interfaces.UnitOfWork
{
    public interface IUnitOfWork : IAsyncDisposable
    {
        IUserRepository UserRepo { get; }
        IHotelRepository HotelRepo { get; }
        IRoomTypeRepository RoomTypeRepo { get; }
        IRoomInventoryRepository RoomInventorieRepo { get; }
        IBookingRepository BookingRepo { get; }
        IReviewRepository ReviewRepo { get; }
        IPromotionRepository PromotionRepo { get; }
        IRoleRepository RoleRepo { get; }

        IGenericRepository<PaymentTransaction> PaymentTransactions { get; }
        IGenericRepository<Invoice> Invoices { get; }
        IGenericRepository<Media> Medias { get; }
        IGenericRepository<HotelPaymentSettlement> HotelPaymentSettlements { get; }
        IGenericRepository<AuditLog> AuditLogs { get; }
        IGenericRepository<BookingStatus> BookingStatuses { get; }
        IGenericRepository<PaymentStatus> PaymentStatuses { get; }
        IGenericRepository<Amenity> Amenities { get; }

        Task<int> CompleteAsync();
    }
}
