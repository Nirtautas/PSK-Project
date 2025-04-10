using Microsoft.EntityFrameworkCore;
using WorthBoards.Domain.Entities;

namespace WorthBoards.Data.Database;

static class PropertyConfigurationManager {
    public static void AddConcurrencyTokens(ModelBuilder builder) {

            builder.Entity<Board>()
                .Property(b => b.RowVersion)
                .IsRowVersion();

            builder.Entity<BoardOnUser>()
                .Property(bou => bou.RowVersion)
                .IsRowVersion();

            builder.Entity<BoardTask>()
                .Property(t => t.RowVersion)
                .IsRowVersion();

            builder.Entity<Comment>()
                .Property(c => c.RowVersion)
                .IsRowVersion();

            builder.Entity<InvitationData>()
                .Property(inv => inv.RowVersion)
                .IsRowVersion();

            builder.Entity<Notification>()
                .Property(n => n.RowVersion)
                .IsRowVersion();

            builder.Entity<NotificationOnUser>()
                .Property(nou => nou.RowVersion)
                .IsRowVersion();

            builder.Entity<TaskOnUser>()
                .Property(tou => tou.RowVersion)
                .IsRowVersion();
    }
}