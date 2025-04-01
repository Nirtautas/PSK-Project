using WorthBoards.Data.Repositories.Interfaces;
using WorthBoards.Domain.Entities;
using WorthBoards.Data.Repositories.Base;
using WorthBoards.Data.Database;
using Microsoft.EntityFrameworkCore;

namespace WorthBoards.Data.Repositories
{
    public class NotificationOnUserRepository(ApplicationDbContext dbContext) : Repository<NotificationOnUser>(dbContext), INotificationOnUserRepository
    {
        public async Task AddNotificationToBoardUsers(int notificationId, int boardId, CancellationToken cancellationToken)
        {
            var entries = dbContext.BoardOnUsers
                .Where(boardOnUser => boardOnUser.BoardId == boardId)
                .Select(boardOnUser => new NotificationOnUser()
                    {
                        UserId = boardOnUser.UserId,
                        NotificationId = notificationId
                    }
                );

            await dbContext.NotificationsOnUsers.AddRangeAsync(entries, cancellationToken);
            await dbContext.SaveChangesAsync();
        }
    }
}