﻿using WorthBoards.Data.Repositories.Interfaces;
using WorthBoards.Domain.Entities;
using WorthBoards.Data.Repositories.Base;
using WorthBoards.Data.Database;
using Microsoft.EntityFrameworkCore;

namespace WorthBoards.Data.Repositories
{
    public class NotificationRepository(ApplicationDbContext dbContext) : Repository<Notification>(dbContext), INotificationRepository
    {
        public async Task<List<(Notification, string, string)>> GetNotificationsWithSenderAndSubjectUsernamesByUserIdAsync(int userId, CancellationToken cancellationToken)
        {
            var notifications = await dbContext.Notifications
                .Where(notification =>
                    notification.NotificationsOnUsers.Any(user => user.UserId == userId)
                )
                .Include(n => n.Board)
                .Include(n => n.Task)
                .Select(notification =>
                    new
                    {
                        Notification = notification,
                        SenderName = dbContext.Users.Where(user => user.Id == notification.SenderId).Select(user => user.UserName).FirstOrDefault(),
                        SubjectName = dbContext.Users.Where(user => user.Id == notification.SubjectUserId).Select(user => user.UserName).FirstOrDefault(),
                    }
                ).ToListAsync(cancellationToken);

            // Cannot use .Select() to return tuple ;(
            var result = new List<(Notification, string, string)>();
            foreach (var pair in notifications)
            {
                result.Add((pair.Notification, pair.SenderName ?? "", pair.SubjectName));
            }

            return result;
        }
    }
}