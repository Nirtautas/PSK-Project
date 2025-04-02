﻿using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Services.Interfaces;

namespace WorthBoards.Api.Controllers
{
    [ApiController]
    [Route("api/boards")]
    public class BoardController(IBoardService _boardService) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetAllCurrentUserBoards(int? userId, CancellationToken cancellationToken, int pageNum = 0, int pageSize = 10)
        {
            if (userId == null)
            {
                string? userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int parsedUserId))
                    return Unauthorized("Invalid user ID.");

                userId = parsedUserId;
            }

            var (boards, totalCount) = await _boardService.GetUserBoardsAsync(userId.Value, pageNum, pageSize, cancellationToken);
            return Ok(new { TotalCount = totalCount, Boards = boards });
        }

        [HttpGet("{boardId}")]
        public async Task<IActionResult> GetBoardById(int boardId, CancellationToken cancellationToken)
        {
            var boardResponse = await _boardService.GetBoardByIdAsync(boardId, cancellationToken);
            return Ok(boardResponse);
        }

        [HttpPost]
        public async Task<IActionResult> CreateBoard(int? userId, [FromBody] BoardRequest boardRequest, CancellationToken cancellationToken)
        {
            if (userId == null)
            {
                string? userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int parsedUserId))
                    return Unauthorized("Invalid user ID.");

                userId = parsedUserId;
            }

            var boardResponse = await _boardService.CreateBoardAsync(userId.Value, boardRequest, cancellationToken);
            return CreatedAtAction(nameof(GetBoardById), new { boardId = boardResponse.Id}, boardResponse);
        }

        [HttpDelete("{boardId}")]
        public async Task<IActionResult> DeleteBoard(int boardId, CancellationToken cancellationToken)
        {
            await _boardService.DeleteBoardAsync(boardId, cancellationToken);
            return NoContent();
        }

        [HttpPut("{boardId}")]
        public async Task<IActionResult> UpdateBoard(int boardId, [FromBody] BoardUpdateRequest boardRequest, CancellationToken cancellationToken)
        {
            var boardResponse = await _boardService.UpdateBoardAsync(boardId, boardRequest, cancellationToken);
            return Ok(boardResponse);
        }

        [HttpPatch("{boardId}")]
        public async Task<IActionResult> PatchBoard(int boardId, [FromBody] JsonPatchDocument<BoardUpdateRequest> taskBoardPatchDoc, CancellationToken cancellationToken)
        {
            var boardResponse = await _boardService.PatchBoardAsync(boardId, taskBoardPatchDoc, cancellationToken);
            return Ok(boardResponse);
        }
    }
}
