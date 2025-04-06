using WorthBoards.Data.Repositories.Interfaces;
using WorthBoards.Data.Repositories.Base;
using WorthBoards.Domain.Entities;
using WorthBoards.Data.Database;
using WorthBoards.Data.Identity;

namespace WorthBoards.Data.Repositories
{
    public class TasksOnUserRepository(ApplicationDbContext dbContext) : Repository<TaskOnUser>(dbContext), ITasksOnUserRepository
    {
        public async Task<IEnumerable<ApplicationUser>> GetUsersLinkedToTaskAsync(int taskId, CancellationToken cancellationToken)
        {
            var usersLinkedToTaskQuery = _dbContext.TasksOnUsers
                .Where(taskOnUser => taskOnUser.BoardTaskId == taskId)
                .Join(_dbContext.Users, taskOnUser => taskOnUser.UserId, user => user.Id, (taskOnUser, user) => user);

            return usersLinkedToTaskQuery.ToList();
        }
    }
}