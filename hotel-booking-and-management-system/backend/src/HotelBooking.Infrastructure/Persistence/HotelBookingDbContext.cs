using HotelBooking.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HotelBooking.Infrastructure.Persistence;

public partial class HotelBookingDbContext : DbContext
{
    public HotelBookingDbContext()
    {
    }

    public HotelBookingDbContext(DbContextOptions<HotelBookingDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Amenity> Amenities { get; set; }

    public virtual DbSet<AuditLog> AuditLogs { get; set; }

    public virtual DbSet<Booking> Bookings { get; set; }

    public virtual DbSet<BookingRoom> BookingRooms { get; set; }

    public virtual DbSet<BookingStatus> BookingStatuses { get; set; }

    public virtual DbSet<Hotel> Hotels { get; set; }

    public virtual DbSet<HotelAmenity> HotelAmenities { get; set; }

    public virtual DbSet<HotelPaymentSettlement> HotelPaymentSettlements { get; set; }

    public virtual DbSet<Invoice> Invoices { get; set; }

    public virtual DbSet<Media> Media { get; set; }

    public virtual DbSet<PaymentStatus> PaymentStatuses { get; set; }

    public virtual DbSet<PaymentTransaction> PaymentTransactions { get; set; }

    public virtual DbSet<Promotion> Promotions { get; set; }

    public virtual DbSet<Review> Reviews { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<RoomInventory> RoomInventories { get; set; }

    public virtual DbSet<RoomType> RoomTypes { get; set; }

    public virtual DbSet<RoomTypeAmenity> RoomTypeAmenities { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<VwHotelmonthlyrevenue> VwHotelmonthlyrevenues { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    { 
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_unicode_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Amenity>(entity =>
        {
            entity.HasKey(e => e.AmenityId).HasName("PRIMARY");

            entity.ToTable("amenity");

            entity.HasIndex(e => e.Name, "Name").IsUnique();

            entity.Property(e => e.Category).HasMaxLength(100);
            entity.Property(e => e.Name).HasMaxLength(200);
        });

        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.HasKey(e => e.AuditId).HasName("PRIMARY");

            entity.ToTable("audit_log");

            entity.HasIndex(e => new { e.EntityName, e.EntityId }, "IX_Audit_Entity");

            entity.HasIndex(e => e.PerformedBy, "PerformedBy");

            entity.Property(e => e.Action).HasMaxLength(100);
            entity.Property(e => e.EntityId).HasMaxLength(100);
            entity.Property(e => e.EntityName).HasMaxLength(100);
            entity.Property(e => e.PerformedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP(6)")
                .HasColumnType("timestamp(6)");

            entity.HasOne(d => d.PerformedByNavigation).WithMany(p => p.AuditLogs)
                .HasForeignKey(d => d.PerformedBy)
                .HasConstraintName("audit_log_ibfk_1");
        });

        modelBuilder.Entity<Booking>(entity =>
        {
            entity.HasKey(e => e.BookingId).HasName("PRIMARY");

            entity.ToTable("booking");

            entity.HasIndex(e => e.BookingCode, "BookingCode").IsUnique();

            entity.HasIndex(e => new { e.StatusId, e.UpdatedAt }, "IX_BookingStatus_UpdatedAt");

            entity.HasIndex(e => e.CustomerUserId, "IX_Booking_Customer");

            entity.HasIndex(e => e.HotelId, "IX_Booking_Hotel");

            entity.HasIndex(e => e.PromotionId, "fk_booking_promotion");

            entity.Property(e => e.BookingCode).HasMaxLength(50);
            entity.Property(e => e.CommissionAmount).HasPrecision(18, 2);
            entity.Property(e => e.CommissionPct)
                .HasPrecision(5, 2)
                .HasDefaultValueSql("'10.00'");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP(6)")
                .HasColumnType("timestamp(6)");
            entity.Property(e => e.Currency)
                .HasMaxLength(10)
                .HasDefaultValueSql("'VND'");
            entity.Property(e => e.DiscountAmount).HasPrecision(18, 2);
            entity.Property(e => e.Note).HasMaxLength(1000);
            entity.Property(e => e.TotalAmount).HasPrecision(18, 2);
            entity.Property(e => e.UpdatedAt).HasColumnType("timestamp(6)");

            entity.HasOne(d => d.CustomerUser).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.CustomerUserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("booking_ibfk_1");

            entity.HasOne(d => d.Hotel).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.HotelId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("booking_ibfk_2");

            entity.HasOne(d => d.Promotion).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.PromotionId)
                .HasConstraintName("fk_booking_promotion");

            entity.HasOne(d => d.Status).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("booking_ibfk_3");
        });

        modelBuilder.Entity<BookingRoom>(entity =>
        {
            entity.HasKey(e => e.BookingRoomId).HasName("PRIMARY");

            entity.ToTable("booking_room");

            entity.HasIndex(e => e.BookingId, "IX_BookingRoom_Booking");

            entity.HasIndex(e => e.RoomTypeId, "IX_BookingRoom_RoomType");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP(6)")
                .HasColumnType("timestamp(6)");
            entity.Property(e => e.NightlyRate).HasPrecision(18, 2);
            entity.Property(e => e.SubTotal).HasPrecision(18, 2);

            entity.HasOne(d => d.Booking).WithMany(p => p.BookingRooms)
                .HasForeignKey(d => d.BookingId)
                .HasConstraintName("booking_room_ibfk_1");

            entity.HasOne(d => d.RoomType).WithMany(p => p.BookingRooms)
                .HasForeignKey(d => d.RoomTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("booking_room_ibfk_2");
        });

        modelBuilder.Entity<BookingStatus>(entity =>
        {
            entity.HasKey(e => e.BookingStatusId).HasName("PRIMARY");

            entity.ToTable("booking_status");

            entity.Property(e => e.BookingStatusId).ValueGeneratedNever();
            entity.Property(e => e.StatusName).HasMaxLength(50);
        });

        modelBuilder.Entity<Hotel>(entity =>
        {
            entity.HasKey(e => e.HotelId).HasName("PRIMARY");

            entity.ToTable("hotel");

            entity.HasIndex(e => e.City, "IX_Hotel_City");

            entity.HasIndex(e => e.OwnerUserId, "IX_Hotel_Owner");

            entity.Property(e => e.Address).HasMaxLength(500);
            entity.Property(e => e.City).HasMaxLength(150);
            entity.Property(e => e.Country).HasMaxLength(100);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP(6)")
                .HasColumnType("timestamp(6)");
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValueSql("'1'");
            entity.Property(e => e.Latitude).HasPrecision(9, 6);
            entity.Property(e => e.Longitude).HasPrecision(9, 6);
            entity.Property(e => e.Name).HasMaxLength(300);
            entity.Property(e => e.Slug).HasMaxLength(300);
            entity.Property(e => e.UpdatedAt).HasColumnType("timestamp(6)");

            entity.HasOne(d => d.OwnerUser).WithMany(p => p.Hotels)
                .HasForeignKey(d => d.OwnerUserId)
                .HasConstraintName("hotel_ibfk_1");
        });

        modelBuilder.Entity<HotelAmenity>(entity =>
        {
            entity.HasKey(e => e.HotelAmenityId).HasName("PRIMARY");

            entity.ToTable("hotel_amenity");

            entity.HasIndex(e => e.AmenityId, "AmenityId");

            entity.HasIndex(e => new { e.HotelId, e.AmenityId }, "HotelId").IsUnique();

            entity.Property(e => e.AddedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP(6)")
                .HasColumnType("timestamp(6)");

            entity.HasOne(d => d.Amenity).WithMany(p => p.HotelAmenities)
                .HasForeignKey(d => d.AmenityId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("hotel_amenity_ibfk_2");

            entity.HasOne(d => d.Hotel).WithMany(p => p.HotelAmenities)
                .HasForeignKey(d => d.HotelId)
                .HasConstraintName("hotel_amenity_ibfk_1");
        });

        modelBuilder.Entity<HotelPaymentSettlement>(entity =>
        {
            entity.HasKey(e => e.SettlementId).HasName("PRIMARY");

            entity.ToTable("hotel_payment_settlement");

            entity.HasIndex(e => new { e.HotelId, e.PeriodStart, e.PeriodEnd }, "IX_Settlement_Hotel_Period");

            entity.Property(e => e.CommissionAmount).HasPrecision(18, 2);
            entity.Property(e => e.CommissionPct).HasPrecision(5, 2);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP(6)")
                .HasColumnType("timestamp(6)");
            entity.Property(e => e.GrossAmount).HasPrecision(18, 2);
            entity.Property(e => e.PayableToHotel).HasPrecision(18, 2);

            entity.HasOne(d => d.Hotel).WithMany(p => p.HotelPaymentSettlements)
                .HasForeignKey(d => d.HotelId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("hotel_payment_settlement_ibfk_1");
        });

        modelBuilder.Entity<Invoice>(entity =>
        {
            entity.HasKey(e => e.InvoiceId).HasName("PRIMARY");

            entity.ToTable("invoice");

            entity.HasIndex(e => e.BookingId, "IX_Invoice_Booking");

            entity.HasIndex(e => e.InvoiceNumber, "InvoiceNumber").IsUnique();

            entity.Property(e => e.AmountBeforeTax).HasPrecision(18, 2);
            entity.Property(e => e.Currency).HasMaxLength(10);
            entity.Property(e => e.InvoiceNumber).HasMaxLength(100);
            entity.Property(e => e.IssuedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP(6)")
                .HasColumnType("timestamp(6)");
            entity.Property(e => e.TaxAmount).HasPrecision(18, 2);
            entity.Property(e => e.TotalAmount).HasPrecision(18, 2);

            entity.HasOne(d => d.Booking).WithMany(p => p.Invoices)
                .HasForeignKey(d => d.BookingId)
                .HasConstraintName("invoice_ibfk_1");
        });

        modelBuilder.Entity<Media>(entity =>
        {
            entity.HasKey(e => e.MediaId).HasName("PRIMARY");

            entity.ToTable("media");

            entity.HasIndex(e => e.HotelId, "IX_Media_Hotel");

            entity.HasIndex(e => e.RoomTypeId, "IX_Media_RoomType");

            entity.Property(e => e.Caption).HasMaxLength(500);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP(6)")
                .HasColumnType("timestamp(6)");
            entity.Property(e => e.Url).HasMaxLength(1000);

            entity.HasOne(d => d.Hotel).WithMany(p => p.Medias)
                .HasForeignKey(d => d.HotelId)
                .HasConstraintName("media_ibfk_1");

            entity.HasOne(d => d.RoomType).WithMany(p => p.Media)
                .HasForeignKey(d => d.RoomTypeId)
                .HasConstraintName("media_ibfk_2");
        });

        modelBuilder.Entity<PaymentStatus>(entity =>
        {
            entity.HasKey(e => e.PaymentStatusId).HasName("PRIMARY");

            entity.ToTable("payment_status");

            entity.Property(e => e.PaymentStatusId).ValueGeneratedNever();
            entity.Property(e => e.StatusName).HasMaxLength(50);
        });

        modelBuilder.Entity<PaymentTransaction>(entity =>
        {
            entity.HasKey(e => e.PaymentId).HasName("PRIMARY");

            entity.ToTable("payment_transaction");

            entity.HasIndex(e => e.BookingId, "IX_Payment_Booking");

            entity.HasIndex(e => e.StatusId, "StatusId");

            entity.Property(e => e.Amount).HasPrecision(18, 2);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP(6)")
                .HasColumnType("timestamp(6)");
            entity.Property(e => e.Currency).HasMaxLength(10);
            entity.Property(e => e.Note).HasMaxLength(1000);
            entity.Property(e => e.PaidAt).HasColumnType("timestamp(6)");
            entity.Property(e => e.PaymentProvider).HasMaxLength(100);
            entity.Property(e => e.ProviderTxnId).HasMaxLength(200);

            entity.HasOne(d => d.Booking).WithMany(p => p.PaymentTransactions)
                .HasForeignKey(d => d.BookingId)
                .HasConstraintName("payment_transaction_ibfk_1");

            entity.HasOne(d => d.Status).WithMany(p => p.PaymentTransactions)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("payment_transaction_ibfk_2");
        });

        modelBuilder.Entity<Promotion>(entity =>
        {
            entity.HasKey(e => e.PromotionId).HasName("PRIMARY");

            entity.ToTable("promotion");

            entity.HasIndex(e => e.HotelId, "IX_Promotion_Hotel");

            entity.Property(e => e.Code).HasMaxLength(100);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP(6)")
                .HasColumnType("timestamp(6)");
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.DiscountFixed).HasPrecision(18, 2);
            entity.Property(e => e.DiscountPct).HasPrecision(5, 2);
            entity.Property(e => e.EndAt).HasColumnType("timestamp(6)");
            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValueSql("'1'");
            entity.Property(e => e.StartAt).HasColumnType("timestamp(6)");
            entity.Property(e => e.Title).HasMaxLength(300);

            entity.HasOne(d => d.Hotel).WithMany(p => p.Promotions)
                .HasForeignKey(d => d.HotelId)
                .HasConstraintName("promotion_ibfk_1");
        });

        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(e => e.ReviewId).HasName("PRIMARY");

            entity.ToTable("review");

            entity.HasIndex(e => e.BookingId, "BookingId");

            entity.HasIndex(e => e.CustomerUserId, "CustomerUserId");

            entity.HasIndex(e => e.HotelId, "IX_Review_Hotel");

            entity.Property(e => e.Content).HasColumnType("text");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP(6)")
                .HasColumnType("timestamp(6)");
            entity.Property(e => e.IsPublished)
                .IsRequired()
                .HasDefaultValueSql("'1'");
            entity.Property(e => e.Title).HasMaxLength(300);

            entity.HasOne(d => d.Booking).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.BookingId)
                .HasConstraintName("review_ibfk_2");

            entity.HasOne(d => d.CustomerUser).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.CustomerUserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("review_ibfk_3");

            entity.HasOne(d => d.Hotel).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.HotelId)
                .HasConstraintName("review_ibfk_1");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PRIMARY");

            entity.ToTable("role");

            entity.HasIndex(e => e.RoleName, "RoleName").IsUnique();

            entity.Property(e => e.RoleName).HasMaxLength(50);
        });

        modelBuilder.Entity<RoomInventory>(entity =>
        {
            entity.HasKey(e => e.RoomInventoryId).HasName("PRIMARY");

            entity.ToTable("room_inventory");

            entity.HasIndex(e => e.Date, "IX_RoomInventory_Date");

            entity.HasIndex(e => new { e.RoomTypeId, e.Date }, "IX_RoomInventory_RoomType_Date").IsUnique();

            entity.Property(e => e.Currency).HasMaxLength(10);
            entity.Property(e => e.PriceOverride).HasPrecision(18, 2);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP(6)")
                .HasColumnType("timestamp(6)");

            entity.HasOne(d => d.RoomType).WithMany(p => p.RoomInventories)
                .HasForeignKey(d => d.RoomTypeId)
                .HasConstraintName("room_inventory_ibfk_1");
        });

        modelBuilder.Entity<RoomType>(entity =>
        {
            entity.HasKey(e => e.RoomTypeId).HasName("PRIMARY");

            entity.ToTable("room_type");

            entity.HasIndex(e => e.HotelId, "IX_RoomType_Hotel");

            entity.Property(e => e.Code).HasMaxLength(100);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP(6)")
                .HasColumnType("timestamp(6)");
            entity.Property(e => e.Currency)
                .HasMaxLength(10)
                .HasDefaultValueSql("'VND'");
            entity.Property(e => e.DefaultPrice).HasPrecision(18, 2);
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValueSql("'1'");
            entity.Property(e => e.MaxAdults).HasDefaultValueSql("'2'");
            entity.Property(e => e.Name).HasMaxLength(200);
            entity.Property(e => e.TotalRooms).HasDefaultValueSql("'1'");

            entity.HasOne(d => d.Hotel).WithMany(p => p.RoomTypes)
                .HasForeignKey(d => d.HotelId)
                .HasConstraintName("room_type_ibfk_1");
        });

        modelBuilder.Entity<RoomTypeAmenity>(entity =>
        {
            entity.HasKey(e => e.RoomTypeAmenityId).HasName("PRIMARY");

            entity.ToTable("room_type_amenity");

            entity.HasIndex(e => e.AmenityId, "AmenityId");

            entity.HasIndex(e => new { e.RoomTypeId, e.AmenityId }, "RoomTypeId").IsUnique();

            entity.HasOne(d => d.Amenity).WithMany(p => p.RoomTypeAmenities)
                .HasForeignKey(d => d.AmenityId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("room_type_amenity_ibfk_2");

            entity.HasOne(d => d.RoomType).WithMany(p => p.RoomTypeAmenities)
                .HasForeignKey(d => d.RoomTypeId)
                .HasConstraintName("room_type_amenity_ibfk_1");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PRIMARY");

            entity.ToTable("user");

            entity.HasIndex(e => e.Email, "Email").IsUnique();

            entity.HasIndex(e => e.RoleId, "RoleId");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP(6)")
                .HasColumnType("timestamp(6)");
            entity.Property(e => e.Email).HasMaxLength(191);
            entity.Property(e => e.FullName).HasMaxLength(200);
            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValueSql("'1'");
            entity.Property(e => e.PasswordHash).HasMaxLength(512);
            entity.Property(e => e.Phone).HasMaxLength(50);
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("timestamp(6)");

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("user_ibfk_1");
        });

        modelBuilder.Entity<VwHotelmonthlyrevenue>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_hotelmonthlyrevenue");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
