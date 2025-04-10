using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace WorthBoards.Domain.Entities
{
    [Table("TasksOnUsers")]
    [PrimaryKey(nameof(BoardTaskId), nameof(UserId))]
    public class TaskOnUser
    {
        public int BoardTaskId { get; set; }
        public int UserId { get; set; }
        public DateTime AssignedAt { get; set; }

        //Navigation properties
        public virtual BoardTask BoardTask { get; set; }
    }
}
