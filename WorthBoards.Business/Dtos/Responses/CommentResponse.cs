namespace WorthBoards.Business.Dtos.Responses
{
    public record CommentResponse
    {
        public int Id { get; set; }
        public int TaskId { get; set; }
        public int UserId { get; set; }
        public string Content { get; set; }
        public DateTime CreationDate { get; set; }
        public bool Edited { get; set; }
    }
}
