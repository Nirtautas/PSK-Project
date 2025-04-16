using WorthBoards.Data.Repositories.Interfaces;
using WorthBoards.Domain.Entities;
using WorthBoards.Data.Repositories.Base;
using WorthBoards.Data.Database;
using Microsoft.EntityFrameworkCore;
using WorthBoards.Data.Identity;

namespace WorthBoards.Data.Repositories
{
    public class CommentRepository(ApplicationDbContext dbContext) : Repository<Comment>(dbContext), ICommentRepository
    {
        public async Task<IEnumerable<Tuple<Comment, ApplicationUser>>> GetTaskCommentsWithUsernameAndPicture(int taskId, CancellationToken cancellationToken)
        {
            var commentsLinkedToTaskQuery =
                _dbContext.Comments
                .Where(comment => comment.BoardTaskId == taskId)
                .Join(
                    _dbContext.Users,
                    comment => comment.UserId,
                    user => user.Id,
                    (comment, user) => Tuple.Create(comment, user)
                );

            return await commentsLinkedToTaskQuery.ToListAsync(cancellationToken);
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