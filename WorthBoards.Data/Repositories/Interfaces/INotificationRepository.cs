using WorthBoards.Data.Repositories.Base;
using WorthBoards.Domain.Entities;

namespace WorthBoards.Data.Repositories.Interfaces
{
    public interface INotificationRepository : IRepository<Notification>
    {
        Task<List<(Notification, string, string)>> GetNotificationsWithSenderAndSubjectUsernamesByUserIdAsync(int userId, CancellationToken cancellationToken);
    }
}
