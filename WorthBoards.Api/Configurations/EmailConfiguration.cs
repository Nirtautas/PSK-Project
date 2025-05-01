using WorthBoards.Api.Options;

namespace WorthBoards.Api.Configurations
{
    public static class EmailConfiguration
    {
        public static WebApplicationBuilder ConfigureGmail(this WebApplicationBuilder builder)
        {
            builder.Services.Configure<GmailOptions>(
                builder.Configuration.GetSection(GmailOptions.GmailOptionsKey)
                );

            return builder;
        }
    }
}
