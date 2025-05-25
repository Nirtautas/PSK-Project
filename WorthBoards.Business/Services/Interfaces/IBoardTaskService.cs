using Microsoft.AspNetCore.JsonPatch;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Dtos.Responses;
using WorthBoards.Common.Enums;

namespace WorthBoards.Business.Services.Interfaces
{
    public interface IBoardTaskService
    {
        Task<IEnumerable<BoardTaskResponse>> GetBoardTasks(int boardId, IEnumerable<TaskStatusEnum> taskStatuses, CancellationToken cancellationToken);

        Task<BoardTaskResponse> GetBoardTaskById(int boardId, int boardTaskId, CancellationToken cancellationToken);

        Task<BoardTaskResponse> CreateBoardTask(int boardId, BoardTaskRequest boardTaskDto, CancellationToken cancellationToken);

        Task DeleteBoardTask(int boardId, int boardTaskId, CancellationToken cancellationToken);

        Task DeleteArchivedBoardTasks(int boardId, CancellationToken cancellationToken);

        Task<BoardTaskResponse> UpdateBoardTask(int boardId, int boardTaskToUpdateId, BoardTaskUpdateRequest boardTaskDto, CancellationToken cancellationToken);

        Task<BoardTaskResponse> PatchBoardTask(int boardId, int boardTaskToUpdateId, JsonPatchDocument<BoardTaskUpdateRequest> taskBoardPatchDoc, CancellationToken cancellationToken);
    }
}
