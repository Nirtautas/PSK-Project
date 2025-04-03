using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Services.Interfaces;

namespace WorthBoards.Api.Controllers
{
    [ApiController]
    [Route("boards/{boardId}/tasks/{taskId:int}/comments")]
    public class CommentController(ICommentService _commentService) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetAllBoardTaskComments([FromRoute] int taskId, CancellationToken cancellationToken, int pageNum = 0, int pageSize = 10)
        {
            var commentResponse = await _commentService.GetAllBoardTaskCommentsAsync(taskId, cancellationToken, pageNum, pageSize);
            return Ok(commentResponse);
        }

        [HttpGet("{commentId}")]
        public async Task<IActionResult> GetCommentById([FromRoute] int taskId, int commentId, CancellationToken cancellationToken)
        {
            var commentResponse = await _commentService.GetCommentByIdAsync(taskId, commentId, cancellationToken);
            return Ok(commentResponse);
        }

        [HttpPost]
        public async Task<IActionResult> CreateComment([FromRoute] int taskId, [FromBody] CommentRequest commentRequest, CancellationToken cancellationToken)
        {
            string? userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
                return Unauthorized("Invalid user ID.");

            var commentResponse = await _commentService.CreateCommentAsync(userId, taskId, commentRequest, cancellationToken);
            return CreatedAtAction(nameof(GetCommentById), new { taskId = taskId, commentId = commentResponse.Id }, commentResponse);
        }

        [HttpDelete("{commentId}")]
        public async Task<IActionResult> DeleteComment(int commentId, CancellationToken cancellationToken)
        {
            await _commentService.DeleteCommentAsync(commentId, cancellationToken);
            return NoContent();
        }

        [HttpPut("{commentId}")]
        public async Task<IActionResult> UpdateComment(int commentId, [FromBody] CommentUpdateRequest commentRequest, CancellationToken cancellationToken)
        {
            var commentResponse = await _commentService.UpdateCommentAsync(commentId, commentRequest, cancellationToken);
            return Ok(commentResponse);
        }

        [HttpPatch("{commentId}")]
        public async Task<IActionResult> PatchComment(int commentId, [FromBody] JsonPatchDocument<CommentUpdateRequest> commentPatchDoc, CancellationToken cancellationToken)
        {
            var commentResponse = await _commentService.PatchCommentAsync(commentId, commentPatchDoc, cancellationToken);
            return Ok(commentResponse);
        }
    }
}
