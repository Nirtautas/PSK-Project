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
    public class BoardController(IBoardService _boardService) : ControllerBase
    {
        [HttpGet("{boardId}")]
        [Authorize]
        public async Task<IActionResult> GetBoardById(int boardId, CancellationToken cancellationToken)
        {
            var boardResponse = await _boardService.GetBoardById(boardId, cancellationToken);
            return Ok(boardResponse);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateBoard([FromBody] BoardRequest boardRequest, CancellationToken cancellationToken)
        {
            var boardResponse = await _boardService.CreateBoard(boardRequest, cancellationToken);
            return CreatedAtAction(nameof(GetBoardById), new { boardId = boardResponse.Id}, boardResponse);
        }

        [HttpDelete("{boardId}")]
        [AuthorizeRole(UserRoleEnum.OWNER)]
        public async Task<IActionResult> DeleteBoard(int boardId, CancellationToken cancellationToken)
        {
            await _boardService.DeleteBoard(boardId, cancellationToken);
            return NoContent();
        }

        [HttpPut("{boardId}")]
        [AuthorizeRole(UserRoleEnum.EDITOR)]
        public async Task<IActionResult> UpdateBoard(int boardId, [FromBody] BoardUpdateRequest boardRequest, CancellationToken cancellationToken)
        {
            var boardResponse = await _boardService.UpdateBoard(boardId, boardRequest, cancellationToken);
            return Ok(boardResponse);
        }

        [HttpPatch("{boardId}")]
        [AuthorizeRole(UserRoleEnum.EDITOR)]
        public async Task<IActionResult> PatchBoard(int boardId, [FromBody] JsonPatchDocument<BoardUpdateRequest> taskBoardPatchDoc, CancellationToken cancellationToken)
        {
            var boardResponse = await _boardService.PatchBoard(boardId, taskBoardPatchDoc, cancellationToken);
            return Ok(boardResponse);
        }
    }
}
