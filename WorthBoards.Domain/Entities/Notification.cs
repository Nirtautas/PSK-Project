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

        public DateTime SendDate { get; set; }

        public required NotificationEventTypeEnum NotificationType { get; set; }

        // Event type derived properties
        public UserRoleEnum? InvitationRole { get; set; }
        public int? SubjectUserId { get; set; }
        public int? BoardId { get; set; }
        public int? TaskId { get; set; }
        public TaskStatusEnum OldTaskStatus { get; set; }
        public TaskStatusEnum NewTaskStatus { get; set; }
        

        //Navigation properties
        public virtual ICollection<NotificationOnUser> NotificationsOnUsers { get; set; }
        public virtual Board Board { get; set;}
        public virtual BoardTask Task { get; set;}
    }
}
