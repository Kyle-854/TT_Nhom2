using System;
using System.Collections.Generic;
using System.Linq;
namespace HotelBooking.Application.DataTransferObjects.Media
{
    public class HotelMediaDto
    {
        public long Id { get; set; }
        public string Url { get; set; }
        public string Caption { get; set; }
        public bool IsMain { get; set; }
    }
}
