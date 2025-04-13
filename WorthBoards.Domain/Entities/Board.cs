using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WorthBoards.Domain.Entities
{
    [Table("Boards")]
    public class Board
    {
        [Key]
        public int Id { get; set; }

        [MaxLength(100)]
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required string ImageURL { get; set; }
        public DateTime CreationDate { get; set; }

        //Navigation properties
        public virtual ICollection<BoardTask> BoardTasks { get; set; }
        public virtual ICollection<BoardOnUser> BoardUsers { get; set; }

        // Concurrency token
        public byte[]? Version { get; set; }
    }
}
