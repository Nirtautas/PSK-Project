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
            var entries = await dbContext.BoardOnUsers
                .Where(boardOnUser => boardOnUser.BoardId == boardId)
                .Select(boardOnUser => boardOnUser.UserId)
                .ToListAsync(cancellationToken);

            LinkNotificationToUsers(notification, entries);
        }

        public async Task AddNotificationToBoardUsers(Notification notification, int boardId, List<int> excludedUserIds, CancellationToken cancellationToken)
        {
            var entries = await dbContext.BoardOnUsers
                .Where(boardOnUser => boardOnUser.BoardId == boardId && !excludedUserIds.Contains(boardOnUser.UserId))
                .Select(boardOnUser => boardOnUser.UserId)
                .ToListAsync(cancellationToken);

            LinkNotificationToUsers(notification, entries);
        }

        private static void LinkNotificationToUsers(Notification notification, List<int> userIds)
        {
            notification.NotificationsOnUsers = userIds.Select(userId => new NotificationOnUser()
            {
                NotificationId = notification.Id,
                UserId = userId
            }).ToList();
        }
    }
}