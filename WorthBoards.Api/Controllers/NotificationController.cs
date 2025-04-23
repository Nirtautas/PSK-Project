using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorthBoards.Api.Utils;
using WorthBoards.Business.Dtos.Responses;
using WorthBoards.Business.Services.Interfaces;

namespace WorthBoards.Api.Controllers;

[Route("api/notifications")]
[ApiController]
public class NotificationController(INotificationService _notificationService) : ControllerBase
{
    [HttpPost("{notificationId}/accept")]
    public async Task<IActionResult> AcceptInvitation(int notificationId, CancellationToken cancellationToken)
    {
        var userId = UserHelper.GetUserId(User);
        if (userId.Result is UnauthorizedObjectResult unauthorizedResult)
            return unauthorizedResult;

        await _notificationService.AcceptInvitation(notificationId, userId.Value, cancellationToken);
        return NoContent();
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetNotificationsByUserId(CancellationToken cancellationToken = default)
    {
        var userId = UserHelper.GetUserId(User);
        if (userId.Result is UnauthorizedObjectResult unauthorizedResult)
            return unauthorizedResult;

        var notifications = await _notificationService.GetNotificationsByUserId(userId.Value, cancellationToken);
        return Ok(notifications);
    }
}
