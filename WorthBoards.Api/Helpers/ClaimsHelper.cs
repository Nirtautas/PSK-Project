using System.Security.Claims;

namespace WorthBoards.Api.Helpers;

public static class ClaimsHelper
{
    public static int GetUserIdFromToken(ClaimsPrincipal user)
    {
        return int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? throw new Exception("User not authenticated."));
    }
}
