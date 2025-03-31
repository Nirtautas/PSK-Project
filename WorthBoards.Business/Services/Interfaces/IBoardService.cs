using Microsoft.AspNetCore.JsonPatch;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Dtos.Responses;

namespace WorthBoards.Business.Services.Interfaces
{
    public interface IBoardService
    {
        Task<BoardResponse> GetBoardById(int boardId, CancellationToken cancellationToken);

        Task<BoardResponse> CreateBoard(BoardRequest boardDto, CancellationToken cancellationToken);

        Task DeleteBoard(int boardId, CancellationToken cancellationToken);

        Task<BoardResponse> UpdateBoard(int boardToUpdateId, BoardUpdateRequest boardDto, CancellationToken cancellationToken);

        Task<BoardResponse> PatchBoard(int boardToUpdateId, JsonPatchDocument<BoardUpdateRequest> boardPatchDoc, CancellationToken cancellationToken);
    }
}
