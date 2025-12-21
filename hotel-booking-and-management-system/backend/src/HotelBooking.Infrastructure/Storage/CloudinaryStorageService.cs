using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using HotelBooking.Application.Interfaces.Storage;
using HotelBooking.Shared;
using Microsoft.Extensions.Options;

namespace HotelBooking.Infrastructure.Storage
{
    public class CloudinaryStorageService : IStorageService
    {
        private readonly Cloudinary _cloudinary;

        public CloudinaryStorageService(IOptions<CloudinarySettings> config)
        {
            Account? account = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(account);
        }

        public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType)
        {
            if (fileStream.CanSeek)
            {
                fileStream.Position = 0;
            }

            ImageUploadParams? uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(fileName, fileStream),
                Folder = "HotelBooking_Images",
                Overwrite = true
            };

            ImageUploadResult? uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
            {
                return uploadResult.SecureUrl.ToString();
            }
            else
            {
                throw new Exception($"Cloudinary Upload Failed: {uploadResult.Error.Message}");
            }
        }

        public async Task DeleteFileAsync(string fileUrl)
        {
            await Task.CompletedTask;
        }
    }
}
