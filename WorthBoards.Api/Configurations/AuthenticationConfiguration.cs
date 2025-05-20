using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json;

namespace WorthBoards.Api.Configurations
{
    public static class AuthenticationConfiguration
    {
        public static WebApplicationBuilder ConfigureAuthentication(this WebApplicationBuilder builder)
        {
            var keyValue = TryGetConfigValue(builder.Configuration, "WBJwtKey");
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = TryGetConfigValue(builder.Configuration, "WBIssuer"),
                    ValidAudience = TryGetConfigValue(builder.Configuration, "WBAudience"),
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyValue!)),
                    ClockSkew = TimeSpan.Zero,
                    RequireExpirationTime = true
                };
                options.Events = new JwtBearerEvents
                {
                    OnAuthenticationFailed = async context =>
                    {
                        if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
                        {
                            context.Response.StatusCode = 401;

                            context.Response.ContentType = "application/json";

                            var response = new
                            {
                                status = 401,
                                title = "Token has expired",
                                details = "token_expired"
                            };

                            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
                        }
                    }
                };
            });

            return builder;
        }

        private static string? TryGetConfigValue(IConfiguration configuration, string key)
        {
            var value = configuration[key];

            if (value is null)
            {
                Console.WriteLine($"[ERROR] Missing configuration value for key '{key}'");
                Environment.Exit(1);
            }

            return value;
        }
    }
}
