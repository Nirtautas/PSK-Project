using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace WorthBoards.Domain.Entities
{
    [Table("NotificationsOnUsers")]
    [PrimaryKey(nameof(NotificationId), nameof(UserId))]
    public class NotificationOnUser
    {
        public int NotificationId { get; set; }
        public int UserId { get; set; }

        //Navigation properties
        public virtual Notification Notification { get; set; }

        // Concurrency token
        public required byte[] RowVersion { get; set; }
    }
}
