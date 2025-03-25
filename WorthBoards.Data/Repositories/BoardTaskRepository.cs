using WorthBoards.Data.Database;
using WorthBoards.Data.Repositories.Base;
using WorthBoards.Data.Repositories.Interfaces;
using WorthBoards.Domain.Entities;

namespace WorthBoards.Data.Repositories
{
    public class BoardTaskRepository(ApplicationDbContext dbContext) : Repository<BoardTask>(dbContext), IBoardTaskRepository
    {
    }
}
