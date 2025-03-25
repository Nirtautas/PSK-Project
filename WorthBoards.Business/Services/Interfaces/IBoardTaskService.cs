using Microsoft.AspNetCore.JsonPatch;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Dtos.Responses;

namespace WorthBoards.Business.Services.Interfaces
{
    public interface IBoardTaskService
    {
        Task<BoardTaskResponse> GetBoardTaskById(int boardTaskId, CancellationToken cancellationToken);

        Task<BoardTaskResponse> CreateBoardTask(BoardTaskRequest boardTaskDto, CancellationToken cancellationToken);

        Task DeleteBoardTask(int boardTaskId, CancellationToken cancellationToken);

        Task<BoardTaskResponse> UpdateBoardTask(int boardTaskToUpdateId, BoardTaskUpdateRequest boardTaskDto, CancellationToken cancellationToken);

        Task<BoardTaskResponse> PatchBoardTask(int boardTaskToUpdateId, JsonPatchDocument<BoardTaskUpdateRequest> taskBoardPatchDoc, CancellationToken cancellationToken);
    }
}
