using WorthBoards.Data.Repositories.Interfaces;
using WorthBoards.Data.Repositories.Base;
using WorthBoards.Domain.Entities;
using WorthBoards.Data.Database;
using WorthBoards.Data.Identity;

namespace WorthBoards.Data.Repositories
{
    public class UserRepository(ApplicationDbContext dbContext) : Repository<ApplicationUser>(dbContext), IUserRepository
    {
    }
}