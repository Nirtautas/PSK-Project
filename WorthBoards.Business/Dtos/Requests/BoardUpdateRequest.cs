using WorthBoards.Common.Enums;

namespace WorthBoards.Business.Dtos.Requests
{
    public record BoardUpdateRequest
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string ImageURL { get; set; }
    }
}
