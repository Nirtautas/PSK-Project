using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorthBoards.Api.Helpers;
using WorthBoards.Business.Dtos.Identity;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Dtos.Responses;
using WorthBoards.Business.Services.Interfaces;

namespace WorthBoards.Api.Controllers;

[Route("api/invitations")]
[ApiController]
public class InvitationController(INotificationService _notificationService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> InviteUser([FromBody] InvitationRequest invitationRequest, CancellationToken cancellationToken)
    {
        var responsibleUserId = ClaimsHelper.GetUserIdFromToken(User);
        await _notificationService.NotifyBoardInvitation(invitationRequest.BoardId, invitationRequest.UserId, responsibleUserId, invitationRequest.Role, cancellationToken);
        return NoContent();
    }

    [HttpPost("{notificationId}/accept")]
    public async Task<IActionResult> AcceptInvitation(int notificationId, CancellationToken cancellationToken)
    {
        var userId = ClaimsHelper.GetUserIdFromToken(User);
        await _notificationService.AcceptInvitation(notificationId, userId, cancellationToken);
        return NoContent();
    }
}
