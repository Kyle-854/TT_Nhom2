using AutoMapper;
using HotelBooking.Application.Common;
using HotelBooking.Application.DataTransferObjects.Hotel;
using HotelBooking.Application.Interfaces.UnitOfWork;
using HotelBooking.Domain.Entities;

namespace HotelBooking.Application.Services
{
    public class AdminHotelModerationService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AdminHotelModerationService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<PagedResult<AdminHotelSummaryDto>> GetAllHotelsAsync(AdminHotelFilterDto filter)
        {
            (List<Hotel> items, int totalItems) = await _unitOfWork.HotelRepo.GetHotelsForAdminAsync(filter);

            var dtos = _mapper.Map<List<AdminHotelSummaryDto>>(items);

            return new PagedResult<AdminHotelSummaryDto>
            {
                Items = dtos,
                TotalItems = totalItems,
                PageIndex = filter.PageNumber,
                PageSize = filter.PageSize
            };
        }

        public async Task ApproveHotelAsync(long hotelId, AdminHotelApprovalDto request, long adminId)
        {
            Hotel? hotel = await _unitOfWork.HotelRepo.GetByIdAsync(hotelId);
            if (hotel == null) 
            {
                throw new KeyNotFoundException($"Không tìm thấy khách sạn với ID {hotelId}.");
            }

            if (hotel.IsActive == true)
            {
                throw new InvalidOperationException("Khách sạn này đã được kích hoạt và đang hoạt động.");
            }

            hotel.IsActive = true;
            hotel.UpdatedAt = DateTime.UtcNow;
            _unitOfWork.HotelRepo.Update(hotel);

            AuditLog? auditLog = new AuditLog
            {
                EntityName = "Hotel",
                EntityId = hotelId.ToString(),
                Action = "APPROVE",
                PerformedBy = adminId,
                PerformedAt = DateTime.UtcNow,
                DataBefore = "IsActive: False",
                DataAfter = $"IsActive: True | Note: {request.Note ?? "N/A"}"
            };

            await _unitOfWork.AuditLogs.AddAsync(auditLog);
            await _unitOfWork.CompleteAsync();
        }

        public async Task SuspendHotelAsync(long hotelId, AdminHotelSuspensionDto request, long adminId)
        {
            Hotel? hotel = await _unitOfWork.HotelRepo.GetByIdAsync(hotelId);
            if (hotel == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy khách sạn với ID {hotelId}.");
            }

            if (hotel.IsActive == false)
            {
                throw new InvalidOperationException("Khách sạn này hiện đang bị khóa hoặc chưa được kích hoạt.");
            }

            hotel.IsActive = false;
            hotel.UpdatedAt = DateTime.UtcNow;
            _unitOfWork.HotelRepo.Update(hotel);

            AuditLog? auditLog = new AuditLog
            {
                EntityName = "Hotel",
                EntityId = hotelId.ToString(),
                Action = "SUSPEND",
                PerformedBy = adminId,
                PerformedAt = DateTime.UtcNow,
                DataBefore = "IsActive: True",
                DataAfter = $"IsActive: False | Reason: {request.Reason}"
            };
            await _unitOfWork.AuditLogs.AddAsync(auditLog);
            await _unitOfWork.CompleteAsync();
        }
    }
}
