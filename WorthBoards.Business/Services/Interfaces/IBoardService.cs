using Microsoft.AspNetCore.JsonPatch;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Dtos.Responses;
using WorthBoards.Common.Enums;

namespace WorthBoards.Business.Services.Interfaces
{
    public interface IBoardService
    {
        Task<(List<BoardResponse> Results, int TotalCount)> GetUserBoardsAsync(
            int userId, int pageNum, int pageSize, CancellationToken cancellationToken);
        Task<BoardResponse> GetBoardByIdAsync(int boardId, CancellationToken cancellationToken);

        Task<BoardResponse> CreateBoardAsync(int userId, BoardRequest boardDto, CancellationToken cancellationToken);

        Task DeleteBoardAsync(int boardId, CancellationToken cancellationToken);

        Task<BoardResponse> UpdateBoardAsync(int boardToUpdateId, BoardUpdateRequest boardDto, CancellationToken cancellationToken);

        Task<BoardResponse> PatchBoardAsync(int boardToUpdateId, JsonPatchDocument<BoardUpdateRequest> boardPatchDoc, CancellationToken cancellationToken);

        Task<UserRoleEnum?> GetUserRoleByBoardIdAndUserIdAsync(int boardId, int userId);
    }
}
