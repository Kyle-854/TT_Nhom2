using AutoMapper;
using HotelBooking.Application.DataTransferObjects.Review;
using HotelBooking.Application.Interfaces.UnitOfWork;
using HotelBooking.Domain.Entities;

namespace HotelBooking.Application.Services
{
    public class ReviewService
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        private const int CHECKED_OUT_STATUS_ID = 4;

        public ReviewService(IUnitOfWork uow, IMapper mapper)
        {
            _uow = uow;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ReviewDto>> GetReviewsForHotelAsync(long hotelId)
        {
            Hotel? hotel = await _uow.HotelRepo.GetByIdAsync(hotelId);

            if (hotel == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy khách sạn có ID {hotelId}.");
            }

            IEnumerable<Review>? reviews = await _uow.ReviewRepo.GetReviewsByHotelIdAsync(hotelId, includeUnpublished: false);

            return _mapper.Map<IEnumerable<ReviewDto>>(reviews);
        }

        public async Task<ReviewDto> GetReviewByIdAsync(long reviewId)
        {
            Review? review = await _uow.ReviewRepo.GetReviewByIdWithCustomerAsync(reviewId);

            if (review == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy đánh giá có ID {reviewId}.");
            }

            return _mapper.Map<ReviewDto>(review);
        }

        public async Task<ReviewDto> CreateReviewAsync(CreateReviewDto createDto, long customerId)
        {
            Booking? booking = await _uow.BookingRepo.GetByIdAsync(createDto.BookingId);

            if (booking == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy đặt chỗ có ID {createDto.BookingId}.");
            }

            if (booking.CustomerUserId != customerId)
            {
                throw new UnauthorizedAccessException("Bạn chỉ có thể đánh giá cho chính booking của bạn.");
            }

            if (booking.StatusId != CHECKED_OUT_STATUS_ID)
            {
                throw new InvalidOperationException("Booking phải 'CheckedOut' để được đánh giá.");
            }

            bool hasReview = await _uow.ReviewRepo.CheckIfBookingHasReviewAsync(booking.BookingId);
            if (hasReview)
            {
                throw new InvalidOperationException("Bạn đã đánh gía cho booking này rồi.");
            }

            Review? newReview = _mapper.Map<Review>(createDto);
            newReview.CustomerUserId = customerId;
            newReview.HotelId = booking.HotelId;
            newReview.IsPublished = true;
            newReview.CreatedAt = DateTimeOffset.UtcNow;

            await _uow.ReviewRepo.AddAsync(newReview);
            await _uow.CompleteAsync();

            User? user = await _uow.UserRepo.GetByIdAsync(customerId);
            ReviewDto? resultDto = _mapper.Map<ReviewDto>(newReview);
            resultDto.CustomerFullName = user?.FullName ?? "User";

            return resultDto;
        }

        public async Task<ReviewDto> UpdateReviewAsync(long reviewId, UpdateReviewDto updateDto, long customerId)
        {
            Review? review = await _uow.ReviewRepo.GetByIdAsync(reviewId);

            if (review == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy đánh giá có ID {reviewId}.");
            }

            if (review.CustomerUserId != customerId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền để chỉnh sửa đánh giá này.");
            }

            _mapper.Map(updateDto, review);

            _uow.ReviewRepo.Update(review);
            await _uow.CompleteAsync();

            return await GetReviewByIdAsync(reviewId);
        }

        public async Task DeleteReviewAsync(long reviewId, long customerId)
        {
            Review? review = await _uow.ReviewRepo.GetByIdAsync(reviewId);

            if (review == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy đánh giá có ID {reviewId}.");
            }

            if (review.CustomerUserId != customerId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền để xóa đánh gái này.");
            }

            _uow.ReviewRepo.Delete(review);
            await _uow.CompleteAsync();
        }
    }
}
