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
        var userId = UserHelper.GetUserId(User).Value;
        await _notificationService.AcceptInvitation(notificationId, userId, cancellationToken);
        return NoContent();
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<List<NotificationResponse>> GetNotificationsByUserId(CancellationToken cancellationToken = default)
    {
        var userId = UserHelper.GetUserId(User).Value;
        var notifications = await _notificationService.GetNotificationsByUserId(userId, cancellationToken);

        return notifications;
    }
}
