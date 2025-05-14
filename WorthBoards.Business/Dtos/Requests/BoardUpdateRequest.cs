namespace WorthBoards.Business.Dtos.Requests
{
    public record BoardUpdateRequest
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string ImageName { get; set; }
        public uint Version { get; set; }
    }
}
