using WorthBoards.Data.Identity;
using WorthBoards.Data.Repositories.Base;
using WorthBoards.Domain.Entities;

namespace WorthBoards.Data.Repositories.Interfaces
{
    public interface ITasksOnUserRepository : IRepository<TaskOnUser>
    {
        Task<IEnumerable<ApplicationUser>> GetUsersLinkedToTaskAsync(int taskId, CancellationToken cancellationToken);
    }
}
