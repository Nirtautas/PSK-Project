using WorthBoards.Data.Repositories.Interfaces;
using WorthBoards.Data.Repositories.Base;
using WorthBoards.Domain.Entities;
using WorthBoards.Data.Database;
using WorthBoards.Data.Identity;
using System.Threading;
using Microsoft.EntityFrameworkCore;

namespace WorthBoards.Data.Repositories
{
    public class TasksOnUserRepository(ApplicationDbContext dbContext) : Repository<TaskOnUser>(dbContext), ITasksOnUserRepository
    {
        public async Task<IEnumerable<Tuple<TaskOnUser, ApplicationUser>>> GetUsersLinkedToTaskAsync(int taskId, CancellationToken cancellationToken)
        {
            var usersLinkedToTaskQuery = _dbContext.TasksOnUsers
                .Where(taskOnUser => taskOnUser.BoardTaskId == taskId)
                .Join(_dbContext.Users,
                    taskOnUser => taskOnUser.UserId,
                    user => user.Id,
                    (taskOnUser, user) => Tuple.Create(taskOnUser, user)
                );

            return await usersLinkedToTaskQuery.ToListAsync(cancellationToken);
        }
    }
}