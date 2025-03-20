using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using WorthBoards.Data.Database;
using WorthBoards.Data.Identity;

namespace Microsoft.Extensions.DependencyInjection
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddDataServices(this IServiceCollection services, IConfiguration configuration)
        {
            //Register stuff for data layer here

            var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL") ?? configuration.GetConnectionString("WorthBoardsConnection");

            services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(connectionString));

            return services;
        }
    }
}
