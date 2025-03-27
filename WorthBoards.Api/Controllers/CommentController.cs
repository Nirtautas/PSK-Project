using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using WorthBoards.Api.Helpers;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Services.Interfaces;

namespace WorthBoards.Api.Controllers
{
    [ApiController]
    [Route("api/boards/{boardid:int}/tasks/{taskid:int}/comments")]
    public class CommentController(ICommentService _commentService) : ControllerBase
    {
        [HttpGet("{commentId}")]
        public async Task<IActionResult> GetCommentById([FromRoute] int taskid, int commentId, CancellationToken cancellationToken)
        {
            var commentResponse = await _commentService.GetCommentById(commentId, cancellationToken);
            return Ok(commentResponse);
        }

        [HttpPost]
        public async Task<IActionResult> CreateComment([FromRoute] int taskid, [FromBody] CommentRequest commentRequest, CancellationToken cancellationToken)
        {
            var signedInUserId = ClaimsHelper.GetUserIdFromToken(User);
            commentRequest.UserId = signedInUserId;
            commentRequest.TaskId = taskid;

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
