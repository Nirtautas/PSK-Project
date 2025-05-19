using Microsoft.Extensions.Configuration;
using WorthBoards.Business.AutoMapper;
using WorthBoards.Business.Services;
using WorthBoards.Business.Services.Interfaces;
using WorthBoards.Business.Utils.Interfaces;
using WorthBoards.Business.Utils;
using WorthBoards.Business.Utils.EmailService.Services;
using WorthBoards.Business.Utils.EmailService.Decorators;
using WorthBoards.Business.Utils.EmailService.Interfaces;
using WorthBoards.Business.Utils.EmailService;

namespace Microsoft.Extensions.DependencyInjection
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddBusinessServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddAutoMapper(typeof(MappingProfile));

            // TODO: Add global user roles
            //services.AddScoped<IClaimsTransformation, ClaimsTransformation>();

            services.AddScoped<IEmailService, EmailContextService>();

            services
                .AddScoped<GmailServiceStrategy>()
                .AddScoped<OutlookServiceStrategy>()
                .AddScoped<IAuthService, AuthService>()
                .AddScoped<IBoardService, BoardService>()
                .AddScoped<ITokenGenerator, TokenGenerator>()
                .AddScoped<IBoardTaskService, BoardTaskService>()
                .AddScoped<IBoardService, BoardService>()
                .AddScoped<ICommentService, CommentService>()
                .AddScoped<IBoardOnUserService, BoardOnUserService>()
                .AddScoped<ITaskOnUserService, TaskOnUserService>()
                .AddScoped<INotificationService, NotificationService>()
                .AddScoped<IUserService, UserService>()
                .AddScoped<IFileService, FileService>();

            services.Decorate<IEmailService, EmailLoggingDecorator>();

            return services;
        }
    }
}
