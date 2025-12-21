using HotelBooking.Application.DataTransferObjects.Hotel;
using HotelBooking.Application.DataTransferObjects.Search;
using HotelBooking.Application.Interfaces.Repositories;
using HotelBooking.Domain.Entities;
using HotelBooking.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using System.Data;
using System.Data.Common;

namespace HotelBooking.Infrastructure.Repositories
{
    public class HotelRepository : GenericRepository<Hotel>, IHotelRepository
    {
        public HotelRepository(HotelBookingDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Hotel>> GetHotelsByCityAsync(string city)
        {
            return await _context.Hotels
                                 .Where(h => h.City == city)
                                 .ToListAsync();
        }

        public async Task<IEnumerable<Hotel>> GetHotelsByOwnerIdAsync(long ownerUserId)
        {
            return await _context.Hotels
                                .Include(h => h.Medias.Where(m => m.IsMain))
                                .Where(h => h.OwnerUserId == ownerUserId)
                                .OrderByDescending(h => h.CreatedAt)
                                .ToListAsync();
        }

        public async Task<Hotel?> GetHotelWithDetailsAsync(long hotelId)
        {
            return await _context.Hotels
                .Include(h => h.RoomTypes)         
                .Include(h => h.Reviews)           
                .Include(h => h.Medias)            
                .Include(h => h.HotelAmenities)    
                    .ThenInclude(ha => ha.Amenity) 
                .FirstOrDefaultAsync(h => h.HotelId == hotelId);
        }

        public async Task<Hotel?> GetActiveHotelWithDetailsAsync(long hotelId)
        {
            return await _context.Hotels
                .Where(h => h.HotelId == hotelId && h.IsActive == true) 
                .Include(h => h.RoomTypes.Where(rt => rt.IsActive == true)) 
                .Include(h => h.Reviews.Where(r => r.IsPublished == true)) 
                .Include(h => h.Medias)
                .Include(h => h.HotelAmenities)
                    .ThenInclude(ha => ha.Amenity)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Hotel>> GetActiveHotelsSummaryAsync()
        {
            return await _context.Hotels
                .Where(h => h.IsActive == true)
                .Include(h => h.RoomTypes.Where(rt => rt.IsActive == true)) 
                .Include(h => h.Reviews.Where(r => r.IsPublished == true)) 
                .Include(h => h.Medias) 
                .ToListAsync();
        }
        public async Task<(List<HotelSearchResultDto> Items, int TotalRecords)> SearchHotelsAsync(HotelSearchRequestDto request)
        {
            List<HotelSearchResultDto>? results = new List<HotelSearchResultDto>();
            int totalRecords = 0;

            DbConnection? connection = _context.Database.GetDbConnection();

            try
            {
                if (connection.State != ConnectionState.Open)
                {
                    await connection.OpenAsync();
                }

                using (DbCommand? command = connection.CreateCommand())
                {
                    command.CommandText = "sp_SearchHotels";
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.Add(new MySqlParameter("@p_Location", request.Location ?? (object)DBNull.Value));
                    command.Parameters.Add(new MySqlParameter("@p_CheckInDate", request.CheckInDate ?? DateTime.Today));
                    command.Parameters.Add(new MySqlParameter("@p_CheckOutDate", request.CheckOutDate ?? DateTime.Today.AddDays(1)));
                    command.Parameters.Add(new MySqlParameter("@p_Adults", request.Adults));
                    command.Parameters.Add(new MySqlParameter("@p_Children", request.Children));
                    command.Parameters.Add(new MySqlParameter("@p_RoomQty", request.Rooms));
                    command.Parameters.Add(new MySqlParameter("@p_PageNumber", request.Page));
                    command.Parameters.Add(new MySqlParameter("@p_PageSize", request.PageSize));
                    command.Parameters.Add(new MySqlParameter("@p_SortBy", request.SortBy ?? "Recommended"));

                    MySqlParameter? pTotalRecords = new MySqlParameter("@p_TotalRecords", MySqlDbType.Int32);
                    pTotalRecords.Direction = ParameterDirection.Output;
                    command.Parameters.Add(pTotalRecords);

                    using (DbDataReader? reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            results.Add(new HotelSearchResultDto
                            {
                                HotelId = Convert.ToInt64(reader["HotelId"]),
                                Name = reader["Name"].ToString(),
                                Slug = reader["Slug"].ToString(),
                                Address = reader["Address"] != DBNull.Value ? reader["Address"].ToString() : null,
                                City = reader["City"] != DBNull.Value ? reader["City"].ToString() : null,
                                StarRating = Convert.ToInt32(reader["StarRating"]),
                                ThumbnailUrl = reader["ThumbnailUrl"] != DBNull.Value ? reader["ThumbnailUrl"].ToString() : null,
                                ReviewScore = Convert.ToDouble(reader["ReviewScore"]),
                                ReviewCount = Convert.ToInt32(reader["ReviewCount"]),
                                OriginalTotalAmount = Convert.ToDecimal(reader["OriginalTotalAmount"]),

                                RoomTypeName = reader["RoomTypeName"] != DBNull.Value ? reader["RoomTypeName"].ToString() : null,
                                AvailableRooms = Convert.ToInt32(reader["AvailableRooms"]),

                                PromotionTitle = reader["PromotionTitle"] != DBNull.Value ? reader["PromotionTitle"].ToString() : null,
                                DiscountPct = reader["DiscountPct"] != DBNull.Value ? Convert.ToDecimal(reader["DiscountPct"]) : null,
                                DiscountFixed = reader["DiscountFixed"] != DBNull.Value ? Convert.ToDecimal(reader["DiscountFixed"]) : null,
                                FinalTotalAmount = Convert.ToDecimal(reader["FinalTotalAmount"])
                            });
                        }
                    }

                    if (pTotalRecords.Value != DBNull.Value)
                    {
                        totalRecords = Convert.ToInt32(pTotalRecords.Value);
                    }
                }
            }
            finally
            {
                if (connection.State == ConnectionState.Open)
                {
                    await connection.CloseAsync();
                }
            }

            return (results, totalRecords);
        }

        public async Task<List<SearchSuggestionDto>> GetSuggestionsAsync(string query)
        {
            if (string.IsNullOrEmpty(query) || query.Length < 2)
            {
                return new List<SearchSuggestionDto>();
            }

            MySqlParameter? pQuery = new MySqlParameter("@p_Query", $"%{query}%");

            FormattableString sql = $@"
                (SELECT DISTINCT City AS Name, 'City' AS Type, NULL AS Id 
                FROM hotel 
                WHERE City LIKE {pQuery} AND IsActive = 1
                LIMIT 5)
                UNION
                (SELECT Name, 'Hotel' AS Type, HotelId AS Id 
                FROM hotel 
                WHERE Name LIKE {pQuery} AND IsActive = 1
                LIMIT 5)";

            List<SearchSuggestionDto>? results = await _context.Database
                .SqlQuery<SearchSuggestionDto>(sql)
                .ToListAsync();

            return results;
        }

        public async Task<(List<Hotel> Items, int TotalItems)> GetHotelsForAdminAsync(AdminHotelFilterDto filter)
        {
            IQueryable<Hotel>? query = _context.Hotels
                .AsNoTracking()
                .Include(h => h.OwnerUser)
                .Include(h => h.Bookings)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(filter.Keyword))
            {
                string? keyword = filter.Keyword.Trim();
                query = query.Where(h => h.Name.Contains(keyword) || (h.OwnerUser != null && h.OwnerUser.Email.Contains(keyword)));
            }

            if (filter.IsActive.HasValue)
            {
                query = query.Where(h => h.IsActive == filter.IsActive.Value);
            }

            if (!string.IsNullOrWhiteSpace(filter.City))
            {
                query = query.Where(h => h.City != null && h.City.Contains(filter.City));
            }

            if (filter.StarRating.HasValue)
            {
                query = query.Where(h => h.StarRating == filter.StarRating.Value);
            }

            int totalItems = await query.CountAsync();

            query = query.OrderByDescending(h => h.CreatedAt);

            List<Hotel>? items = await query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            return (items, totalItems);
        }

        public async Task<bool> ExistsBySlugAsync(string slug)
        {
            return await _context.Hotels.AnyAsync(h => h.Slug == slug);
        }
    }
}
