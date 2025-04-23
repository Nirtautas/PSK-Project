using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorthBoards.Api.Utils;
using WorthBoards.Business.Dtos.Identity;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Services;
using WorthBoards.Business.Services.Interfaces;
using WorthBoards.Common.Enums;
using WorthBoards.Domain.Entities;

namespace WorthBoards.Api.Controllers
{
    [ApiController]
    [Route("api/boards")]
    public class BoardOnUserController(IBoardOnUserService _boardOnUserService, INotificationService _notificationService) : ControllerBase
    {
        [HttpPost("{boardId}/invite")]
        public async Task<IActionResult> InviteUser(int boardId, [FromBody] InvitationRequest invitationRequest, CancellationToken cancellationToken)
        {
            var responsibleUserId = UserHelper.GetUserId(User).Value;
            await _notificationService.NotifyBoardInvitation(boardId, invitationRequest.UserId, responsibleUserId, invitationRequest.Role, cancellationToken);
            return NoContent();
        }

        [HttpPost("{boardId}/remove/{userId}")]
        public async Task<IActionResult> RemoveUser(int boardId, int userId, CancellationToken cancellationToken)
        {
            var responsibleUserId = UserHelper.GetUserId(User).Value;
            await _boardOnUserService.UnlinkUserFromBoard(boardId, userId, responsibleUserId, cancellationToken);
            return NoContent();
        }

        [HttpGet("{boardId}/links")]
        [AuthorizeRole(UserRoleEnum.VIEWER)]
        public async Task<IActionResult> GetAllBoardToUserLinks(int boardId, CancellationToken cancellationToken)
        {
            var linkResponse = await _boardOnUserService.GetAllBoardToUserLinks(boardId, cancellationToken);
            return Ok(linkResponse);
        }

        [HttpGet("{boardId}/link/{userId}")]
        [AuthorizeRole(UserRoleEnum.VIEWER)]
        public async Task<IActionResult> GetBoardToUserLink(int boardId, int userId, CancellationToken cancellationToken)
        {
            var linkResponse = await _boardOnUserService.GetBoardToUserLink(boardId, userId, cancellationToken);
            return Ok(linkResponse);
        }

        [HttpPost("{boardId}/link/{userId}")]
        [Authorize]
        public async Task<IActionResult> LinkUserToBoard(int boardId, int userId, [FromBody] LinkUserToBoardRequest linkUserToBoardRequest, CancellationToken cancellationToken)
        {
            var linkResponse = await _boardOnUserService.LinkUserToBoard(boardId, userId, linkUserToBoardRequest, cancellationToken);
            return CreatedAtAction(nameof(LinkUserToBoard), new { boardId = linkResponse.BoardId, userId = linkResponse.UserId }, linkResponse);
        }

        // [HttpDelete("{boardId}/link/{userId}")]
        // [AuthorizeRole(UserRoleEnum.EDITOR)]
        // public async Task<IActionResult> UnlinkUserFromBoard(int boardId, int userId, CancellationToken cancellationToken)
        // {
        //     await _boardOnUserService.UnlinkUserFromBoard(boardId, userId, cancellationToken);
        //     return NoContent();
        // }

        [HttpPut("{boardId}/link/{userId}")]
        [AuthorizeRole(UserRoleEnum.EDITOR)]
        public async Task<IActionResult> UpdateUserOnBoard(int boardId, int userId, [FromBody] LinkUserToBoardRequest linkUserToBoardRequest, CancellationToken cancellationToken)
        {
            var linkResponse = await _boardOnUserService.UpdateUserOnBoard(boardId, userId, linkUserToBoardRequest, cancellationToken);
            return Ok(linkResponse);
        }

        [HttpPatch("{boardId}/link/{userId}")]
        [AuthorizeRole(UserRoleEnum.EDITOR)]
        public async Task<IActionResult> PatchUserOnBoard(int boardId, int userId, [FromBody] JsonPatchDocument<LinkUserToBoardRequest> linkUserToBoardPatchDoc, CancellationToken cancellationToken)
        {
            var linkResponse = await _boardOnUserService.PatchUserOnBoard(boardId, userId, linkUserToBoardPatchDoc, cancellationToken);
            return Ok(linkResponse);
        }

        [HttpGet("{boardId}/users")]
        [AuthorizeRole(UserRoleEnum.VIEWER)]
        public async Task<IActionResult> GetUsersLinkedToBoard(int boardId, CancellationToken cancellationToken)
        {
            var boardResponse = await _boardOnUserService.GetUsersLinkedToBoardAsync(boardId, cancellationToken);
            return Ok(boardResponse);
        }

        [HttpGet("{boardId}/collaborators")]
        public async Task<ActionResult<IEnumerable<UserResponse>>> GetUsersByUserName([FromRoute] int boardId, [FromQuery] string userName, CancellationToken cancellationToken)
        {
            var userResponse = await _boardOnUserService.GetUsersByUserNameAsync(boardId, userName, cancellationToken);
            return Ok(userResponse);
        }
    }
}
