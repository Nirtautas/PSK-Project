using WorthBoards.Business.Utils.EmailService.Interfaces;

namespace WorthBoards.Business.Utils.EmailService.Services
{
    //Class to test strategy design pattern
    public class OutlookServiceStrategy : IEmailService
    {
        public Task SendEmailAsync(SendEmailRequest sendEmailRequest, CancellationToken cancellationToken)
        {
            throw new NotImplementedException($"Outlook email provider is not supported yet!");
        }
    }
}
