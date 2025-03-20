using WorthBoards.Data.Repositories.Interfaces;
using WorthBoards.Domain.Entities;
using WorthBoards.Data.Repositories.Base;

namespace WorthBoards.Data.Repositories
{
    public class BoardRepository(ApplicationDbContext dbContext) : Repository<Board>(dbContext), IBoardRepository
    {
    }   
}