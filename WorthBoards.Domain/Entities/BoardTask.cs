﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WorthBoards.Common.Enums;

namespace WorthBoards.Domain.Entities
{
    [Table("Tasks")]
    public class BoardTask
    {
        [Key]
        public int Id { get; set; }
        public required int BoardId { get; set; }
        [MaxLength(30)]
        public required string Title { get; set; }
        public string? Description { get; set; }
        public DateTime? DeadlineEnd { get; set; }
        public DateTime CreationDate { get; set; }
        public required TaskStatusEnum TaskStatus { get; set; }

        //Navigation properties
        public virtual Board Board { get; set; }
        public virtual ICollection<Comment> Comments { get; set; }
        public virtual ICollection<TaskOnUser> TasksOnUsers { get; set; }

        // Concurrency token
        [Timestamp]
        public uint Version { get; set; }
    }
}
