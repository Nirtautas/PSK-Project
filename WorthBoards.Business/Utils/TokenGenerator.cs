using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WorthBoards.Business.Utils.Interfaces;

namespace WorthBoards.Business.Utils
{
    public class TokenGenerator(IConfiguration configuration) : ITokenGenerator
    {
        public string GenerateJwtToken(List<Claim> claims)
        {
            var secretKey = configuration["WBJwtKey"];
            var issuer = configuration["WBIssuer"];
            var audience = configuration["WBAudience"];

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var jwtToken = new JwtSecurityToken
            (
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(0.5),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(jwtToken);
        }
    }
}
