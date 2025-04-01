using WorthBoards.Common.Enums;
using WorthBoards.Domain.Entities;

namespace WorthBoards.Business.Dtos.Responses
{
    public record NotificationResponse
    {
        public int Id { get; set; }
        public required string SenderUsername { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required DateTime SendDate { get; set; }
        public required NotificationTypeEnum NotificationType { get; set; }

        public virtual InvitationData? InvitationData { get; set; }
    }
}
