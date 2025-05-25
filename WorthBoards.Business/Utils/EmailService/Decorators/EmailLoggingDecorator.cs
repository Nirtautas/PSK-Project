using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Serilog.Context;
using WorthBoards.Business.Utils.EmailService.Interfaces;

namespace WorthBoards.Business.Utils.EmailService.Decorators
{
    public class EmailLoggingDecorator : IEmailService
    {
        private readonly IEmailService _emailService;
        private readonly ILogger<EmailLoggingDecorator> _logger;
        private readonly IConfiguration _configuration;
        private readonly bool _enabled;


        public EmailLoggingDecorator(IEmailService emailService, ILogger<EmailLoggingDecorator> logger, IConfiguration configuration)
        {
            _emailService = emailService;
            _logger = logger;
            _configuration = configuration;

            _enabled = _configuration.GetValue<bool>("Email:UseEmailLogging");
        }

        public async Task SendEmailAsync(SendEmailRequest sendEmailRequest, CancellationToken cancellationToken)
        {
            if (!_enabled)
            {
                await _emailService.SendEmailAsync(sendEmailRequest, cancellationToken);
                return;
            }

            using (LogContext.PushProperty("LogType", "Email"))
            {
                _logger.LogInformation(
                    "Sending email to {RecipientName} ({RecipientEmail}) with subject {Subject}",
                    sendEmailRequest.RecipientName,
                    sendEmailRequest.RecipientEmail,
                    sendEmailRequest.Subject);

                try
                {
                    await _emailService.SendEmailAsync(sendEmailRequest, cancellationToken);
                    _logger.LogInformation(
                        "Email sent to {RecipientName} ({RecipientEmail}) with subject {Subject}",
                        sendEmailRequest.RecipientName,
                        sendEmailRequest.RecipientEmail,
                        sendEmailRequest.Subject);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to send email to {RecipientName} ({RecipientEmail}) with subject {Subject}",
                        sendEmailRequest.RecipientName,
                        sendEmailRequest.RecipientEmail,
                        sendEmailRequest.Subject);

                    throw;
                }
            }
        }
    }
}
