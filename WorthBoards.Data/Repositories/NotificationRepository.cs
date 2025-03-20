using WorthBoards.Data.Repositories.Interfaces;
using WorthBoards.Domain.Entities;
using WorthBoards.Data.Repositories.Base;

namespace WorthBoards.Data.Repositories
{
    public class NotificationRepository(ApplicationDbContext dbContext) : Repository<Notification>(dbContext), INotificationRepository
    {
    }
}