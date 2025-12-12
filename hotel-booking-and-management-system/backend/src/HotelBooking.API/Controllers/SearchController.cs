using HotelBooking.Application.Common;
using HotelBooking.Application.DataTransferObjects.Search;
using HotelBooking.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace HotelBooking.API.Controllers
{
    [Area("users")]
    [Route("api/[area]/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly SearchService _searchService;

        public SearchController(SearchService searchService)
        {
            _searchService = searchService;
        }

        [HttpGet("hotels")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SearchHotels([FromQuery] HotelSearchRequestDto request)
        {
            PagedResult<HotelSearchResultDto>? result = await _searchService.SearchHotelsAsync(request);
            return Ok(result);
        }

        [HttpGet("suggestions")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetSuggestions([FromQuery] string query)
        {
            List<SearchSuggestionDto>? result = await _searchService.GetSuggestionsAsync(query);
            return Ok(result);
        }

    }
}
