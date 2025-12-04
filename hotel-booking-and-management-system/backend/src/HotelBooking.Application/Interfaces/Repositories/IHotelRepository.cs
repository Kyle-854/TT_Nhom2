using HotelBooking.Application.DataTransferObjects.Hotel;
using HotelBooking.Application.DataTransferObjects.Search;
using HotelBooking.Domain.Entities;

namespace HotelBooking.Application.Interfaces.Repositories
{
    public interface IHotelRepository : IGenericRepository<Hotel>
    {
        Task<Hotel?> GetHotelWithDetailsAsync(long hotelId);
        Task<IEnumerable<Hotel>> GetHotelsByCityAsync(string city);
        Task<IEnumerable<Hotel>> GetHotelsByOwnerIdAsync(long ownerUserId);
        Task<Hotel?> GetActiveHotelWithDetailsAsync(long hotelId);
        Task<IEnumerable<Hotel>> GetActiveHotelsSummaryAsync();
        Task<(List<HotelSearchResultDto> Items, int TotalRecords)> SearchHotelsAsync(HotelSearchRequestDto request);
        Task<List<SearchSuggestionDto>> GetSuggestionsAsync(string query);
        Task<(List<Hotel> Items, int TotalItems)> GetHotelsForAdminAsync(AdminHotelFilterDto filter);
    }
}
