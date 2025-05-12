using Microsoft.AspNetCore.Mvc;
using WorthBoards.Api.Utils;
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

    [HttpGet]
    public async Task<IActionResult> GetNotificationsByUserId(CancellationToken cancellationToken = default)
    {
        var userId = UserHelper.GetUserId(User);
        var notifications = await _notificationService.GetNotificationsByUserId(userId.Value, cancellationToken);
        return Ok(notifications);
    }

    [HttpDelete("{notificationId}")]
    public async Task<IActionResult> DeleteNotification(int notificationId, CancellationToken cancellationToken = default)
    {
        var userId = UserHelper.GetUserId(User);

        await _notificationService.UnlinkNotification(userId.Value, notificationId, cancellationToken);
        return Ok();
    }
}
