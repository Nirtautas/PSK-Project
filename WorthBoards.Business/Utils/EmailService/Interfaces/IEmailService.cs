namespace WorthBoards.Business.Utils.EmailService.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(SendEmailRequest sendEmailRequest, CancellationToken cancellationToken);
    }
}
