using HotelBooking.Application.Interfaces.Repositories;
using HotelBooking.Domain.Entities;
using HotelBooking.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HotelBooking.Infrastructure.Repositories
{
    public class PaymentRepository : GenericRepository<PaymentTransaction>, IPaymentRepository
    {
        private const byte PAYMENT_STATUS_COMPLETED = 2;

        public PaymentRepository(HotelBookingDbContext context) : base(context)
        {
        }

        public async Task<PaymentTransaction?> GetByProviderTxnIdAsync(string providerTxnId)
        {
            return await _context.PaymentTransactions
                        .FirstOrDefaultAsync(p => p.ProviderTxnId == providerTxnId);
        }
        public async Task<PaymentTransaction?> FindCompletedByBookingIdAsync(long bookingId)
        {
            return await _context.PaymentTransactions
                        .FirstOrDefaultAsync(p =>
                            p.BookingId == bookingId &&
                            p.StatusId == PAYMENT_STATUS_COMPLETED);
        }
    }
}
