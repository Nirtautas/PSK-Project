namespace WorthBoards.Business.Dtos.Responses
{
    public record BoardResponse
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string ImageURL { get; set; }
        public DateTime CreationDate { get; set; }
        public uint Version { get; set; }
    }
}
