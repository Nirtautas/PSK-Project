namespace WorthBoards.Common.Exceptions
{
    public class ErrorDetails
    {
        public int StatusCode { get; set; } = -1;
        public string Title { get; set; } = "An error has occurred.";
        public string? Details { get; set; }
    }
}
