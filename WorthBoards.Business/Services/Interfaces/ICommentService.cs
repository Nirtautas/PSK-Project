using Microsoft.AspNetCore.JsonPatch;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Dtos.Responses;

namespace WorthBoards.Business.Services.Interfaces
{
    public interface ICommentService
    {
        Task<CommentResponse> GetAllBoardTaskComments(int boardId, int taskId, CancellationToken cancellationToken);
        Task<CommentResponse> GetCommentById(int boardId, int taskId, int commentId, CancellationToken cancellationToken);

        Task<CommentResponse> CreateComment(CommentRequest commentDto, CancellationToken cancellationToken);

        Task DeleteComment(int commentId, CancellationToken cancellationToken);

        Task<CommentResponse> UpdateComment(int commentToUpdateId, CommentUpdateRequest commentDto, CancellationToken cancellationToken);

        Task<CommentResponse> PatchComment(int commentToUpdateId, JsonPatchDocument<CommentUpdateRequest> commentPatchDoc, CancellationToken cancellationToken);
    }
}
