using WorthBoards.Data.Repositories.Base;
using WorthBoards.Domain.Entities;

namespace WorthBoards.Data.Repositories.Interfaces
{
    public interface INotificationOnUserRepository : IRepository<NotificationOnUser>
    {
        Task AddNotificationToBoardUsers(Notification notification, int boardId, CancellationToken cancellationToken);
        Task AddNotificationToBoardUsers(Notification notification, int boardId, List<int> excludedUserIds, CancellationToken cancellationToken);
    }
}
