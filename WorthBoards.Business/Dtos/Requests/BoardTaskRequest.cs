using WorthBoards.Common.Enums;

namespace WorthBoards.Business.Dtos.Requests
{
    public record BoardTaskRequest
    {
        public string Title { get; set; }
        public string? Description { get; set; }
        public DateTime? DeadlineEnd { get; set; }
        public TaskStatusEnum TaskStatus { get; set; }
    }
}
