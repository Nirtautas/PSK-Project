using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Services.Interfaces;

namespace WorthBoards.Api.Controllers
{
    [ApiController]
    [Route("api/board")]
    public class BoardTaskController(IBoardTaskService _boardTaskService) : ControllerBase
    {
        [HttpGet("{boardId}/task/{boardTaskId}")]
        public async Task<IActionResult> GetBoardTaskById(int boardId, int boardTaskId, CancellationToken cancellationToken)
        {
            var boardTaskResponse = await _boardTaskService.GetBoardTaskById(boardId, boardTaskId, cancellationToken);
            return Ok(boardTaskResponse);
        }

        [HttpPost("{boardId}/task")]
        public async Task<IActionResult> CreateBoardTask(int boardId, [FromBody] BoardTaskRequest boardTaskRequest, CancellationToken cancellationToken)
        {
            var boardTaskResponse = await _boardTaskService.CreateBoardTask(boardId, boardTaskRequest, cancellationToken);
            return CreatedAtAction(nameof(GetBoardTaskById), new { boardId = boardId, boardTaskId = boardTaskResponse.Id}, boardTaskResponse);
        }

        [HttpDelete("{boardId}/task/{boardTaskId}")]
        public async Task<IActionResult> DeleteBoardTask(int boardId, int boardTaskId, CancellationToken cancellationToken)
        {
            await _boardTaskService.DeleteBoardTask(boardId, boardTaskId, cancellationToken);
            return NoContent();
        }

        [HttpPut("{boardId}/task/{boardTaskId}")]
        public async Task<IActionResult> UpdateBoardTask(int boardId, int boardTaskId, [FromBody] BoardTaskRequest boardTaskRequest, CancellationToken cancellationToken)
        {
            var boardTaskResponse = await _boardTaskService.UpdateBoardTask(boardId, boardTaskId, boardTaskRequest, cancellationToken);
            return Ok(boardTaskResponse);
        }

        [HttpPatch("{boardId}/task/{boardTaskId}")]
        public async Task<IActionResult> PatchBoardTask(int boardId, int boardTaskId, [FromBody] JsonPatchDocument<BoardTaskRequest> taskBoardPatchDoc, CancellationToken cancellationToken)
        {
            var boardTaskResponse = await _boardTaskService.PatchBoardTask(boardId, boardTaskId, taskBoardPatchDoc, cancellationToken);
            return Ok(boardTaskResponse);
        }
    }
}
