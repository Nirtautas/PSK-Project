using Microsoft.AspNetCore.JsonPatch;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Dtos.Responses;

namespace WorthBoards.Business.Services.Interfaces
{
    public interface IBoardTaskService
    {
        Task<BoardTaskResponse> GetBoardTaskById(int boardId, int boardTaskId, CancellationToken cancellationToken);

        Task<BoardTaskResponse> CreateBoardTask(int boardId, BoardTaskRequest boardTaskDto, CancellationToken cancellationToken);

        Task DeleteBoardTask(int boardId, int boardTaskId, CancellationToken cancellationToken);

        Task<BoardTaskResponse> UpdateBoardTask(int boardId, int boardTaskToUpdateId, BoardTaskRequest boardTaskDto, CancellationToken cancellationToken);

        Task<BoardTaskResponse> PatchBoardTask(int boardId, int boardTaskToUpdateId, JsonPatchDocument<BoardTaskRequest> taskBoardPatchDoc, CancellationToken cancellationToken);
    }
}
