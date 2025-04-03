using AutoMapper;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Dtos.Responses;
using WorthBoards.Business.Services.Interfaces;
using WorthBoards.Common.Exceptions;
using WorthBoards.Common.Exceptions.Custom;
using WorthBoards.Data.Repositories.Interfaces;
using WorthBoards.Domain.Entities;

namespace WorthBoards.Business.Services
{
    public class BoardOnUserService(IUnitOfWork _unitOfWork, IMapper _mapper) : IBoardOnUserService
    {
        public async Task<IEnumerable<LinkUserToBoardResponse>> GetAllBoardToUserLinks(int boardId, CancellationToken cancellationToken)
        {
            var boardToUserLinks = await _unitOfWork.BoardOnUserRepository.GetAllByExpressionAsync(b => b.BoardId == boardId, cancellationToken);

            return _mapper.Map<IEnumerable<LinkUserToBoardResponse>>(boardToUserLinks);
        }

        public async Task<LinkUserToBoardResponse> GetBoardToUserLink(int boardId, int userId, CancellationToken cancellationToken)
        {
            var boardToUserLink = await _unitOfWork.BoardOnUserRepository.GetByExpressionAsync(b => b.BoardId == boardId && b.UserId == userId, cancellationToken)
                ?? throw new NotFoundException(ErrorMessageConstants.NOT_FOUND_ERROR);

            return _mapper.Map<LinkUserToBoardResponse>(boardToUserLink);
        }

        public async Task<LinkUserToBoardResponse> LinkUserToBoard(int boardId, int userId, LinkUserToBoardRequest linkUserToBoardRequest, CancellationToken cancellationToken)
        {
            //Check for multiple owners!
            var boardOnUser = _mapper.Map<BoardOnUser>(linkUserToBoardRequest);
            boardOnUser.BoardId = boardId;
            boardOnUser.UserId = userId;

            await _unitOfWork.BoardOnUserRepository.CreateAsync(boardOnUser, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return _mapper.Map<LinkUserToBoardResponse>(boardOnUser); 
        }

        public async Task UnlinkUserFromBoard(int boardId, int userId, CancellationToken cancellationToken)
        {
            var boardOnUser = await _unitOfWork.BoardOnUserRepository.GetByExpressionAsync(b => b.BoardId == boardId && b.UserId == userId, cancellationToken)
                ?? throw new NotFoundException(ErrorMessageConstants.NOT_FOUND_ERROR);

            _unitOfWork.BoardOnUserRepository.Delete(boardOnUser);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        public async Task<LinkUserToBoardResponse> UpdateUserOnBoard(int boardId, int userId, LinkUserToBoardRequest linkUserToBoardRequest, CancellationToken cancellationToken)
        {
            var boardOnUserToUpdate = await _unitOfWork.BoardOnUserRepository.GetByExpressionAsync(b => b.BoardId == boardId && b.UserId == userId, cancellationToken)
                ?? throw new NotFoundException(ErrorMessageConstants.NOT_FOUND_ERROR);

            //Check for multiple owners!

            _mapper.Map(linkUserToBoardRequest,boardOnUserToUpdate);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return _mapper.Map<LinkUserToBoardResponse>(boardOnUserToUpdate);
        }

        public async Task<LinkUserToBoardResponse> PatchUserOnBoard(int boardId, int userId, JsonPatchDocument<LinkUserToBoardRequest> linkUserToBoardPatchDoc, CancellationToken cancellationToken)
        {
            var boardTaskToPatch = await _unitOfWork.BoardOnUserRepository.GetByExpressionAsync(b => b.BoardId == boardId && b.UserId == userId, cancellationToken)
                ?? throw new NotFoundException(ErrorMessageConstants.NOT_FOUND_ERROR);

            //Check for multiple owners!

            var boardTaskToPatchDto = _mapper.Map<LinkUserToBoardRequest>(boardTaskToPatch);
            linkUserToBoardPatchDoc.ApplyTo(boardTaskToPatchDto);
            _mapper.Map(boardTaskToPatchDto, boardTaskToPatch);

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return _mapper.Map<LinkUserToBoardResponse>(boardTaskToPatch);
        }
    }
}
