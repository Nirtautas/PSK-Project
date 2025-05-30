﻿using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.FileProviders;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using WorthBoards.Data.Database;
using WorthBoards.Data.Identity;
using WorthBoards.Data.Repositories.Interfaces;
using WorthBoards.Data.Repositories;
using WorthBoards.Common.Constrants;

namespace Microsoft.Extensions.DependencyInjection
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddDataServices(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionStrAttempted = Environment.GetEnvironmentVariable("DATABASE_URL");
            var connectionString = connectionStrAttempted is null || connectionStrAttempted.Equals("")
                ? configuration.GetConnectionString("WorthBoardsConnection")
                : Environment.GetEnvironmentVariable("DATABASE_URL");

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(connectionString, npgsqlOptions => npgsqlOptions.MigrationsAssembly("WorthBoards.Data")));

            services.AddIdentityCore<ApplicationUser>(options =>
            {
                // Password settings.
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequireUppercase = true;
                options.Password.RequiredLength = 8;
                options.Password.RequiredUniqueChars = 1;

                // Lockout settings.
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.AllowedForNewUsers = true;

                // User settings.
                options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
                options.User.RequireUniqueEmail = true;
            })
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddSignInManager<SignInManager<ApplicationUser>>()
                .AddDefaultTokenProviders();

            services
                .AddScoped<IBoardRepository, BoardRepository>()
                .AddScoped<IBoardTaskRepository, BoardTaskRepository>()
                .AddScoped<ICommentRepository, CommentRepository>()
                .AddScoped<INotificationRepository, NotificationRepository>()
                .AddScoped<ITasksOnUserRepository, TasksOnUserRepository>()
                .AddScoped<IUnitOfWork, UnitOfWork>()
                .AddScoped<IBoardOnUserRepository, BoardOnUserRepository>()
                .AddScoped<INotificationOnUserRepository, NotificationOnUserRepository>()
                .AddScoped<IUserRepository, UserRepository>();

            return services;
        }

        public static IApplicationBuilder ConfigureStaticImages(this IApplicationBuilder app)
        {
            var staticFilesDir = ImageFiles.STATIC_IMAGE_DIR;
            if (!Directory.Exists(staticFilesDir))
            {
                Directory.CreateDirectory(staticFilesDir);
            }

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(staticFilesDir),
                RequestPath = ImageFiles.STATIC_IMAGE_REQUEST_PATH
            });
            return app;
        }
    }
}
