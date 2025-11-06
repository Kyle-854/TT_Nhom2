using HotelBooking.Application.Interfaces.Repositories;
using HotelBooking.Application.Interfaces.UnitOfWork;
using HotelBooking.Domain.Entities;
using HotelBooking.Infrastructure.Persistence;
using HotelBooking.Infrastructure.Repositories;

namespace HotelBooking.Infrastructure.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly HotelBookingDbContext _context;

        private IUserRepository _userrepo;
        private IHotelRepository _hotelrepo;
        private IRoomTypeRepository _roomTyperepo;
        private IRoomInventoryRepository _roomInventorierepo;
        private IBookingRepository _bookingrepo;
        private IReviewRepository _reviewrepo;
        private IPromotionRepository _promotionrepo;
        private IRoleRepository _rolerepo;

        private IGenericRepository<PaymentTransaction> _paymentTransactions;
        private IGenericRepository<Invoice> _invoices;
        private IGenericRepository<Media> _medias;
        private IGenericRepository<HotelPaymentSettlement> _hotelPaymentSettlements;
        private IGenericRepository<AuditLog> _auditLogs;
        private IGenericRepository<BookingStatus> _bookingStatuses;
        private IGenericRepository<PaymentStatus> _paymentStatuses;
        private IGenericRepository<Amenity> _amenities;

        public UnitOfWork(HotelBookingDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public IUserRepository UserRepo
        {
            get
            {
                if (this._userrepo == null)
                {
                    this._userrepo = new UserRepository(_context);
                }
                return this._userrepo;
            }
        }

        public IHotelRepository HotelRepo
        {
            get
            {
                if (this._hotelrepo == null)
                {
                    this._hotelrepo = new HotelRepository(_context);
                }
                return this._hotelrepo;
            }
        }

        public IRoomTypeRepository RoomTypeRepo
        {
            get
            {
                if (this._roomTyperepo == null)
                {
                    this._roomTyperepo = new RoomTypeRepository(_context);
                }
                return this._roomTyperepo;
            }
        }

        public IRoomInventoryRepository RoomInventorieRepo
        {
            get
            {
                if (this._roomInventorierepo == null)
                {
                    this._roomInventorierepo = new RoomInventoryRepository(_context);
                }
                return this._roomInventorierepo;
            }
        }

        public IBookingRepository BookingRepo
        {
            get
            {
                if (this._bookingrepo == null)
                {
                    this._bookingrepo = new BookingRepository(_context);
                }
                return this._bookingrepo;
            }
        }

        public IReviewRepository ReviewRepo
        {
            get
            {
                if (this._reviewrepo == null)
                {
                    this._reviewrepo = new ReviewRepository(_context);
                }
                return this._reviewrepo;
            }
        }

        public IPromotionRepository PromotionRepo
        {
            get
            {
                if (this._promotionrepo == null)
                {
                    this._promotionrepo = new PromotionRepository(_context);
                }
                return this._promotionrepo;
            }
        }

        public IRoleRepository RoleRepo
        {
            get
            {
                if (this._rolerepo == null)
                {
                    this._rolerepo = new RoleRepository(_context);
                }
                return this._rolerepo;
            }
        }

        public IGenericRepository<PaymentTransaction> PaymentTransactions
        {
            get
            {
                if (this._paymentTransactions == null)
                {
                    this._paymentTransactions = new GenericRepository<PaymentTransaction>(_context);
                }
                return this._paymentTransactions;
            }
        }

        public IGenericRepository<Invoice> Invoices
        {
            get
            {
                if (this._invoices == null)
                {
                    this._invoices = new GenericRepository<Invoice>(_context);
                }
                return this._invoices;
            }
        }

        public IGenericRepository<Media> Medias
        {
            get
            {
                if (this._medias == null)
                {
                    this._medias = new GenericRepository<Media>(_context);
                }
                return this._medias;
            }
        }

        public IGenericRepository<HotelPaymentSettlement> HotelPaymentSettlements
        {
            get
            {
                if (this._hotelPaymentSettlements == null)
                {
                    this._hotelPaymentSettlements = new GenericRepository<HotelPaymentSettlement>(_context);
                }
                return this._hotelPaymentSettlements;
            }
        }

        public IGenericRepository<AuditLog> AuditLogs
        {
            get
            {
                if (this._auditLogs == null)
                {
                    this._auditLogs = new GenericRepository<AuditLog>(_context);
                }
                return this._auditLogs;
            }
        }

        public IGenericRepository<BookingStatus> BookingStatuses
        {
            get
            {
                if (this._bookingStatuses == null)
                {
                    this._bookingStatuses = new GenericRepository<BookingStatus>(_context);
                }
                return this._bookingStatuses;
            }
        }

        public IGenericRepository<PaymentStatus> PaymentStatuses
        {
            get
            {
                if (this._paymentStatuses == null)
                {
                    this._paymentStatuses = new GenericRepository<PaymentStatus>(_context);
                }
                return this._paymentStatuses;
            }
        }

        public IGenericRepository<Amenity> Amenities
        {
            get
            {
                if (this._amenities == null)
                {
                    this._amenities = new GenericRepository<Amenity>(_context);
                }
                return this._amenities;
            }
        }

        public Task<int> CompleteAsync()
        {
            return _context.SaveChangesAsync();
        }

        public async ValueTask DisposeAsync()
        {
            await _context.DisposeAsync();
            GC.SuppressFinalize(this);
        }
    }
}
