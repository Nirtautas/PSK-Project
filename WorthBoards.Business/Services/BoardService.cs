using AutoMapper;
using Microsoft.AspNetCore.JsonPatch;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Dtos.Responses;
using WorthBoards.Business.Services.Interfaces;
using WorthBoards.Common.Enums;
using WorthBoards.Common.Exceptions.Custom;
using WorthBoards.Data.Repositories.Interfaces;
using WorthBoards.Domain.Entities;

namespace WorthBoards.Business.Services
{
    public class BoardService(IUnitOfWork _unitOfWork, IMapper _mapper) : IBoardService
    {
        public async Task<(List<BoardResponse> Results, int TotalCount)> GetUserBoardsAsync(
            int userId, int pageNum, int pageSize, CancellationToken cancellationToken)
        {
            var (boards, totalCount) = await _unitOfWork.BoardOnUserRepository
                .GetUserBoardsAsync(userId, pageSize, pageNum, cancellationToken);

            var boardResponses = _mapper.Map<List<BoardResponse>>(boards);
            return (boardResponses, totalCount);
        }

        public async Task<BoardResponse> GetBoardByIdAsync(int boardId, CancellationToken cancellationToken)
        {
            var board = await _unitOfWork.BoardRepository.GetByIdAsync(boardId, cancellationToken)
                ?? throw new NotFoundException(ExceptionFormatter.NotFound(nameof(Board), [boardId]));

            return _mapper.Map<BoardResponse>(board);
        }

        public async Task<BoardResponse> CreateBoardAsync(int userId, BoardRequest boardDto, CancellationToken cancellationToken)
        {
            var board = _mapper.Map<Board>(boardDto);

            await _unitOfWork.BoardRepository.CreateAsync(board, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var boardOnUser = new BoardOnUser
            {
                BoardId = board.Id, 
                UserId = userId,    
                UserRole = UserRoleEnum.OWNER 
            };
          
            await _unitOfWork.BoardOnUserRepository.CreateAsync(boardOnUser, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return _mapper.Map<BoardResponse>(board);
        }

        public async Task DeleteBoardAsync(int boardId, CancellationToken cancellationToken)
        {
            var boardToDelete = await _unitOfWork.BoardRepository.GetByIdAsync(boardId, cancellationToken)
                ?? throw new NotFoundException(ExceptionFormatter.NotFound(nameof(Board), [boardId]));

            _unitOfWork.BoardRepository.Delete(boardToDelete); ;
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        public async Task<BoardResponse> UpdateBoardAsync(int boardToUpdateId, BoardUpdateRequest boardDto, CancellationToken cancellationToken)
        {
            var boardToUpdate = await _unitOfWork.BoardRepository.GetByIdAsync(boardToUpdateId, cancellationToken)
                ?? throw new NotFoundException(ExceptionFormatter.NotFound(nameof(Board), [boardToUpdateId]));

            _mapper.Map(boardDto, boardToUpdate);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return _mapper.Map<BoardResponse>(boardToUpdate);
        }

        public async Task<BoardResponse> PatchBoardAsync(int boardToUpdateId, JsonPatchDocument<BoardUpdateRequest> boardPatchDoc, CancellationToken cancellationToken)
        {
            var boardToPatch = await _unitOfWork.BoardRepository.GetByIdAsync(boardToUpdateId, cancellationToken)
                ?? throw new NotFoundException(ExceptionFormatter.NotFound(nameof(Board), [boardToUpdateId]));

            var boardToUpdateDto = _mapper.Map<BoardUpdateRequest>(boardToPatch);

            boardPatchDoc.ApplyTo(boardToUpdateDto);
            _mapper.Map(boardToUpdateDto, boardToPatch);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return _mapper.Map<BoardResponse>(boardToPatch);
        }

        public async Task<UserRoleEnum?> GetUserRoleByBoardIdAndUserIdAsync(int boardId, int userId)
        {
            var board = await _unitOfWork.BoardOnUserRepository.GetByExpressionAsync(b => b.UserId == userId && b.BoardId == boardId);

            return board?.UserRole;
        }
    }
}
