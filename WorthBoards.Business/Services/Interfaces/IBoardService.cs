using Microsoft.AspNetCore.JsonPatch;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Dtos.Responses;
using WorthBoards.Common.Enums;

namespace WorthBoards.Business.Services.Interfaces
{
    public interface IBoardService
    {
        Task<IEnumerable<BoardResponse>> GetUserBoards(int userId, int pageNum, int pageSize, CancellationToken cancellationToken);
        Task<BoardResponse> GetBoardById(int boardId, CancellationToken cancellationToken);

        Task<BoardResponse> CreateBoard(BoardRequest boardDto, CancellationToken cancellationToken);

        Task DeleteBoard(int boardId, CancellationToken cancellationToken);

        Task<BoardResponse> UpdateBoard(int boardToUpdateId, BoardUpdateRequest boardDto, CancellationToken cancellationToken);

        Task<BoardResponse> PatchBoard(int boardToUpdateId, JsonPatchDocument<BoardUpdateRequest> boardPatchDoc, CancellationToken cancellationToken);

        Task<UserRoleEnum?> GetUserRoleByBoardIdAndUserIdAsync(int boardId, int userId);
    }
}
