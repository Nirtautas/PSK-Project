﻿using Microsoft.AspNetCore.Authorization;
using WorthBoards.Api.Utils;

namespace Microsoft.Extensions.DependencyInjection
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApiServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<IAuthorizationHandler, PermissionHandler>();

            return services;
        }
    }
}
