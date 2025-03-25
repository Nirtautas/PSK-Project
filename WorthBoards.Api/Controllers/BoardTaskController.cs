using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Services.Interfaces;

namespace WorthBoards.Api.Controllers
{
    [ApiController]
    [Route("api/board-task")]
    public class BoardTaskController(IBoardTaskService _boardTaskService) : ControllerBase
    {
        [HttpGet("{boardTaskId}")]
        public async Task<IActionResult> GetBoardTaskById(int boardTaskId, CancellationToken cancellationToken)
        {
            var boardTaskResponse = await _boardTaskService.GetBoardTaskById(boardTaskId, cancellationToken);
            return Ok(boardTaskResponse);
        }

        [HttpPost]
        public async Task<IActionResult> CreateBoardTask([FromBody] BoardTaskRequest boardTaskRequest, CancellationToken cancellationToken)
        {
            var boardTaskResponse = await _boardTaskService.CreateBoardTask(boardTaskRequest, cancellationToken);
            return CreatedAtAction(nameof(GetBoardTaskById), new { boardTaskId = boardTaskResponse.Id}, boardTaskResponse);
        }

        [HttpDelete("{boardTaskId}")]
        public async Task<IActionResult> DeleteBoardTask(int boardTaskId, CancellationToken cancellationToken)
        {
            await _boardTaskService.DeleteBoardTask(boardTaskId, cancellationToken);
            return NoContent();
        }

        [HttpPut("{boardTaskId}")]
        public async Task<IActionResult> UpdateBoardTask(int boardTaskId, [FromBody] BoardTaskUpdateRequest boardTaskRequest, CancellationToken cancellationToken)
        {
            var boardTaskResponse = await _boardTaskService.UpdateBoardTask(boardTaskId, boardTaskRequest, cancellationToken);
            return Ok(boardTaskResponse);
        }

        [HttpPatch("{boardTaskId}")]
        public async Task<IActionResult> PatchBoardTask(int boardTaskId, [FromBody] JsonPatchDocument<BoardTaskUpdateRequest> taskBoardPatchDoc, CancellationToken cancellationToken)
        {
            var boardTaskResponse = await _boardTaskService.PatchBoardTask(boardTaskId, taskBoardPatchDoc, cancellationToken);
            return Ok(boardTaskResponse);
        }
    }
}
