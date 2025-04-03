using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Services.Interfaces;

namespace WorthBoards.Api.Controllers
{
    public class BoardOnUserController(IBoardOnUserService _boardOnUserService) : ControllerBase
    {
        [HttpGet("{boardId}/links")]
        public async Task<IActionResult> GetAllBoardToUserLinks(int boardId, CancellationToken cancellationToken)
        {
            var linkResponse = await _boardOnUserService.GetAllBoardToUserLinks(boardId, cancellationToken);
            return Ok(linkResponse);
        }

        [HttpGet("{boardId}/link/{userId}")]
        public async Task<IActionResult> GetBoardToUserLink(int boardId, int userId, CancellationToken cancellationToken)
        {
            var linkResponse = await _boardOnUserService.GetBoardToUserLink(boardId, userId, cancellationToken);
            return Ok(linkResponse);
        }

        [HttpPost("{boardId}/link/{userId}")]
        public async Task<IActionResult> LinkUserToBoard(int boardId, int userId, [FromBody] LinkUserToBoardRequest linkUserToBoardRequest, CancellationToken cancellationToken)
        {
            var linkResponse = await _boardOnUserService.LinkUserToBoard(boardId, userId, linkUserToBoardRequest, cancellationToken);
            return CreatedAtAction(nameof(LinkUserToBoard), new { boardId = linkResponse.BoardId, userId = linkResponse.UserId }, linkResponse);
        }

        [HttpDelete("{boardId}/link/{userId}")]
        public async Task<IActionResult> UnlinkUserFromBoard(int boardId, int userId, CancellationToken cancellationToken)
        {
            await _boardOnUserService.UnlinkUserFromBoard(boardId, userId, cancellationToken);
            return NoContent();
        }

        [HttpPut("{boardId}/link/{userId}")]
        public async Task<IActionResult> UpdateUserOnBoard(int boardId, int userId, [FromBody] LinkUserToBoardRequest linkUserToBoardRequest, CancellationToken cancellationToken)
        {
            var linkResponse = await _boardOnUserService.UpdateUserOnBoard(boardId, userId, linkUserToBoardRequest, cancellationToken);
            return Ok(linkResponse);
        }

        [HttpPatch("{boardId}/link/{userId}")]
        public async Task<IActionResult> PatchUserOnBoard(int boardId, int userId, [FromBody] JsonPatchDocument<LinkUserToBoardRequest> linkUserToBoardPatchDoc, CancellationToken cancellationToken)
        {
            var linkResponse = await _boardOnUserService.PatchUserOnBoard(boardId, userId, linkUserToBoardPatchDoc, cancellationToken);
            return Ok(linkResponse);
        }
    }
}
