namespace WorthBoards.Api.Options
{
    public record GmailOptions
    {
        public const string GmailOptionsKey = "GmailOptions";

        public required string Host { get; init; }
        public int Port { get; init; }
        public required string Name { get; init; }
        public required string Email { get; init; }
        public required string Password { get; init; }
    }
}
