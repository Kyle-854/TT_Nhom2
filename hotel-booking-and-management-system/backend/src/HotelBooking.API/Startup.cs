using HotelBooking.API.Middlewares;
using HotelBooking.Application.Authentication;
using HotelBooking.Application.Interfaces.Repositories;
using HotelBooking.Application.Interfaces.UnitOfWork;
using HotelBooking.Application.Mappings;
using HotelBooking.Application.Services;
using HotelBooking.Infrastructure.Persistence;
using HotelBooking.Infrastructure.Repositories;
using HotelBooking.Infrastructure.UnitOfWork;
using HotelBooking.Shared;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;

namespace HotelBooking.API
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            // Database
            services.AddDbContext<HotelBookingDbContext>(options =>
            options.UseMySql
                (
                    Configuration.GetConnectionString("DefaultConnection"),
                    ServerVersion.AutoDetect(Configuration.GetConnectionString("DefaultConnection"))
                )
            );

            // JwtSettings
            services.Configure<JwtSettings>(Configuration.GetSection("JwtSettings"));

            // EmailSettings
            services.Configure<EmailSettings>(Configuration.GetSection("EmailSettings"));

            // Logging
            services.AddLogging();

            services.AddMemoryCache();

            // Register 
            services.AddAutoMapper(typeof(AmenityProfile).Assembly);
            services.AddAutoMapper(typeof(UserProfile).Assembly);
            services.AddAutoMapper(typeof(HotelProfile).Assembly);
            services.AddAutoMapper(typeof(BookingProfile).Assembly);
            services.AddAutoMapper(typeof(ReviewProfile).Assembly);
            services.AddAutoMapper(typeof(PaymentProfile).Assembly);

            services.AddScoped<JwtTokenGenerator>();

            services.AddScoped<EmailSender>();

            services.AddScoped<AmenityService>();
            services.AddScoped<AuthService>();
            services.AddScoped<BookingService>();
            services.AddScoped<HotelService>();
            services.AddScoped<UserService>();
            services.AddScoped<ReviewService>();
            services.AddScoped<PaymentService>();
            services.AddScoped<SearchService>();

            services.AddScoped<AdminUserService>();
            services.AddScoped<AdminHotelModerationService>();

            services.AddScoped<IUnitOfWork, UnitOfWork>();

            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddScoped<IBookingRepository, BookingRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IHotelRepository, HotelRepository>();
            services.AddScoped<IPromotionRepository, PromotionRepository>();
            services.AddScoped<IReviewRepository, ReviewRepository>();
            services.AddScoped<IRoomTypeRepository, RoomTypeRepository>();
            services.AddScoped<IRoomInventoryRepository, RoomInventoryRepository>();
            services.AddScoped<IPaymentRepository, PaymentRepository>();


            services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
            });

            // JWT Authentication
            JwtSettings? jwtSettings = Configuration.GetSection("JwtSettings").Get<JwtSettings>();
            byte[]? key = Encoding.UTF8.GetBytes(jwtSettings?.SecretKey ?? "%wKaI|<1?GFL({AKMMr,sAH0P77pM{R)K3mCuD?69V|!gWo[;cjw3kJk)+HJZM&bEnPSIj0#(95A+C7FgdnF]7muY>]M_<|=D=jVix|!qmPsB=Adfis*c1(ns(rq6zniC)iQnv-3L]Dv_b{v]Ab%NPswy13<?F=MQPg77A;POW>-5@:1fcV9wP@V@?jmPGhupCa6gFlfYDj5yp(B(rA3.rP;cVl_@;KnYZsC{A&<u6o[V{6_)a^,<Vclct/R4}WuoB9^cXV$<F{K_URoY<rbY4<aE9EO^1b|#HhT,oi>KC,/u^Z?N!cR$E6i!OG5[r/+(jFifWd[(e2!+dJzUoBsb;MtS3Q!MFyHU8M4&I6]{;?dg&l(x5ya9#ftQ0X0bYN-$voV/-TAr-b/fxF,#h?Z]fTy|v)%1!_bX$3_f^ur*3z<2r{.fWm%ToHGx|FklCnC!s|3QTPon=%fq#EDK!4#R]D=&=WINIR=0jF@lT6iV$DCEW5(Rjfcyc}L_:#PyGlQ");

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = jwtSettings.Issuer,
                        ValidAudience = jwtSettings.Audience,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        RoleClaimType = ClaimTypes.Role,
                        NameClaimType = ClaimTypes.Name
                    };
                });

            services.AddAuthorization();

            // Add Swagger/OpenAPI
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("users", new OpenApiInfo { Title = "Users API", Version = "v1" });
                options.SwaggerDoc("admins", new OpenApiInfo { Title = "Admin API", Version = "v1" });

                options.DocInclusionPredicate((doc, api) =>
                {
                    return api.ActionDescriptor.RouteValues.TryGetValue("area", out string? area) && area.Equals(doc, StringComparison.OrdinalIgnoreCase);
                });

                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "Enter JWT token (Bearer {token})",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT"
                });

                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            },
                            Scheme = "bearer",
                            Name = "Bearer",
                            In = ParameterLocation.Header
                        },
                        new List<string>()
                    }
                });
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseErrorHandlerMiddleware();

            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/users/swagger.json", "User API");
                    c.SwaggerEndpoint("/swagger/admins/swagger.json", "Admin API");
                });
            }

            app.UseHttpsRedirection();
            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}

