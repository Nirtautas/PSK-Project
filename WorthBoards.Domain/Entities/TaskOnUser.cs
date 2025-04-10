using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace WorthBoards.Domain.Entities
{
    [Table("TasksOnUsers")]
    [PrimaryKey(nameof(TaskId), nameof(UserId))]
    public class TaskOnUser
    {
        public int TaskId { get; set; }
        public int UserId { get; set; }
        public required DateTime AssignedAt { get; set; }

        //Navigation properties
        public virtual BoardTask BoardTask { get; set; }
    }
}
