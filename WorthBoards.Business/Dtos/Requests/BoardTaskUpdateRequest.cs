using WorthBoards.Common.Enums;

namespace WorthBoards.Business.Dtos.Requests
{
    public record BoardTaskUpdateRequest
    {
        public string Title { get; set; }
        public string? Description { get; set; }
        public DateTime DeadlineEnd { get; set; }
        public TaskStatusEnum TaskStatus { get; set; }
        public uint Version { get; set; }
    }
}
