namespace WorthBoards.Business.Dtos.Responses
{
    public record LinkUserToTaskResponse
    {
        public int UserId { get; set; }

        public DateTime AssignedAt { get; set; }
    }
}
