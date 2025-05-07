using Serilog;
using Serilog.Filters;

namespace WorthBoards.Api.Configurations
{
    public static class SerilogLoggerConfiguration
    {
        public static WebApplicationBuilder ConfigureLogger(this WebApplicationBuilder builder)
        {
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Information()
                .Enrich.FromLogContext()
                .WriteTo.Logger(lc => lc
                    .Filter.ByExcluding(Matching.WithProperty<string>("LogType", p => p == "Http"))
                    .WriteTo.File("Logs/General/general.log", rollingInterval: RollingInterval.Minute)

                )
                .WriteTo.Logger(lc => lc
                    .Filter.ByIncludingOnly(Matching.WithProperty<string>("LogType", p => p == "Http"))
                    .WriteTo.File("Logs/Http/http.log", rollingInterval: RollingInterval.Minute)
                )
                .WriteTo.Console()
                .CreateLogger();

            builder.Host.UseSerilog();

            return builder;
        }
    }
}
