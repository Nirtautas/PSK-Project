using WorthBoards.Data.Repositories.Interfaces;
using WorthBoards.Domain.Entities;
using WorthBoards.Data.Repositories.Base;
using WorthBoards.Data.Database;
using Microsoft.EntityFrameworkCore;
using WorthBoards.Data.Identity;

namespace WorthBoards.Data.Repositories
{
    public class BoardOnUserRepository(ApplicationDbContext dbContext) : Repository<BoardOnUser>(dbContext), IBoardOnUserRepository
    {
        public async Task<(List<Board> Results, int TotalCount)> GetUserBoardsAsync(
    int userId, int pageSize, int pageNumber, CancellationToken cancellationToken)
        {
            // Get all board IDs where the user is linked
            var boardIdsQuery = _dbContext.BoardOnUsers
                .Where(bu => bu.UserId == userId)
                .Select(bu => bu.BoardId);

            int totalCount = await boardIdsQuery.CountAsync(cancellationToken);

            var paginatedBoardIds = await boardIdsQuery
                .OrderBy(id => id) 
                .Skip(pageNumber * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            // Fetch boards
            var boards = await _dbContext.Boards
                .Where(b => paginatedBoardIds.Contains(b.Id))
                .ToListAsync(cancellationToken);

            return (boards, totalCount);
        }

        public async Task<IEnumerable<Tuple<BoardOnUser, ApplicationUser>>> GetUsersLinkedToBoardAsync(int boardId, CancellationToken cancellationToken)
        {
            var usersLinkedToBoardQuery =
                _dbContext.BoardOnUsers
                .Where(boardOnUser => boardOnUser.BoardId == boardId)
                .Join(
                    _dbContext.Users,
                    boardOnUser => boardOnUser.UserId,
                    user => user.Id,
                    (boardOnUser, user) => Tuple.Create(boardOnUser, user)
                );

            return await usersLinkedToBoardQuery.ToListAsync(cancellationToken);
        }
    }
}