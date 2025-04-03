using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WorthBoards.Domain.Entities
{
    [Table("Comments")]
    public class Comment
    {
        [Key]
        public int Id { get; set; }
        public required int TaskId { get; set; }
        public required int UserId { get; set; }
        public required string Content { get; set; }
        public required DateTime CreationDate { get; set; }
        public required bool Edited { get; set; }

        //Navigation properties
        public virtual BoardTask BoardTask { get; set; }

        // Concurrency token
        public required byte[] RowVersion { get; set; }
    }
}
