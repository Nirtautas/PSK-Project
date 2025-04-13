using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using WorthBoards.Common.Enums;

namespace WorthBoards.Domain.Entities
{
    [Table("BoardsOnUsers")]
    [PrimaryKey(nameof(BoardId), nameof(UserId))]
    public class BoardOnUser
    {
        public int BoardId { get; set; }
        public int UserId { get; set; }
        public DateTime AddedAt { get; set; }
        public required UserRoleEnum UserRole { get; set; }

        //Navigation properties
        public virtual Board Board { get; set; }

        // Concurrency token
        public byte[]? Version { get; set; }
    }
}
