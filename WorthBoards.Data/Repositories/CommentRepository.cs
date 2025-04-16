using WorthBoards.Data.Repositories.Interfaces;
using WorthBoards.Domain.Entities;
using WorthBoards.Data.Repositories.Base;
using WorthBoards.Data.Database;
using Microsoft.EntityFrameworkCore;
using WorthBoards.Data.Identity;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace WorthBoards.Data.Repositories
{
    public class CommentRepository(ApplicationDbContext dbContext) : Repository<Comment>(dbContext), ICommentRepository
    {
        public async Task<(IReadOnlyList<Tuple<Comment, ApplicationUser>> Results, int TotalCount)> GetTaskCommentsWithUsernameAndPicture(
            int taskId,
            int pageSize,
            int pageNumber,
            CancellationToken cancellationToken = default)
        {

            var commentsLinkedToTaskQuery =
                _dbContext.Comments
                .AsNoTracking()
                .Where(comment => comment.BoardTaskId == taskId)
                .Join(
                    _dbContext.Users,
                    comment => comment.UserId,
                    user => user.Id,
                    (comment, user) => Tuple.Create(comment, user)
                );

            var totalCount = await commentsLinkedToTaskQuery.CountAsync(cancellationToken);

            var results = await commentsLinkedToTaskQuery
                .OrderBy(x => EF.Property<object>(x, "Id"))
                .Skip(pageNumber * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            return (results, totalCount);
        }

        public async Task<Tuple<Comment, ApplicationUser>?> GetCommentWithUsernameAndPicture(int commentId, CancellationToken cancellationToken)
        {
            var commentLinkedToUserQuery =
                _dbContext.Comments
                .Where(comment => comment.Id == commentId)
                .Join(
                    _dbContext.Users,
                    comment => comment.UserId,
                    user => user.Id,
                    (comment, user) => Tuple.Create(comment, user)
                );

            return await commentLinkedToUserQuery.FirstOrDefaultAsync(cancellationToken);
        }
    }
}