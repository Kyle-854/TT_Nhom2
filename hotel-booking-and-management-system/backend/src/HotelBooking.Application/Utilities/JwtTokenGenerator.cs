using HotelBooking.Application.DataTransferObjects.User;
using HotelBooking.Shared;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace HotelBooking.Application.Utilities
{
    public class JwtTokenGenerator
    {
        private readonly JwtSettings _jwtSettings;

        public JwtTokenGenerator(IOptions<JwtSettings> jwtSettings)
        {
            _jwtSettings = jwtSettings.Value;
        }

        public string GenerateToken(UserSummaryDto user)
        {
            SymmetricSecurityKey? key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
            SigningCredentials? credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            List<Claim>? claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.RoleName ?? "User")
            };

            JwtSecurityToken? jwtSecurityToken = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationMinutes),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
        }

        public JwtSettings GetJwtSettings()
        {
            return _jwtSettings;
        }
    }
}
