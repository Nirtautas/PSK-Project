using Microsoft.AspNetCore.Mvc;
using WorthBoards.Api.Utils;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Services.Interfaces;
using WorthBoards.Common.Enums;

namespace WorthBoards.Api.Controllers
{
    [ApiController]
    [Route("api/boards")]
    public class TaskOnUserController(ITaskOnUserService _taskOnUserService, INotificationService _notificationService) : ControllerBase
    {

        [HttpPost("{boardId}/tasks/{taskId}/users/link")]
        [AuthorizeRole(UserRoleEnum.EDITOR)]
        public async Task<IActionResult> LinkUsersToTask(int boardId, int taskId, [FromBody] IEnumerable<LinkUserToTaskRequest> linkList, CancellationToken cancellationToken)
        {
            var linkResponse = await _taskOnUserService.LinkUsersToTaskAsync(boardId, taskId, linkList, cancellationToken);

            var userId = UserHelper.GetUserId(User);
            if (userId.Result is UnauthorizedObjectResult unauthorizedResult)
                return unauthorizedResult;

            foreach (var response in linkResponse)
            {
                if (response.UserId != userId.Value)
                    await _notificationService.NotifyTaskAssigned(boardId, taskId, response.UserId, userId.Value, cancellationToken);
            }

            return Ok(linkResponse);
        }

        [HttpDelete("{boardId}/tasks/{taskId}/users/unlink")]
        [AuthorizeRole(UserRoleEnum.EDITOR)]
        public async Task<IActionResult> UnlinkUsersFromTask(int boardId, int taskId, [FromBody] IEnumerable<LinkUserToTaskRequest> linkList, CancellationToken cancellationToken)
        {
            var unlinkResponse = await _taskOnUserService.UnlinkUsersFromTaskAsync(boardId, taskId, linkList, cancellationToken);
            return Ok(unlinkResponse);
        }

        [HttpGet("{boardId}/tasks/{taskId}/users")]
        [AuthorizeRole(UserRoleEnum.VIEWER)]
        public async Task<IActionResult> GetUsersLinkedToTask(int boardId, int taskId, CancellationToken cancellationToken)
        {
            var usersResponse = await _taskOnUserService.GetUsersLinkedToTaskAsync(boardId, taskId, cancellationToken);
            return Ok(usersResponse);
        }
    }
}
