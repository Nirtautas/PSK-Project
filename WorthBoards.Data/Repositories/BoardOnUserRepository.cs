using WorthBoards.Data.Repositories.Interfaces;
using WorthBoards.Domain.Entities;
using WorthBoards.Data.Repositories.Base;
using WorthBoards.Data.Database;
using Microsoft.EntityFrameworkCore;

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
    }
}