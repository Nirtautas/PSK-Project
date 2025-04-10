using Microsoft.EntityFrameworkCore;
using WorthBoards.Domain.Entities;

namespace WorthBoards.Data.Database;

static class PropertyConfigurationManager {
    public static void AddConcurrencyTokens(ModelBuilder builder) {

            builder.Entity<Board>()
                .Property(b => b.Version)
                .IsRowVersion();

            builder.Entity<BoardOnUser>()
                .Property(bou => bou.Version)
                .IsRowVersion();

            builder.Entity<BoardTask>()
                .Property(t => t.Version)
                .IsRowVersion();

            builder.Entity<Comment>()
                .Property(c => c.Version)
                .IsRowVersion();

    }
}