using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorthBoards.Business.Dtos.Identity;
using WorthBoards.Business.Dtos.Responses;
using WorthBoards.Business.Services.Interfaces;

namespace WorthBoards.Api.Controllers;

[Route("api/notifications")]
[ApiController]
public class NotificationController(INotificationService _notificationService, IMapper _mapper) : ControllerBase
{
    [AllowAnonymous]
    [HttpGet("/{userId:int}")]
    public async Task<List<NotificationResponse>> GetNotificationsByUserId(int userId, CancellationToken cancellationToken = default)
    {
        var notifications = await _notificationService.GetNotificationsByUserId(userId, cancellationToken);

        return notifications;
    }

    [AllowAnonymous]
    [HttpGet("/test")]
    public async Task GetNotificationsByUserId(CancellationToken cancellationToken = default)
    {
        int boardId = 1;
        int userId = 1;
        int responsibleUserId = 1;
        await _notificationService.NotifyBoardInvitation(boardId, userId, responsibleUserId, cancellationToken);
    }
}
