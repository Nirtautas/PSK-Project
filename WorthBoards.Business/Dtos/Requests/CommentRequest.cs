namespace WorthBoards.Business.Dtos.Requests
{
    public record CommentRequest
    {
        public int TaskId { get; set; }
        public int UserId { get; set; }
        public string Content { get; set; }
        public bool Edited { get; set; }
    }
}
