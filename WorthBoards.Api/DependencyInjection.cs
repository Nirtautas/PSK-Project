using Microsoft.AspNetCore.Authorization;
using WorthBoards.Api.Utils;
using WorthBoards.Api.Utils.ExceptionHandler;

namespace Microsoft.Extensions.DependencyInjection
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApiServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddExceptionHandler<GlobalExceptionHandler>();

            services.AddSingleton<IAuthorizationHandler, PermissionHandler>();

            return services;
        }
    }
}
