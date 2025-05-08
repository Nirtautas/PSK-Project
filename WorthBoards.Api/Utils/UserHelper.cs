using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WorthBoards.Api.Utils
{
    public class UserHelper
    {
        public static ActionResult<int> GetUserId(ClaimsPrincipal user)
        {
            string? userIdString = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int parsedUserId))
            {
                return new UnauthorizedObjectResult("Invalid user ID.");
            }
            return parsedUserId;
        }

        public static string GetUsername(HttpContext context)
        {
            return context.User.Identity?.Name ?? "Anonymous";
        }
    }
}