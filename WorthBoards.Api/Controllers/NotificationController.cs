using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorthBoards.Api.Helpers;
using WorthBoards.Business.Dtos.Identity;
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
        var userId = ClaimsHelper.GetUserIdFromToken(User);
        var notifications = await _notificationService.GetNotificationsByUserId(userId, cancellationToken);

        return notifications;
    }
}
