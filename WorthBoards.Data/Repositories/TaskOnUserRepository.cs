using WorthBoards.Data.Repositories.Interfaces;
using WorthBoards.Data.Repositories.Base;
using WorthBoards.Domain.Entities;
using WorthBoards.Data.Database;

namespace WorthBoards.Data.Repositories
{
    public class TasksOnUserRepository(ApplicationDbContext dbContext) : Repository<TaskOnUser>(dbContext), ITasksOnUserRepository
    {
    }
}