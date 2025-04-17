using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using WorthBoards.Api.Utils;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Services.Interfaces;
using WorthBoards.Common.Enums;

namespace WorthBoards.Api.Controllers
{
    [ApiController]
    [Route("api/boards")]
    public class BoardController(IBoardService _boardService, IBoardOnUserService _boardOnUserService) : ControllerBase
    {
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAllCurrentUserBoards([FromQuery] int? userId, CancellationToken cancellationToken, [FromQuery] int pageNum = 0, [FromQuery] int pageSize = 10)
        {
            if (userId == null)
            {
                var userID = UserHelper.GetUserId(User);
                if (userID.Result is UnauthorizedObjectResult unauthorizedResult)
                    return unauthorizedResult;

                userId = userID.Value;
            }

            var (boards, totalCount) = await _boardService.GetUserBoardsAsync(userId.Value, pageNum, pageSize, cancellationToken);
            return Ok(new { TotalCount = totalCount, Boards = boards });
        }

        [HttpGet("{boardId}")]
        [Authorize]
        public async Task<IActionResult> GetBoardById(int boardId, CancellationToken cancellationToken)
        {
            var boardResponse = await _boardService.GetBoardByIdAsync(boardId, cancellationToken);
            return Ok(boardResponse);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateBoard(int? userId, [FromBody] BoardRequest boardRequest, CancellationToken cancellationToken)
        {
            if (userId == null)
            {
                var userID = UserHelper.GetUserId(User);
                if (userID.Result is UnauthorizedObjectResult unauthorizedResult)
                    return unauthorizedResult;

                userId = userID.Value;
            }

            var boardResponse = await _boardService.CreateBoardAsync(userId.Value, boardRequest, cancellationToken);
            return CreatedAtAction(nameof(GetBoardById), new { boardId = boardResponse.Id}, boardResponse);
        }

        [HttpDelete("{boardId}")]
        [AuthorizeRole(UserRoleEnum.OWNER)]
        public async Task<IActionResult> DeleteBoard(int boardId, CancellationToken cancellationToken)
        {
            await _boardService.DeleteBoardAsync(boardId, cancellationToken);
            return NoContent();
        }

        [HttpPut("{boardId}")]
        [AuthorizeRole(UserRoleEnum.EDITOR)]
        public async Task<IActionResult> UpdateBoard(int boardId, [FromBody] BoardUpdateRequest boardRequest, CancellationToken cancellationToken)
        {
            var boardResponse = await _boardService.UpdateBoardAsync(boardId, boardRequest, cancellationToken);
            return Ok(boardResponse);
        }

        [HttpPatch("{boardId}")]
        [AuthorizeRole(UserRoleEnum.EDITOR)]
        public async Task<IActionResult> PatchBoard(int boardId, [FromBody] JsonPatchDocument<BoardUpdateRequest> taskBoardPatchDoc, CancellationToken cancellationToken)
        {
            var boardResponse = await _boardService.PatchBoardAsync(boardId, taskBoardPatchDoc, cancellationToken);
            return Ok(boardResponse);
        }
    }
}
