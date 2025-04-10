namespace WorthBoards.Business.Dtos.Requests
{
    public record LinkUserToTaskRequest
    {
        public int UserId { get; init; }
    }
}
