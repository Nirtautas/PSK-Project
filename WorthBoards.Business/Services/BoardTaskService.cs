using AutoMapper;
using Microsoft.AspNetCore.JsonPatch;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Dtos.Responses;
using WorthBoards.Business.Services.Interfaces;
using WorthBoards.Data.Repositories.Interfaces;
using WorthBoards.Domain.Entities;

namespace WorthBoards.Business.Services
{
    public class BoardTaskService(IUnitOfWork _unitOfWork, IMapper _mapper) : IBoardTaskService
    {
        public async Task<BoardTaskResponse> GetBoardTaskById(int boardTaskId, CancellationToken cancellationToken)
        {
            var boardTask = await _unitOfWork.BoardTaskRepository.GetByIdAsync(boardTaskId, cancellationToken);
            //if (boardTask == null) Throw exception

            return _mapper.Map<BoardTaskResponse>(boardTask);
        }

        public async Task<BoardTaskResponse> CreateBoardTask(BoardTaskRequest boardTaskDto, CancellationToken cancellationToken)
        {
            var boardTask = _mapper.Map<BoardTask>(boardTaskDto);

            var board = await _unitOfWork.BoardRepository.GetByIdAsync(boardTask.Id, cancellationToken);
            //if (board == null) throw exception

            await _unitOfWork.BoardTaskRepository.CreateAsync(boardTask, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return _mapper.Map<BoardTaskResponse>(boardTask);
        }

        public async Task DeleteBoardTask(int boardTaskId, CancellationToken cancellationToken)
        {
            var boardTaskToDelete = await _unitOfWork.BoardTaskRepository.GetByIdAsync(boardTaskId, cancellationToken);
            // if (boardTaskToDelete == null) Throw exception

            _unitOfWork.BoardTaskRepository.Delete(boardTaskToDelete); ;
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        public async Task<BoardTaskResponse> UpdateBoardTask(int boardTaskToUpdateId, BoardTaskUpdateRequest boardTaskDto, CancellationToken cancellationToken)
        {
            var boardTaskToUpdate = await _unitOfWork.BoardTaskRepository.GetByIdAsync(boardTaskToUpdateId, cancellationToken);
            // if (boardToUpdate == null) Throw exception

            _mapper.Map(boardTaskDto, boardTaskToUpdate);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return _mapper.Map<BoardTaskResponse>(boardTaskToUpdate);
        }

        public async Task<BoardTaskResponse> PatchBoardTask(int boardTaskToUpdateId, JsonPatchDocument<BoardTaskUpdateRequest> taskBoardPatchDoc, CancellationToken cancellationToken)
        {
            var boardTaskToPatch = await _unitOfWork.BoardTaskRepository.GetByIdAsync(boardTaskToUpdateId, cancellationToken);
            // if (boardTaskToPatch == null) Throw exception

            var boardTaskToUpdateDto = _mapper.Map<BoardTaskUpdateRequest>(boardTaskToPatch);

            taskBoardPatchDoc.ApplyTo(boardTaskToUpdateDto);
            _mapper.Map(boardTaskToUpdateDto, boardTaskToPatch);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return _mapper.Map<BoardTaskResponse>(boardTaskToPatch);
        }
    }
}
