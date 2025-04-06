using AutoMapper;
using Microsoft.AspNetCore.Identity;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Dtos.Responses;

namespace WorthBoards.Business.Services.Interfaces
{
    public interface ITaskOnUserService
    {
        Task<IEnumerable<LinkUserToTaskResponse>> LinkUsersToTaskAsync(int taskId, IEnumerable<LinkUserToTaskRequest> linkList, CancellationToken cancellationToken);

        Task<IEnumerable<LinkUserToTaskResponse>> UnlinkUsersFromTaskAsync(int taskId, IEnumerable<int> userIds, CancellationToken cancellationToken);
    }
}
