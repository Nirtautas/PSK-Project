using WorthBoards.Data.Repositories.Interfaces;
using WorthBoards.Domain.Entities;
using WorthBoards.Data.Repositories.Base;
using WorthBoards.Data.Database;
using Microsoft.EntityFrameworkCore;

namespace WorthBoards.Data.Repositories
{
    public class NotificationOnUserRepository(ApplicationDbContext dbContext) : Repository<NotificationOnUser>(dbContext), INotificationOnUserRepository
    {
        public async Task AddNotificationToBoardUsers(Notification notification, int boardId, CancellationToken cancellationToken)
        {
            var entries = dbContext.BoardOnUsers
                .Where(boardOnUser => boardOnUser.BoardId == boardId)
                .Select(boardOnUser => boardOnUser.UserId)
                .ToList();

            notification.NotificationsOnUsers = entries.Select(userId => new NotificationOnUser()
            {
                NotificationId = notification.Id,
                UserId = userId
            }).ToList();

            // await dbContext.NotificationsOnUsers.AddRangeAsync(entries, cancellationToken);
        }
    }
}