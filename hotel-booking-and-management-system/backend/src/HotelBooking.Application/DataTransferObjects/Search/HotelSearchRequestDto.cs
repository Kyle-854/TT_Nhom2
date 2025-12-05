using System.ComponentModel.DataAnnotations;

namespace HotelBooking.Application.DataTransferObjects.Search
{
    public class HotelSearchRequestDto
    {
        public string? Location { get; set; }

        [DataType(DataType.Date)]
        public DateTime? CheckInDate { get; set; }

        [DataType(DataType.Date)]
        public DateTime? CheckOutDate { get; set; }

        [Range(1, 20, ErrorMessage = "Số người lớn phải từ 1 đến 20.")]
        public int Adults { get; set; } = 1;

        [Range(0, 20, ErrorMessage = "Số trẻ em phải từ 0 đến 20.")]
        public int Children { get; set; } = 0;

        [Range(1, 10, ErrorMessage = "Số lượng phòng phải từ 1 đến 10.")]
        public int Rooms { get; set; } = 1;

        [Range(1, int.MaxValue, ErrorMessage = "Trang phải lớn hơn 0.")]
        public int Page { get; set; } = 1;

        [Range(1, 100, ErrorMessage = "Kích thước trang tối đa là 100.")]
        public int PageSize { get; set; } = 10;
        public string SortBy { get; set; } = "Recommended";
    }
}
