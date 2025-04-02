using Microsoft.AspNetCore.JsonPatch;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Dtos.Responses;

namespace WorthBoards.Business.Services.Interfaces
{
    public interface ICommentService
    {
        Task<(List<CommentResponse> Results, int TotalCount)> GetAllBoardTaskCommentsAsync(int taskId, CancellationToken cancellationToken, int pageNum, int pageSize);

        Task<CommentResponse> GetCommentByIdAsync(int taskId, int commentId, CancellationToken cancellationToken);

        Task<CommentResponse> CreateCommentAsync(int userId, int taskId, CommentRequest commentDto, CancellationToken cancellationToken);

        Task DeleteCommentAsync(int commentId, CancellationToken cancellationToken);

        Task<CommentResponse> UpdateCommentAsync(int commentToUpdateId, CommentUpdateRequest commentDto, CancellationToken cancellationToken);

        Task<CommentResponse> PatchCommentAsync(int commentToUpdateId, JsonPatchDocument<CommentUpdateRequest> commentPatchDoc, CancellationToken cancellationToken);
    }
}
