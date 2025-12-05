using HotelBooking.Application.Common;
using HotelBooking.Application.DataTransferObjects.Search;
using HotelBooking.Application.Interfaces.UnitOfWork;
namespace HotelBooking.Application.Services
{
    public class SearchService
    {
        private readonly IUnitOfWork _unitOfWork;

        public SearchService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<PagedResult<HotelSearchResultDto>> SearchHotelsAsync(HotelSearchRequestDto request)
        {
            if (request.CheckInDate.HasValue && request.CheckOutDate.HasValue)
            {
                if (request.CheckInDate.Value.Date < DateTime.Now.Date)
                {
                    throw new InvalidOperationException("Ngày nhận phòng không được nằm trong quá khứ.");
                }

                if (request.CheckOutDate.Value.Date <= request.CheckInDate.Value.Date)
                {
                    throw new InvalidOperationException("Ngày trả phòng phải lớn hơn ngày nhận phòng.");
                }
            }

            if (request.Adults < 1)
            {
                throw new InvalidOperationException("Số lượng người lớn tối thiểu phải là 1.");
            }

            if (request.Adults > 20 || request.Children > 20)
            {
                throw new InvalidOperationException("Số lượng khách vượt quá giới hạn cho phép (tối đa 20 người).");
            }

            if (request.Rooms < 1)
            {
                throw new InvalidOperationException("Số lượng phòng tối thiểu phải là 1.");
            }

            if (request.Page < 1 || request.PageSize < 1)
            {
                throw new InvalidOperationException("Chỉ số trang không hợp lệ.");
            }

            try
            {
                (List<HotelSearchResultDto> items, int totalRecords) = await _unitOfWork.HotelRepo.SearchHotelsAsync(request);

                PagedResult<HotelSearchResultDto>? result = new PagedResult<HotelSearchResultDto>
                {
                    Items = items,
                    PageIndex = request.Page,
                    PageSize = request.PageSize,
                    TotalItems = totalRecords
                };

                return result;
            }
            catch (Exception ex) when (ex is not InvalidOperationException)
            {
                throw;
            }
        }

        public async Task<List<SearchSuggestionDto>> GetSuggestionsAsync(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return new List<SearchSuggestionDto>();
            }

            if (query.Length > 100)
            {
                throw new InvalidOperationException("Từ khóa tìm kiếm quá dài, vui lòng nhập ngắn hơn.");
            }

            List<SearchSuggestionDto>? suggestions = await _unitOfWork.HotelRepo.GetSuggestionsAsync(query);

            return suggestions;
        }
    }
}
