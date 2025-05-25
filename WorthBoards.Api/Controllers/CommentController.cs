using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Npgsql.Internal;
using System.Security.Claims;
using WorthBoards.Api.Utils;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Services.Interfaces;
using WorthBoards.Domain.Entities;

namespace WorthBoards.Api.Controllers
{
    [ApiController]
    [Route("api/boards/{boardId:int}/tasks/{taskId:int}/comments")]
    [Authorize]
    public class CommentController(ICommentService _commentService) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetAllBoardTaskComments([FromRoute] int taskId, CancellationToken cancellationToken, int pageNum = 0, int pageSize = 10)
        {
            var (commentResponse, totalCount) = await _commentService.GetAllBoardTaskCommentsAsync(taskId, cancellationToken, pageNum, pageSize);
            
            var pageCount = totalCount == 0 ? 1 : (int)Math.Ceiling((double)totalCount / pageSize);
            return Ok(new {items = commentResponse, pageNumber = pageNum, pageCount, pageSize});
        }

        [HttpGet("{commentId}")]
        public async Task<IActionResult> GetCommentById([FromRoute] int taskId, int commentId, CancellationToken cancellationToken)
        {
            var commentResponse = await _commentService.GetCommentByIdAsync(taskId, commentId, cancellationToken);
            
            return Ok(commentResponse);
        }

        [HttpPost]
        public async Task<IActionResult> CreateComment([FromRoute] int boardId, [FromRoute] int taskId, [FromBody] CommentRequest commentRequest, CancellationToken cancellationToken)
        {
            var userId = UserHelper.GetUserId(User);
            if (userId.Result is UnauthorizedObjectResult unauthorizedResult)
                return unauthorizedResult;

            var commentResponse = await _commentService.CreateCommentAsync(userId.Value, taskId, commentRequest, cancellationToken);
            return CreatedAtAction(nameof(GetCommentById), new { boardId = boardId, taskId = taskId, commentId = commentResponse.Id }, commentResponse);
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
