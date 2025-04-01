using WorthBoards.Data.Repositories.Interfaces;
using WorthBoards.Domain.Entities;
using WorthBoards.Data.Repositories.Base;
using WorthBoards.Data.Database;

namespace WorthBoards.Data.Repositories
{
    public class NotificationOnUserRepository(ApplicationDbContext dbContext) : Repository<NotificationOnUser>(dbContext), INotificationOnUserRepository
    {
    }   
}