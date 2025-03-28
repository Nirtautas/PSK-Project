﻿using AutoMapper;
using Microsoft.AspNetCore.JsonPatch;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Dtos.Responses;
using WorthBoards.Business.Services.Interfaces;
using WorthBoards.Common.Exceptions;
using WorthBoards.Common.Exceptions.Custom;
using WorthBoards.Data.Repositories.Interfaces;
using WorthBoards.Domain.Entities;

namespace WorthBoards.Business.Services
{
    public class BoardTaskService(IUnitOfWork _unitOfWork, IMapper _mapper) : IBoardTaskService
    {
        public async Task<BoardTaskResponse> GetBoardTaskById(int boardId, int boardTaskId, CancellationToken cancellationToken)
        {
            var boardTask = await _unitOfWork.BoardTaskRepository.GetByExpressionAsync(t => t.Id == boardTaskId && t.BoardId == boardId, cancellationToken)
                ?? throw new NotFoundException(ErrorMessageConstants.NOT_FOUND_ERROR);

            return _mapper.Map<BoardTaskResponse>(boardTask);
        }

        public async Task<BoardTaskResponse> CreateBoardTask(int boardId, BoardTaskRequest boardTaskDto, CancellationToken cancellationToken)
        {
            var boardTask = _mapper.Map<BoardTask>(boardTaskDto);
            boardTask.BoardId = boardId;

            var board = await _unitOfWork.BoardRepository.GetByIdAsync(boardTask.BoardId, cancellationToken)
                ?? throw new NotFoundException(ErrorMessageConstants.NOT_FOUND_ERROR);

            await _unitOfWork.BoardTaskRepository.CreateAsync(boardTask, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return _mapper.Map<BoardTaskResponse>(boardTask);
        }

        public async Task DeleteBoardTask(int boardId, int boardTaskId, CancellationToken cancellationToken)
        {
            var boardTaskToDelete = await _unitOfWork.BoardTaskRepository.GetByExpressionAsync(t => t.Id == boardTaskId && t.BoardId == boardId, cancellationToken)
                ?? throw new NotFoundException(ErrorMessageConstants.NOT_FOUND_ERROR);

            _unitOfWork.BoardTaskRepository.Delete(boardTaskToDelete); ;
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        public async Task<BoardTaskResponse> UpdateBoardTask(int boardId, int boardTaskToUpdateId, BoardTaskRequest boardTaskDto, CancellationToken cancellationToken)
        {
            var boardTaskToUpdate = await _unitOfWork.BoardTaskRepository.GetByExpressionAsync(t => t.Id == boardTaskToUpdateId && t.BoardId == boardId, cancellationToken)
                ?? throw new NotFoundException(ErrorMessageConstants.NOT_FOUND_ERROR);

            _mapper.Map(boardTaskDto, boardTaskToUpdate);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return _mapper.Map<BoardTaskResponse>(boardTaskToUpdate);
        }

        public async Task<BoardTaskResponse> PatchBoardTask(int boardId, int boardTaskToUpdateId, JsonPatchDocument<BoardTaskRequest> taskBoardPatchDoc, CancellationToken cancellationToken)
        {
            var boardTaskToPatch = await _unitOfWork.BoardTaskRepository.GetByExpressionAsync(t => t.Id == boardTaskToUpdateId && t.BoardId == boardId, cancellationToken)
                ?? throw new NotFoundException(ErrorMessageConstants.NOT_FOUND_ERROR);

            var boardTaskToUpdateDto = _mapper.Map<BoardTaskRequest>(boardTaskToPatch);

            taskBoardPatchDoc.ApplyTo(boardTaskToUpdateDto);
            _mapper.Map(boardTaskToUpdateDto, boardTaskToPatch);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return _mapper.Map<BoardTaskResponse>(boardTaskToPatch);
        }
    }
}
