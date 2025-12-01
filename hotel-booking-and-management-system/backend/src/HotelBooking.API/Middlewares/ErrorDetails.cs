using System.Text.Json;
using System.Text.Json.Serialization;

namespace HotelBooking.API.Middlewares
{
    public class ErrorDetails
    {
        [JsonPropertyName("statusCode")]
        public int StatusCode { get; set; }

        [JsonPropertyName("message")]
        public string Message { get; set; } = string.Empty;

        public override string ToString()
        {
            return JsonSerializer.Serialize(this);
        }
    }
}
