using WorthBoards.Data.Identity;
using WorthBoards.Data.Repositories.Base;
using WorthBoards.Domain.Entities;

namespace WorthBoards.Data.Repositories.Interfaces
{
    public interface IBoardOnUserRepository : IRepository<BoardOnUser>
    {
        Task<(List<Board> Results, int TotalCount)> GetUserBoardsAsync(
            int userId, int pageSize, int pageNumber, CancellationToken cancellationToken);

        Task<IEnumerable<Tuple<BoardOnUser, ApplicationUser>>> GetUsersLinkedToBoardAsync(int boardId, CancellationToken cancellationToken);

        Task<List<ApplicationUser>> GetUsersByUserNameAsync(string userName, CancellationToken cancellationToken);
    }
}
