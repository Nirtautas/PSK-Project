﻿using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using WorthBoards.Api.Utils;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Services.Interfaces;
using WorthBoards.Common.Enums;

namespace WorthBoards.Api.Controllers
{
    [ApiController]
    [Route("api/boards")]
    public class BoardTaskController(IBoardTaskService _boardTaskService) : ControllerBase
    {
        [HttpGet("{boardId}/tasks")]
        [AuthorizeRole(UserRoleEnum.VIEWER)]
        public async Task<IActionResult> GetAllActiveBoardTasks(int boardId, CancellationToken cancellationToken)
        {
            IEnumerable<TaskStatusEnum> taskStatuses = [TaskStatusEnum.PENDING, TaskStatusEnum.IN_PROGRESS, TaskStatusEnum.COMPLETED];
            var boardTasksResponse = await _boardTaskService.GetBoardTasks(boardId, taskStatuses, cancellationToken);

            return Ok(boardTasksResponse);
        }

        [HttpGet("{boardId}/tasks/archived")]
        [AuthorizeRole(UserRoleEnum.VIEWER)]
        public async Task<IActionResult> GetAllArchivedBoardTasks(int boardId, CancellationToken cancellationToken)
        {
            IEnumerable<TaskStatusEnum> taskStatuses = [TaskStatusEnum.ARCHIVED];
            var boardTasksResponse = await _boardTaskService.GetBoardTasks(boardId, taskStatuses, cancellationToken);

            return Ok(boardTasksResponse);
        }

        [HttpGet("{boardId}/tasks/{boardTaskId}")]
        [AuthorizeRole(UserRoleEnum.VIEWER)]
        public async Task<IActionResult> GetBoardTaskById(int boardId, int boardTaskId, CancellationToken cancellationToken)
        {
            var boardTaskResponse = await _boardTaskService.GetBoardTaskById(boardId, boardTaskId, cancellationToken);
            return Ok(boardTaskResponse);
        }

        [HttpPost("{boardId}/tasks")]
        [AuthorizeRole(UserRoleEnum.EDITOR)]
        public async Task<IActionResult> CreateBoardTask(int boardId, [FromBody] BoardTaskRequest boardTaskRequest, CancellationToken cancellationToken)
        {
            var boardTaskResponse = await _boardTaskService.CreateBoardTask(boardId, boardTaskRequest, cancellationToken);
            return CreatedAtAction(nameof(GetBoardTaskById), new { boardId = boardId, boardTaskId = boardTaskResponse.Id}, boardTaskResponse);
        }

        [HttpDelete("{boardId}/tasks/{boardTaskId}")]
        [AuthorizeRole(UserRoleEnum.EDITOR)]
        public async Task<IActionResult> DeleteBoardTask(int boardId, int boardTaskId, CancellationToken cancellationToken)
        {
            await _boardTaskService.DeleteBoardTask(boardId, boardTaskId, cancellationToken);
            return NoContent();
        }

        [HttpPut("{boardId}/tasks/{boardTaskId}")]
        [AuthorizeRole(UserRoleEnum.EDITOR)]
        public async Task<IActionResult> UpdateBoardTask(int boardId, int boardTaskId, [FromBody] BoardTaskRequest boardTaskRequest, CancellationToken cancellationToken)
        {
            var boardTaskResponse = await _boardTaskService.UpdateBoardTask(boardId, boardTaskId, boardTaskRequest, cancellationToken);
            return Ok(boardTaskResponse);
        }

        [HttpPatch("{boardId}/tasks/{boardTaskId}")]
        [AuthorizeRole(UserRoleEnum.EDITOR)]
        public async Task<IActionResult> PatchBoardTask(int boardId, int boardTaskId, [FromBody] JsonPatchDocument<BoardTaskRequest> taskBoardPatchDoc, CancellationToken cancellationToken)
        {
            var boardTaskResponse = await _boardTaskService.PatchBoardTask(boardId, boardTaskId, taskBoardPatchDoc, cancellationToken);
            return Ok(boardTaskResponse);
        }
    }
}
