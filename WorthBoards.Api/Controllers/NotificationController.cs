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
    [AllowAnonymous]
    [HttpGet]
    public async Task<List<NotificationResponse>> GetNotificationsByUserId(CancellationToken cancellationToken = default)
    {
        var userId = UserHelper.GetUserId(User).Value;
        var notifications = await _notificationService.GetNotificationsByUserId(userId, cancellationToken);

        return notifications;
    }
}
