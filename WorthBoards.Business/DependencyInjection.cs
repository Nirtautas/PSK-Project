using Microsoft.Extensions.Configuration;
using WorthBoards.Business.AutoMapper;
using WorthBoards.Business.Services;
using WorthBoards.Business.Services.Interfaces;
using WorthBoards.Business.Utils.Interfaces;
using WorthBoards.Business.Utils;
using Microsoft.AspNetCore.Authentication;

namespace Microsoft.Extensions.DependencyInjection
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddBusinessServices(this IServiceCollection services, IConfiguration configuration)
        {

            services.AddAutoMapper(typeof(MappingProfile));

            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ITokenGenerator, TokenGenerator>();
            services.AddScoped<IClaimsTransformation, ClaimsTransformation>();

            services.AddScoped<IBoardTaskService, BoardTaskService>();
            services.AddScoped<IBoardService, BoardService>();
            services.AddScoped<ICommentService, CommentService>();

            return services;
        }
    }
}
