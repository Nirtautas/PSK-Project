using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.JsonPatch;
using System.Security.Claims;
using System.Threading.Tasks;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Dtos.Responses;
using WorthBoards.Business.Services.Interfaces;
using WorthBoards.Common.Enums;
using WorthBoards.Common.Exceptions;
using WorthBoards.Common.Exceptions.Custom;
using WorthBoards.Data.Identity;
using WorthBoards.Data.Repositories.Interfaces;
using WorthBoards.Domain.Entities;

namespace WorthBoards.Business.Services
{
    public class BoardService(IUnitOfWork _unitOfWork, IMapper _mapper, UserManager<ApplicationUser> userManager) : IBoardService
    {
        public async Task<IEnumerable<BoardResponse>> GetUserBoards(int userId, int pageNum, int pageSize, CancellationToken cancellationToken)
        {
            var boardTasks = await _unitOfWork.BoardOnUserRepository.GetAllByExpressionAsync(t => t.UserId == userId, cancellationToken);

            return _mapper.Map<IEnumerable<BoardResponse>>(boardTasks);

        }

        public async Task<BoardResponse> GetBoardById(int boardId, CancellationToken cancellationToken)
        {
            var board = await _unitOfWork.BoardRepository.GetByIdAsync(boardId, cancellationToken)
                ?? throw new Exception($"Board [id {boardId}] doesn't exist.");

            return _mapper.Map<BoardResponse>(board);
        }

        public async Task<BoardResponse> CreateBoard(BoardRequest boardDto, CancellationToken cancellationToken)
        {
            var board = _mapper.Map<Board>(boardDto);

            await _unitOfWork.BoardRepository.CreateAsync(board, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return _mapper.Map<BoardResponse>(board);
        }

        public async Task DeleteBoard(int boardId, CancellationToken cancellationToken)
        {
            var boardToDelete = await _unitOfWork.BoardRepository.GetByIdAsync(boardId, cancellationToken)
                ?? throw new Exception($"Board [id {boardId}] doesn't exist.");

            _unitOfWork.BoardRepository.Delete(boardToDelete); ;
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        public async Task<BoardResponse> UpdateBoard(int boardToUpdateId, BoardUpdateRequest boardDto, CancellationToken cancellationToken)
        {
            var boardToUpdate = await _unitOfWork.BoardRepository.GetByIdAsync(boardToUpdateId, cancellationToken)
                ?? throw new Exception($"Board [id {boardToUpdateId}] doesn't exist.");

            _mapper.Map(boardDto, boardToUpdate);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return _mapper.Map<BoardResponse>(boardToUpdate);
        }

        public async Task<BoardResponse> PatchBoard(int boardToUpdateId, JsonPatchDocument<BoardUpdateRequest> boardPatchDoc, CancellationToken cancellationToken)
        {
            var boardToPatch = await _unitOfWork.BoardRepository.GetByIdAsync(boardToUpdateId, cancellationToken)
                ?? throw new Exception($"Board [id {boardToUpdateId}] doesn't exist.");

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
