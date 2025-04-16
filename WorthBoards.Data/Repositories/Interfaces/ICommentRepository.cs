using WorthBoards.Data.Identity;
using WorthBoards.Data.Repositories.Base;
using WorthBoards.Domain.Entities;

namespace WorthBoards.Data.Repositories.Interfaces
{
    public interface ICommentRepository : IRepository<Comment>
    {
        Task<(IReadOnlyList<Tuple<Comment, ApplicationUser>> Results, int TotalCount)> GetTaskCommentsWithUsernameAndPicture(
            int taskId,
            int pageSize,
            int pageNumber,
            CancellationToken cancellationToken = default);

        Task<Tuple<Comment, ApplicationUser>?> GetCommentWithUsernameAndPicture(int commentId, CancellationToken cancellationToken);
    }
}
