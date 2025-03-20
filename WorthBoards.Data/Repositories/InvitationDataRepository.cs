using WorthBoards.Data.Repositories.Interfaces;
using WorthBoards.Domain.Entities;
using WorthBoards.Data.Repositories.Base;

namespace WorthBoards.Data.Repositories
{
    public class InvitationDataRepository(ApplicationDbContext dbContext) : Repository<InvitationData>(dbContext), IInvitationDataRepository
    {
    }
}