using Microsoft.AspNetCore.Authorization;
using WorthBoards.Api.Utils;
using WorthBoards.Common.Enums;

namespace WorthBoards.Api.Configurations
{
    public static class AuthorizationConfiguration
    {
        public static WebApplicationBuilder ConfigureAuthorization(this WebApplicationBuilder builder)
        {
            builder.Services.AddAuthorization(options =>
            {
                foreach (UserRoleEnum role in Enum.GetValues(typeof(UserRoleEnum)))
                {
                    AddRolePolicy(options, role);
                }
            });

            return builder;
        }

        private static void AddRolePolicy(AuthorizationOptions options, UserRoleEnum role)
        {
            string roleStr = role.ToString();
            options.AddPolicy(roleStr, policy =>
            {
                policy.Requirements.Add(new PermissionRequirement(role));
            });
        }
    }
}
