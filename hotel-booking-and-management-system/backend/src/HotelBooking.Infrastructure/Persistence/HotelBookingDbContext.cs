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

    public virtual DbSet<VwHotelMonthlyRevenue> VwHotelMonthlyRevenues { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured) { }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Amenity>(entity =>
        {
            entity.HasKey(e => e.AmenityId).HasName("PK__Amenity__842AF50BDF3D2FFD");

            entity.ToTable("Amenity");

            entity.HasIndex(e => e.Name, "UQ__Amenity__737584F633BFB1BE").IsUnique();

            entity.Property(e => e.Category).HasMaxLength(100);
            entity.Property(e => e.Name).HasMaxLength(200);
        });

        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.HasKey(e => e.AuditId).HasName("PK__AuditLog__A17F2398D0D4F53A");

            entity.ToTable("AuditLog");

            entity.HasIndex(e => new { e.EntityName, e.EntityId }, "IX_Audit_Entity");

            entity.Property(e => e.Action).HasMaxLength(100);
            entity.Property(e => e.EntityId).HasMaxLength(200);
            entity.Property(e => e.EntityName).HasMaxLength(200);

            entity.HasOne(d => d.PerformedByNavigation).WithMany(p => p.AuditLogs)
                .HasForeignKey(d => d.PerformedBy)
                .HasConstraintName("FK__AuditLog__Perfor__1332DBDC");
        });

        modelBuilder.Entity<Booking>(entity =>
        {
            entity.HasKey(e => e.BookingId).HasName("PK__Booking__73951AED517A4C80");

            entity.ToTable("Booking", tb => tb.HasTrigger("trg_Booking_UpdateTimestamp"));

            entity.HasIndex(e => new { e.StatusId, e.UpdatedAt }, "IX_BookingStatus_UpdatedAt");

            entity.HasIndex(e => e.CustomerUserId, "IX_Booking_Customer");

            entity.HasIndex(e => e.HotelId, "IX_Booking_Hotel");

            entity.HasIndex(e => e.BookingCode, "UQ__Booking__C6E56BD599EA8541").IsUnique();

            entity.Property(e => e.BookingCode).HasMaxLength(50);
            entity.Property(e => e.CommissionAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.CommissionPct).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.Currency).HasMaxLength(10);
            entity.Property(e => e.Note).HasMaxLength(1000);
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.CustomerUser).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.CustomerUserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Booking__Custome__6B24EA82");

            entity.HasOne(d => d.Hotel).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.HotelId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Booking__HotelId__6C190EBB");

            entity.HasOne(d => d.Status).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Booking__StatusI__6FE99F9F");
        });

        modelBuilder.Entity<BookingRoom>(entity =>
        {
            entity.HasKey(e => e.BookingRoomId).HasName("PK__BookingR__86A90CE9458968E5");

            entity.ToTable("BookingRoom");

            entity.HasIndex(e => e.BookingId, "IX_BookingRoom_Booking");

            entity.HasIndex(e => e.RoomTypeId, "IX_BookingRoom_RoomType");

            entity.Property(e => e.NightlyRate).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.SubTotal).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Booking).WithMany(p => p.BookingRooms)
                .HasForeignKey(d => d.BookingId)
                .HasConstraintName("FK__BookingRo__Booki__73BA3083");

            entity.HasOne(d => d.RoomType).WithMany(p => p.BookingRooms)
                .HasForeignKey(d => d.RoomTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__BookingRo__RoomT__74AE54BC");
        });

        modelBuilder.Entity<BookingStatus>(entity =>
        {
            entity.HasKey(e => e.BookingStatusId).HasName("PK__BookingS__54F9C05D0F61D2D5");

            entity.ToTable("BookingStatus");

            entity.Property(e => e.StatusName).HasMaxLength(50);
        });

        modelBuilder.Entity<Hotel>(entity =>
        {
            entity.HasKey(e => e.HotelId).HasName("PK__Hotel__46023BDF440329AB");

            entity.ToTable("Hotel");

            entity.HasIndex(e => e.City, "IX_Hotel_City");

            entity.HasIndex(e => e.OwnerUserId, "IX_Hotel_Owner");

            entity.Property(e => e.Address).HasMaxLength(500);
            entity.Property(e => e.City).HasMaxLength(150);
            entity.Property(e => e.Country).HasMaxLength(100);
            entity.Property(e => e.Latitude).HasColumnType("decimal(9, 6)");
            entity.Property(e => e.Longitude).HasColumnType("decimal(9, 6)");
            entity.Property(e => e.Name).HasMaxLength(300);
            entity.Property(e => e.Slug).HasMaxLength(300);

            entity.HasOne(d => d.OwnerUser).WithMany(p => p.Hotels)
                .HasForeignKey(d => d.OwnerUserId)
                .HasConstraintName("FK__Hotel__OwnerUser__440B1D61");
        });

        modelBuilder.Entity<HotelAmenity>(entity =>
        {
            entity.HasKey(e => e.HotelAmenityId).HasName("PK__HotelAme__D63FF89E3381DDD1");

            entity.ToTable("HotelAmenity");

            entity.HasIndex(e => new { e.HotelId, e.AmenityId }, "UQ__HotelAme__EE40948E331700F6").IsUnique();

            entity.HasOne(d => d.Amenity).WithMany(p => p.HotelAmenities)
                .HasForeignKey(d => d.AmenityId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__HotelAmen__Ameni__5629CD9C");

            entity.HasOne(d => d.Hotel).WithMany(p => p.HotelAmenities)
                .HasForeignKey(d => d.HotelId)
                .HasConstraintName("FK__HotelAmen__Hotel__5535A963");
        });

        modelBuilder.Entity<HotelPaymentSettlement>(entity =>
        {
            entity.HasKey(e => e.SettlementId).HasName("PK__HotelPay__7712545A05FCA20D");

            entity.ToTable("HotelPaymentSettlement");

            entity.HasIndex(e => new { e.HotelId, e.PeriodStart, e.PeriodEnd }, "IX_Settlement_Hotel_Period");

            entity.Property(e => e.CommissionAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.CommissionPct).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.GrossAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.PayableToHotel).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Hotel).WithMany(p => p.HotelPaymentSettlements)
                .HasForeignKey(d => d.HotelId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__HotelPaym__Hotel__0F624AF8");
        });

        modelBuilder.Entity<Invoice>(entity =>
        {
            entity.HasKey(e => e.InvoiceId).HasName("PK__Invoice__D796AAB523DBD61E");

            entity.ToTable("Invoice");

            entity.HasIndex(e => e.BookingId, "IX_Invoice_Booking");

            entity.HasIndex(e => e.InvoiceNumber, "UQ__Invoice__D776E981873987EC").IsUnique();

            entity.Property(e => e.AmountBeforeTax).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Currency).HasMaxLength(10);
            entity.Property(e => e.InvoiceNumber).HasMaxLength(100);
            entity.Property(e => e.TaxAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Booking).WithMany(p => p.Invoices)
                .HasForeignKey(d => d.BookingId)
                .HasConstraintName("FK__Invoice__Booking__7E37BEF6");
        });

        modelBuilder.Entity<Media>(entity =>
        {
            entity.HasKey(e => e.MediaId).HasName("PK__Media__B2C2B5CF219F2500");

            entity.HasIndex(e => e.HotelId, "IX_Media_Hotel");

            entity.HasIndex(e => e.RoomTypeId, "IX_Media_RoomType");

            entity.Property(e => e.Caption).HasMaxLength(500);
            entity.Property(e => e.Url).HasMaxLength(1000);

            entity.HasOne(d => d.Hotel).WithMany(p => p.Medias)
                .HasForeignKey(d => d.HotelId)
                .HasConstraintName("FK__Media__HotelId__5EBF139D");

            entity.HasOne(d => d.RoomType).WithMany(p => p.Media)
                .HasForeignKey(d => d.RoomTypeId)
                .HasConstraintName("FK__Media__RoomTypeI__5FB337D6");
        });

        modelBuilder.Entity<PaymentStatus>(entity =>
        {
            entity.HasKey(e => e.PaymentStatusId).HasName("PK__PaymentS__34F8AC3F1B8005CC");

            entity.ToTable("PaymentStatus");

            entity.Property(e => e.StatusName).HasMaxLength(50);
        });

        modelBuilder.Entity<PaymentTransaction>(entity =>
        {
            entity.HasKey(e => e.PaymentId).HasName("PK__PaymentT__9B556A38326413E9");

            entity.ToTable("PaymentTransaction");

            entity.HasIndex(e => e.BookingId, "IX_Payment_Booking");

            entity.Property(e => e.Amount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Currency).HasMaxLength(10);
            entity.Property(e => e.Note).HasMaxLength(1000);
            entity.Property(e => e.PaymentProvider).HasMaxLength(100);
            entity.Property(e => e.ProviderTxnId).HasMaxLength(200);

            entity.HasOne(d => d.Booking).WithMany(p => p.PaymentTransactions)
                .HasForeignKey(d => d.BookingId)
                .HasConstraintName("FK__PaymentTr__Booki__787EE5A0");

            entity.HasOne(d => d.Status).WithMany(p => p.PaymentTransactions)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PaymentTr__Statu__797309D9");
        });

        modelBuilder.Entity<Promotion>(entity =>
        {
            entity.HasKey(e => e.PromotionId).HasName("PK__Promotio__52C42FCF9DEABFB1");

            entity.ToTable("Promotion");

            entity.HasIndex(e => e.HotelId, "IX_Promotion_Hotel");

            entity.Property(e => e.Code).HasMaxLength(100);
            entity.Property(e => e.DiscountFixed).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.DiscountPct).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.Title).HasMaxLength(300);

            entity.HasOne(d => d.Hotel).WithMany(p => p.Promotions)
                .HasForeignKey(d => d.HotelId)
                .HasConstraintName("FK__Promotion__Hotel__0A9D95DB");
        });

        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(e => e.ReviewId).HasName("PK__Review__74BC79CE435A6808");

            entity.ToTable("Review");

            entity.HasIndex(e => e.HotelId, "IX_Review_Hotel");

            entity.Property(e => e.Title).HasMaxLength(300);

            entity.HasOne(d => d.Booking).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.BookingId)
                .HasConstraintName("FK__Review__BookingI__03F0984C");

            entity.HasOne(d => d.CustomerUser).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.CustomerUserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Review__Customer__04E4BC85");

            entity.HasOne(d => d.Hotel).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.HotelId)
                .HasConstraintName("FK__Review__HotelId__02FC7413");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__Role__8AFACE1A1205BFF6");

            entity.ToTable("Role");

            entity.HasIndex(e => e.RoleName, "UQ__Role__8A2B61600F715DB3").IsUnique();

            entity.Property(e => e.RoleId).ValueGeneratedOnAdd();
            entity.Property(e => e.RoleName).HasMaxLength(50);
        });

        modelBuilder.Entity<RoomInventory>(entity =>
        {
            entity.HasKey(e => e.RoomInventoryId).HasName("PK__RoomInve__FB645578167E7894");

            entity.ToTable("RoomInventory");

            entity.HasIndex(e => e.Date, "IX_RoomInventory_Date");

            entity.HasIndex(e => new { e.RoomTypeId, e.Date }, "IX_RoomInventory_RoomType_Date");

            entity.HasIndex(e => new { e.RoomTypeId, e.Date }, "UQ__RoomInve__CBBB11E02E6E11B9").IsUnique();

            entity.Property(e => e.Currency).HasMaxLength(10);
            entity.Property(e => e.PriceOverride).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.RoomType).WithMany(p => p.RoomInventories)
                .HasForeignKey(d => d.RoomTypeId)
                .HasConstraintName("FK__RoomInven__RoomT__66603565");
        });

        modelBuilder.Entity<RoomType>(entity =>
        {
            entity.HasKey(e => e.RoomTypeId).HasName("PK__RoomType__BCC8963134F8E1CF");

            entity.ToTable("RoomType");

            entity.HasIndex(e => e.HotelId, "IX_RoomType_Hotel");

            entity.Property(e => e.Code).HasMaxLength(100);
            entity.Property(e => e.Currency).HasMaxLength(10);
            entity.Property(e => e.DefaultPrice).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Name).HasMaxLength(200);

            entity.HasOne(d => d.Hotel).WithMany(p => p.RoomTypes)
                .HasForeignKey(d => d.HotelId)
                .HasConstraintName("FK__RoomType__HotelI__48CFD27E");
        });

        modelBuilder.Entity<RoomTypeAmenity>(entity =>
        {
            entity.HasKey(e => e.RoomTypeAmenityId).HasName("PK__RoomType__A2C9AC411E6EA8C9");

            entity.ToTable("RoomTypeAmenity");

            entity.HasIndex(e => new { e.RoomTypeId, e.AmenityId }, "UQ__RoomType__148A3960951D30E5").IsUnique();

            entity.HasOne(d => d.Amenity).WithMany(p => p.RoomTypeAmenities)
                .HasForeignKey(d => d.AmenityId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__RoomTypeA__Ameni__5BE2A6F2");

            entity.HasOne(d => d.RoomType).WithMany(p => p.RoomTypeAmenities)
                .HasForeignKey(d => d.RoomTypeId)
                .HasConstraintName("FK__RoomTypeA__RoomT__5AEE82B9");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__User__1788CC4C3C1C17A5");

            entity.ToTable("User");

            entity.HasIndex(e => e.Email, "IX_User_Email");

            entity.HasIndex(e => e.Email, "UQ__User__A9D10534C904CEBF").IsUnique();

            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.FullName).HasMaxLength(200);
            entity.Property(e => e.PasswordHash).HasMaxLength(512);
            entity.Property(e => e.Phone).HasMaxLength(50);

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__User__RoleId__3F466844");
        });

        modelBuilder.Entity<VwHotelMonthlyRevenue>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_HotelMonthlyRevenue");

            entity.Property(e => e.HotelName).HasMaxLength(300);
            entity.Property(e => e.TotalPaid).HasColumnType("decimal(38, 2)");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
