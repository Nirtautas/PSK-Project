using AutoMapper;
using Microsoft.AspNetCore.Identity;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Dtos.Responses;

namespace WorthBoards.Business.Services.Interfaces
{
    public interface ITaskOnUserService
    {
        Task<IEnumerable<LinkUserToTaskResponse>> LinkUsersToTaskAsync(int boardId, int taskId, IEnumerable<LinkUserToTaskRequest> linkList, CancellationToken cancellationToken);

        Task<IEnumerable<LinkUserToTaskResponse>> UnlinkUsersFromTaskAsync(int boardId, int taskId, IEnumerable<int> userIds, CancellationToken cancellationToken);

        Task<IEnumerable<LinkedUserToTaskResponse>> GetUsersLinkedToTaskAsync(int boardId, int taskId, CancellationToken cancellationToken);
    }
}
