using WorthBoards.Data.Repositories.Base;
using WorthBoards.Domain.Entities;

namespace WorthBoards.Data.Repositories.Interfaces
{
    public interface INotificationOnUserRepository : IRepository<NotificationOnUser>
    {
        Task AddNotificationToBoardUsers(int notificationId, int boardId, CancellationToken cancellationToken);
    }
}
