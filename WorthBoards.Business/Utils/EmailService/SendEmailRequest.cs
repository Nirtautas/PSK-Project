namespace WorthBoards.Business.Utils.EmailService
{
    public record SendEmailRequest
    {
        public string RecipientName { get; init; } = "User";
        public required string RecipientEmail { get; init; }
        public required string Subject { get; init; }
        public required string Body { get; init; }
    }
}
