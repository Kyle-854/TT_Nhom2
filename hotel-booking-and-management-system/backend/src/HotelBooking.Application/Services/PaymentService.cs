using AutoMapper;
using HotelBooking.Application.DataTransferObjects.Payment;
using HotelBooking.Application.Interfaces.UnitOfWork;
using HotelBooking.Domain.Entities;

namespace HotelBooking.Application.Services
{
    public class PaymentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        private const sbyte BOOKING_STATUS_PENDING = 1;
        private const sbyte BOOKING_STATUS_CONFIRMED = 2;

        private const sbyte PAYMENT_STATUS_PENDING = 1;
        private const sbyte PAYMENT_STATUS_COMPLETED = 2;
        private const sbyte PAYMENT_STATUS_FAILED = 3;

        public PaymentService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<PaymentIntentResponseDto> CreatePaymentIntentAsync(PaymentIntentRequestDto request, long currentUserId)
        {
            Booking? booking = await _unitOfWork.BookingRepo.GetByIdAsync(request.BookingId);

            if (booking == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy đặt chỗ có ID {request.BookingId}.");
            }

            if (booking.CustomerUserId != currentUserId)
            {
                throw new InvalidOperationException("Bạn không có quyền thanh toán cho đơn này.");
            }

            if (booking.StatusId != BOOKING_STATUS_PENDING)
            {
                throw new InvalidOperationException("Booking không ở trạng thái 'Pending'.");
            }

            PaymentTransaction? existingCompletedTxn = await _unitOfWork.PaymentRepo.FindCompletedByBookingIdAsync(request.BookingId);

            if (existingCompletedTxn != null)
            {
                throw new InvalidOperationException("Booking này đã được thanh toán thành công.");
            }

            string? providerTxnId = $"TXN-{Guid.NewGuid():N}";
            PaymentTransaction? newTransaction = new PaymentTransaction
            {
                BookingId = request.BookingId,
                PaymentProvider = "FakePaymentProvider",
                ProviderTxnId = providerTxnId,
                Amount = booking.TotalAmount,
                Currency = booking.Currency,
                StatusId = PAYMENT_STATUS_PENDING,
                CreatedAt = DateTime.UtcNow
            };

            await _unitOfWork.PaymentRepo.AddAsync(newTransaction);
            await _unitOfWork.CompleteAsync();

            PaymentIntentResponseDto responseDto = _mapper.Map<PaymentIntentResponseDto>(newTransaction);
            responseDto.FakePaymentUrl = $"/fake-payment-gateway?txnId={providerTxnId}&amount={newTransaction.Amount}";

            return responseDto;
        }

        public async Task HandleWebhookAsync(PaymentWebhookRequestDto webhookData)
        {
            PaymentTransaction? transaction = await _unitOfWork.PaymentRepo.GetByProviderTxnIdAsync(webhookData.ProviderTxnId);

            if (transaction == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy giao dịch.");
            }

            if (transaction.StatusId != PAYMENT_STATUS_PENDING)
            {
                throw new InvalidOperationException("Giao dịch không ở trạng thái 'Pending'.");
            }

            Booking? booking = await _unitOfWork.BookingRepo.GetByIdAsync(transaction.BookingId);
            if (booking == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy đặt chỗ liên quan đến giao dịch.");
            }

            if (webhookData.IsSuccess)
            {
                if (webhookData.AmountPaid != transaction.Amount)
                {
                    transaction.StatusId = PAYMENT_STATUS_FAILED;
                    transaction.Note = $"Lỗi đối soát: Sai số tiền.";
                    _unitOfWork.PaymentRepo.Update(transaction);
                    await _unitOfWork.CompleteAsync();
                    return;
                }

                transaction.StatusId = PAYMENT_STATUS_COMPLETED;
                transaction.PaidAt = webhookData.PaidAt;
                transaction.ProviderTxnId = webhookData.GatewayTransactionId ?? transaction.ProviderTxnId;
                transaction.Note = "Thanh toán thành công.";
                _unitOfWork.PaymentRepo.Update(transaction);

                booking.StatusId = BOOKING_STATUS_CONFIRMED;
                booking.UpdatedAt = DateTime.UtcNow;
                _unitOfWork.BookingRepo.Update(booking);

                Invoice invoice = new Invoice 
                {
                    BookingId = booking.BookingId,
                    InvoiceNumber = $"INV-{DateTime.UtcNow:yyyyMMdd}-{booking.BookingId}", 
                    IssuedAt = DateTime.UtcNow,
                    TotalAmount = booking.TotalAmount,
                    Currency = booking.Currency,
                    AmountBeforeTax = booking.TotalAmount, 
                    TaxAmount = 0
                };

                await _unitOfWork.Invoices.AddAsync(invoice);
            }
            else
            {
                transaction.StatusId = PAYMENT_STATUS_FAILED;
                transaction.Note = $"Thanh toán thất bại: {webhookData.ErrorMessage}";
                _unitOfWork.PaymentRepo.Update(transaction);
            }

            await _unitOfWork.CompleteAsync();
        }

        public async Task<PaymentStatusResponseDto> GetBookingPaymentStatusAsync(long bookingId, long currentUserId)
        {
            Booking? booking = await _unitOfWork.BookingRepo.GetBookingWithStatusAndPaymentsAsync(bookingId);

            if (booking == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy đặt chỗ có ID {bookingId}.");
            }

            if (booking.CustomerUserId != currentUserId)
            {
                throw new InvalidOperationException("Bạn không có quyền xem đơn này.");
            }

            return _mapper.Map<PaymentStatusResponseDto>(booking);
        }
    }
}
