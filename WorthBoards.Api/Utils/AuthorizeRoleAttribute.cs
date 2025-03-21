using Microsoft.AspNetCore.Authorization;
using WorthBoards.Common.Enums;

namespace WorthBoards.Api.Utils
{
    public class AuthorizeRoleAttribute : AuthorizeAttribute
    {
        public AuthorizeRoleAttribute(UserRoleEnum role)
        {
            Policy = role.ToString();
        }
    }
}
