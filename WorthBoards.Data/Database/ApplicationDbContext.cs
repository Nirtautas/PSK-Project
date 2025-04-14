using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WorthBoards.Data.Identity;
using WorthBoards.Domain.Entities;

namespace WorthBoards.Data.Database
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : IdentityDbContext<ApplicationUser, ApplicationRole, int>(options)
    {
        //DB Sets
        public DbSet<Board> Boards { get; set; }
        public DbSet<BoardOnUser> BoardOnUsers { get; set; }
        public DbSet<BoardTask> BoardTasks { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<InvitationData> InvatationData { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<NotificationOnUser> NotificationsOnUsers { get; set; }
        public DbSet<TaskOnUser> TasksOnUsers { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            PropertyConfigurationManager.AddConcurrencyTokens(builder);
            Linker.LinkAll(builder);
            base.OnModelCreating(builder);
        }
    }
}