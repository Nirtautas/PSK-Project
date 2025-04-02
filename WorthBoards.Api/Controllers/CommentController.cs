using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WorthBoards.Api.Helpers;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Services;
using WorthBoards.Business.Services.Interfaces;
using WorthBoards.Common.Enums;

namespace WorthBoards.Api.Controllers
{
    [ApiController]
    [Route("api/boards/{boardId:int}/tasks/{taskId:int}/comments")]
    public class CommentController(ICommentService _commentService) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetAllBoardTaskComments([FromRoute] int boardId, [FromRoute] int taskId, CancellationToken cancellationToken)
        {
            var commentResponse = await _commentService.GetAllBoardTaskComments(boardId, taskId, cancellationToken);
            return Ok(commentResponse);
        }

        [HttpGet("{commentId}")]
        public async Task<IActionResult> GetCommentById([FromRoute] int boardId, [FromRoute] int taskId, int commentId, CancellationToken cancellationToken)
        {
            var commentResponse = await _commentService.GetCommentById(boardId, taskId, commentId, cancellationToken);
            return Ok(commentResponse);
        }

        [HttpPost]
        public async Task<IActionResult> CreateComment([FromRoute] int boardId, [FromRoute] int taskId, [FromBody] CommentRequest commentRequest, CancellationToken cancellationToken)
        {
            string? userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
                return Unauthorized("Invalid user ID.");

            commentRequest.UserId = userId;
            commentRequest.TaskId = taskId;


            var commentResponse = await _commentService.CreateComment(commentRequest, cancellationToken);
            return CreatedAtAction(nameof(GetCommentById), new { commentId = commentResponse.Id }, commentResponse);
        }

        [HttpDelete("{commentId}")]
        public async Task<IActionResult> DeleteComment(int commentId, CancellationToken cancellationToken)
        {
            await _commentService.DeleteComment(commentId, cancellationToken);
            return NoContent();
        }

        [HttpPut("{commentId}")]
        public async Task<IActionResult> UpdateComment(int commentId, [FromBody] CommentUpdateRequest commentRequest, CancellationToken cancellationToken)
        {
            var commentResponse = await _commentService.UpdateComment(commentId, commentRequest, cancellationToken);
            return Ok(commentResponse);
        }

        [HttpPatch("{commentId}")]
        public async Task<IActionResult> PatchComment(int commentId, [FromBody] JsonPatchDocument<CommentUpdateRequest> commentPatchDoc, CancellationToken cancellationToken)
        {
            var commentResponse = await _commentService.PatchComment(commentId, commentPatchDoc, cancellationToken);
            return Ok(commentResponse);
        }
    }
}
