using HotelBooking.Application.Interfaces.Repositories;
using HotelBooking.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HotelBooking.Infrastructure.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        protected readonly HotelBookingDbContext _context;

        public GenericRepository(HotelBookingDbContext context)
        {
            _context = context;
        }

        // 3. Hiện thực các phương thức của IGenericRepository

        /// <summary>
        /// Thêm mới một entity
        /// </summary>
        public async Task AddAsync(T entity)
        {
            await _context.Set<T>().AddAsync(entity);
        }

        /// <summary>
        /// Xóa một entity (đánh dấu là Deleted)
        /// </summary>
        public void Delete(T entity)
        {
            _context.Set<T>().Remove(entity);
        }

        /// <summary>
        /// Lấy tất cả entity
        /// </summary>
        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _context.Set<T>().ToListAsync();
        }

        /// <summary>
        /// Lấy entity bằng Id (khóa chính)
        /// </summary>
        public async Task<T?> GetByIdAsync(object id)
        {
            return await _context.Set<T>().FindAsync(id);
        }

        /// <summary>
        /// Cập nhật một entity (đánh dấu là Modified)
        /// </summary>
        public void Update(T entity)
        {
            _context.Entry(entity).State = EntityState.Modified;
        }
    }
}
