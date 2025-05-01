namespace WorthBoards.Business.Dtos.Requests
{
    public record CommentUpdateRequest
    {
        public string Content { get; set; }
        public uint Version { get; set; }
    }
}
