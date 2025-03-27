namespace WorthBoards.Business.Dtos.Requests
{
    public record BoardRequest
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string ImageURL { get; set; }
    }
}
