using WorthBoards.Data.Repositories.Interfaces;
using WorthBoards.Domain.Entities;
using WorthBoards.Data.Repositories.Base;

namespace WorthBoards.Data.Repositories
{
    public class TaskRepository(ApplicationDbContext dbContext) : Repository<Task>(dbContext), ITaskRepository
    {
    }
}