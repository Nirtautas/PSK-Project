using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using WorthBoards.Business.Utils.EmailService.Interfaces;
using WorthBoards.Business.Utils.EmailService.Services;

namespace WorthBoards.Business.Utils.EmailService
{
    public class EmailContextService : IEmailService
    {
        private readonly IServiceProvider _provider;
        private readonly IConfiguration _configuration;

        public EmailContextService(IServiceProvider provider, IConfiguration configuration)
        {
            _provider = provider;
            _configuration = configuration;
        }

        public Task SendEmailAsync(SendEmailRequest sendEmailRequest, CancellationToken cancellationToken)
        {
            var providerKey = _configuration["Email:Provider"] ?? "Gmail";
            IEmailService strategy = providerKey switch
            {
                "Gmail" => _provider.GetRequiredService<GmailServiceStrategy>(),
                "Outlook" => _provider.GetRequiredService<OutlookServiceStrategy>(),
                _ => throw new NotImplementedException($"Email provider '{providerKey}' is not supported")
            };

            return strategy.SendEmailAsync(sendEmailRequest, cancellationToken);
        }
    }
}
