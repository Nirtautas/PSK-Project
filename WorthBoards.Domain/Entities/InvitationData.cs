using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WorthBoards.Domain.Entities
{
    [Table("InvitationData")]
    public class InvitationData
    {
        [Key]
        public int Id { get; set; }
        public required int NotificationId { get; set; }
        public required int BoardId { get; set; }

        //Navigation properties
        public virtual Board Board { get; set; }
        public virtual Notification Notification { get; set; }
    }
}
