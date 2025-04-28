using WorthBoards.Common.Enums;
using WorthBoards.Domain.Entities;

namespace WorthBoards.Business.Dtos.Responses
{
    public record NotificationResponse
    {
        public int Id { get; set; }

        public DateTime SendDate { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }

        public int? TaskId { get; set; }

        public int? BoardId { get; set; }

        public NotificationEventTypeEnum Type { get; set; }
    }
}
