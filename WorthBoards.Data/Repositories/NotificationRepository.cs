using WorthBoards.Data.Repositories.Interfaces;
using WorthBoards.Domain.Entities;
using WorthBoards.Data.Repositories.Base;
using WorthBoards.Data.Database;
using Microsoft.EntityFrameworkCore;

namespace WorthBoards.Data.Repositories
{
    public class NotificationRepository(ApplicationDbContext dbContext) : Repository<Notification>(dbContext), INotificationRepository
    {
        public async Task<List<(Notification, string)>> GetNotificationsAndSenderUsernamesByUserIdAsync(int userId, CancellationToken cancellationToken)
        {
            var notifications = await dbContext.Notifications
                .Where(notification =>
                    notification.NotificationsOnUsers.Any(user => user.UserId == userId)
                ).Select(notification =>
                    new
                    {
                        Notification = notification,
                        SenderName = dbContext.Users.Where(user => user.Id == notification.Id).Select(user => user.UserName).FirstOrDefault(),
                        InvitationData = notification.InvitationData
                    }
                ).ToListAsync(cancellationToken);

            // Cannot use .Select() to return tuple ;(
            var result = new List<(Notification, string)>();
            foreach (var pair in notifications)
            {
                if (pair.InvitationData is not null) {
                    pair.InvitationData.Notification = null;
                    pair.Notification.InvitationData = pair.InvitationData;
                }
                result.Add((pair.Notification, pair.SenderName ?? ""));
            }

            return result;
        }
    }
}