using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorthBoards.Api.Utils;
using WorthBoards.Business.Dtos.Identity;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Dtos.Responses;
using WorthBoards.Business.Services.Interfaces;
using WorthBoards.Common.Enums;
using WorthBoards.Data.Repositories.Interfaces;

namespace WorthBoards.Api.Controllers;

[Route("api/invitations")]
[ApiController]
public class InvitationController(INotificationService _notificationService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> InviteUser([FromBody] InvitationRequest invitationRequest, CancellationToken cancellationToken)
    {
        var responsibleUserId = UserHelper.GetUserId(User).Value;
        await _notificationService.NotifyBoardInvitation(invitationRequest.BoardId, invitationRequest.UserId, responsibleUserId, invitationRequest.Role, cancellationToken);
        return NoContent();
    }

    [HttpPost("{notificationId}/accept")]
    public async Task<IActionResult> AcceptInvitation(int notificationId, CancellationToken cancellationToken)
    {
        var userId = UserHelper.GetUserId(User).Value;
        await _notificationService.AcceptInvitation(notificationId, userId, cancellationToken);
        return NoContent();
    }

    // TODO: make this actually remove users from board
    [HttpPost("/remove-from-board/")]
    public async Task<IActionResult> RemoveUser([FromBody] RemoveUserFromBoardRequest request, CancellationToken cancellationToken)
    {
        var responsibleUserId = UserHelper.GetUserId(User).Value;
        await _notificationService.NotifyUserRemoved(request.BoardId, request.UserId, responsibleUserId, UserRoleEnum.OWNER, cancellationToken);
        return NoContent();
    }
}
