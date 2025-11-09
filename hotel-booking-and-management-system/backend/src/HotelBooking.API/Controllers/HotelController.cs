using HotelBooking.Application.DataTransferObjects.Hotel;
using HotelBooking.Application.DataTransferObjects.RoomType;
using HotelBooking.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace HotelBooking.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HotelController : ControllerBase
    {
        private readonly HotelService _hotelService;

        public HotelController(HotelService hotelService)
        {
            _hotelService = hotelService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<HotelSummaryDto>), 200)]
        public async Task<IActionResult> GetHotels()
        {
            IEnumerable<HotelSummaryDto>? hotels = await _hotelService.GetActiveHotelsAsync();
            return Ok(hotels);
        }

        [HttpGet("{id:long}")]
        [ProducesResponseType(typeof(HotelDetailDto), 200)] 
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetHotelById(long id)
        {
            HotelDetailDto? hotelDetail = await _hotelService.GetHotelDetailByIdAsync(id);

            return Ok(hotelDetail);
        }

        [HttpGet("{hotelId:long}/roomtypes")]
        [ProducesResponseType(typeof(IEnumerable<RoomTypeDto>), 200)]
        public async Task<IActionResult> GetRoomTypesForHotel(long hotelId)
        {
            IEnumerable<RoomTypeDto>? roomTypes = await _hotelService.GetRoomTypesForHotelAsync(hotelId);

            return Ok(roomTypes);
        }
    }
}
