using Microsoft.AspNetCore.Authorization;
using WorthBoards.Common.Enums;

namespace WorthBoards.Api.Utils
{
    public class PermissionRequirement : IAuthorizationRequirement
    {
        public string Role { get; set; }

        public PermissionRequirement(UserRoleEnum role)
        {
            Role = role.ToString();
        }
    }
}
