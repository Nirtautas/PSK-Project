using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WorthBoards.Common.Enums;

namespace WorthBoards.Domain.Entities
{
    [Table("Notifications")]
    public class Notification
    {
        [Key]
        public int Id { get; set; }
        public required int SenderId { get; set; }
        [MaxLength(100)]
        public required string Title { get; set; }
        public required string Description { get; set; }
        public DateTime SendDate { get; set; }
        public required NotificationTypeEnum NotificationType { get; set; }

        //Navigation properties
        public virtual InvitationData? InvitationData { get; set; }
        public virtual ICollection<NotificationOnUser> NotificationsOnUsers { get; set; }
    }
}
