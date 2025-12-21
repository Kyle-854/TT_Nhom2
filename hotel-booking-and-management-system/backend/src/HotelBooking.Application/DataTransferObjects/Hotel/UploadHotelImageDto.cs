namespace HotelBooking.Application.DataTransferObjects.Hotel
{
    public class UploadHotelImageDto
    {
        public string FileName { get; set; }
        public string ContentType { get; set; }
        public Stream FileContent { get; set; }
        public string Caption { get; set; }
        public bool IsMain { get; set; }
    }
}
