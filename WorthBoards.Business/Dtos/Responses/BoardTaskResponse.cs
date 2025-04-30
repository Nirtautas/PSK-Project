using WorthBoards.Common.Enums;

namespace WorthBoards.Business.Dtos.Responses
{
    public record BoardTaskResponse
    {
        public int Id { get; set; }
        public int BoardId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime DeadlineEnd { get; set; }
        public DateTime CreationDate { get; set; }
        public TaskStatusEnum TaskStatus { get; set; }
        public uint Version { get; set; }
    }
}
