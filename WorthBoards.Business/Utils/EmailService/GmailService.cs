using Microsoft.Extensions.Options;
using MimeKit;
using MailKit.Net.Smtp;
using WorthBoards.Api.Options;
using WorthBoards.Business.Utils.EmailService.Interfaces;
using WorthBoards.Common.Exceptions.Custom;
using MailKit.Security;

namespace WorthBoards.Business.Utils.EmailService
{
    public class GmailService : IEmailService
    {
        private readonly GmailOptions _options;

        public GmailService(IOptions<GmailOptions> options)
        {
            _options = options.Value;

            if (string.IsNullOrEmpty(_options.Host) || string.IsNullOrEmpty(_options.Email) || string.IsNullOrEmpty(_options.Password))
                throw new ArgumentException("Invalid Gmail configuration");
        }

        public async Task SendEmailAsync(SendEmailRequest sendEmailRequest, CancellationToken cancellationToken)
        {
            var emailMessage = CreateMimeEmailMessage(sendEmailRequest);

            try
            {
                using (var client = new SmtpClient())
                {
                    await client.ConnectAsync(_options.Host, _options.Port, SecureSocketOptions.StartTls, cancellationToken);
                    await client.AuthenticateAsync(_options.Email, _options.Password, cancellationToken);
                    await client.SendAsync(emailMessage, cancellationToken);
                    await client.DisconnectAsync(true, cancellationToken);
                }
            } catch (Exception ex)
            {
                //Log in the future...
                throw new FailedToSendEmail(sendEmailRequest.RecipientEmail);
            }

        }

        private MimeMessage CreateMimeEmailMessage(SendEmailRequest sendEmailRequest)
        {
            var emailMessage = new MimeMessage();

            emailMessage.From.Add(new MailboxAddress(_options.Name, _options.Email));
            emailMessage.To.Add(new MailboxAddress(sendEmailRequest.RecipientName, sendEmailRequest.RecipientEmail));
            emailMessage.Subject = sendEmailRequest.Subject;

            //Can create custom templates later if needed...
            var htmlBody = $@"
                <html>
                    <body style='background-color: #000000; color: #ffffff; font-family: Arial, sans-serif; padding: 20px;'>
                        <h1 style='color: #ffffff;'>Hello, {sendEmailRequest.RecipientName}!</h1>
                        <p>{sendEmailRequest.Body}</p>
                        <hr style='border-color: #444;' />
                        <small>This is an automated message from {_options.Name}.</small>
                    </body>
                </html>";

            emailMessage.Body = new TextPart("html")
            {
                Text = htmlBody
            };

            return emailMessage;
        }
    }
}
