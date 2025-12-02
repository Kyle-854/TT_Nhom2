using System.Text.Json.Serialization;

namespace HotelBooking.Application.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum UserSortField
    {
        CreatedAt,
        FullName,
        Email,
        Phone,
        Role,
        Id
    }
}
