using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Services.Interfaces;

namespace WorthBoards.Api.Controllers
{
    [ApiController]
    [Route("api/boards")]
    public class BoardController(IBoardService _boardService, IBoardOnUserService _boardOnUserService) : ControllerBase
    {
        //Board

        [HttpGet("{boardId}")]
        public async Task<IActionResult> GetBoardById(int boardId, CancellationToken cancellationToken)
        {
            var boardResponse = await _boardService.GetBoardById(boardId, cancellationToken);
            return Ok(boardResponse);
        }

        [HttpPost]
        public async Task<IActionResult> CreateBoard([FromBody] BoardRequest boardRequest, CancellationToken cancellationToken)
        {
            var boardResponse = await _boardService.CreateBoard(boardRequest, cancellationToken);
            return CreatedAtAction(nameof(GetBoardById), new { boardId = boardResponse.Id}, boardResponse);
        }

        [HttpDelete("{boardId}")]
        public async Task<IActionResult> DeleteBoard(int boardId, CancellationToken cancellationToken)
        {
            await _boardService.DeleteBoard(boardId, cancellationToken);
            return NoContent();
        }

        [HttpPut("{boardId}")]
        public async Task<IActionResult> UpdateBoard(int boardId, [FromBody] BoardUpdateRequest boardRequest, CancellationToken cancellationToken)
        {
            var boardResponse = await _boardService.UpdateBoard(boardId, boardRequest, cancellationToken);
            return Ok(boardResponse);
        }

        [HttpPatch("{boardId}")]
        public async Task<IActionResult> PatchBoard(int boardId, [FromBody] JsonPatchDocument<BoardUpdateRequest> taskBoardPatchDoc, CancellationToken cancellationToken)
        {
            var boardResponse = await _boardService.PatchBoard(boardId, taskBoardPatchDoc, cancellationToken);
            return Ok(boardResponse);
        }
    }
}
