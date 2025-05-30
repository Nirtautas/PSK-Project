﻿using Serilog;
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
                    .Filter.ByExcluding(Matching.WithProperty<string>("LogType", p => p == "Http" && p == "Controller"))
                    .WriteTo.File("Logs/General/general.log", rollingInterval: RollingInterval.Hour)

                )
                .WriteTo.Logger(lc => lc
                    .Filter.ByIncludingOnly(Matching.WithProperty<string>("LogType", p => p == "Http"))
                    .WriteTo.File("Logs/Http/http.log", rollingInterval: RollingInterval.Hour)
                )
                .WriteTo.Logger(lc => lc
                    .Filter.ByIncludingOnly(Matching.WithProperty<string>("LogType", p => p == "Controller"))
                    .WriteTo.File("Logs/Controller/controller.log", rollingInterval: RollingInterval.Hour)
                )
                .WriteTo.Logger(lc => lc
                    .Filter.ByIncludingOnly(Matching.WithProperty<string>("LogType", p => p == "Email"))
                    .WriteTo.File("Logs/Email/email.log", rollingInterval: RollingInterval.Hour)
                )
                .WriteTo.Console()
                .CreateLogger();

            builder.Host.UseSerilog();

            return builder;
        }
    }
}
