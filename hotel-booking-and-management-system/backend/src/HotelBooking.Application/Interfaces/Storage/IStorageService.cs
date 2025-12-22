namespace HotelBooking.Application.Interfaces.Storage
{
    public interface IStorageService
    {
        Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType);
        Task DeleteFileAsync(string fileIdOrUrl);
    }
}
