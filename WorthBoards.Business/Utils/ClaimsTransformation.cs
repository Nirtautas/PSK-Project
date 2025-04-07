using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WorthBoards.Data.Database;

namespace WorthBoards.Business.Utils
{
    // TODO: Add global user roles
    public class ClaimsTransformation(ApplicationDbContext context) : IClaimsTransformation
    {
        public async Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
        {
            var identity = principal.Identity as ClaimsIdentity;
            if (identity == null || !identity.IsAuthenticated)
                return principal;

            var userId = identity.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return principal;

            // Remove old board claims
            var existingClaims = identity.FindAll("BoardPermission").ToList();
            foreach (var claim in existingClaims)
            {
                identity.RemoveClaim(claim);
            }

            // Fetch latest board roles from database
            var boardRoles = await context.BoardOnUsers
                .Where(bu => bu.UserId == int.Parse(userId))
                .Select(bu => new Claim("BoardPermission", $"{bu.BoardId}:{bu.UserRole}"))
                .ToListAsync();

            identity.AddClaims(boardRoles);

            return principal;
        }
    }
}
