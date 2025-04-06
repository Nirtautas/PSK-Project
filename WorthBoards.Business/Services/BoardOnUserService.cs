﻿using AutoMapper;
using Microsoft.AspNetCore.JsonPatch;
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
                ?? throw new NotFoundException(ExceptionFormatter.NotFound(nameof(BoardOnUser), [boardId, userId]));

            return _mapper.Map<LinkUserToBoardResponse>(boardToUserLink);
        }

        public async Task<LinkUserToBoardResponse> LinkUserToBoard(int boardId, int userId, LinkUserToBoardRequest linkUserToBoardRequest, CancellationToken cancellationToken)
        {
            //In the future check if user has invitation before allowing to link

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
                ?? throw new NotFoundException(ExceptionFormatter.NotFound(nameof(BoardOnUser), [boardId, userId]));

            if (boardOnUser.UserRole == UserRoleEnum.OWNER)
                throw new BadRequestException(ExceptionFormatter.BadRequestUnlinkOwner());

            _unitOfWork.BoardOnUserRepository.Delete(boardOnUser);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        public async Task<LinkUserToBoardResponse> UpdateUserOnBoard(int boardId, int userId, LinkUserToBoardRequest linkUserToBoardRequest, CancellationToken cancellationToken)
        {
            var boardOnUserToUpdate = await _unitOfWork.BoardOnUserRepository.GetByExpressionAsync(b => b.BoardId == boardId && b.UserId == userId, cancellationToken)
                ?? throw new NotFoundException(ExceptionFormatter.NotFound(nameof(BoardOnUser), [boardId, userId]));

            _mapper.Map(linkUserToBoardRequest,boardOnUserToUpdate);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return _mapper.Map<LinkUserToBoardResponse>(boardOnUserToUpdate);
        }

        public async Task<LinkUserToBoardResponse> PatchUserOnBoard(int boardId, int userId, JsonPatchDocument<LinkUserToBoardRequest> linkUserToBoardPatchDoc, CancellationToken cancellationToken)
        {
            var boardTaskToPatch = await _unitOfWork.BoardOnUserRepository.GetByExpressionAsync(b => b.BoardId == boardId && b.UserId == userId, cancellationToken)
                ?? throw new NotFoundException(ExceptionFormatter.NotFound(nameof(BoardOnUser), [boardId, userId]));

            var boardTaskToPatchDto = _mapper.Map<LinkUserToBoardRequest>(boardTaskToPatch);
            linkUserToBoardPatchDoc.ApplyTo(boardTaskToPatchDto);

            _mapper.Map(boardTaskToPatchDto, boardTaskToPatch);

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return _mapper.Map<LinkUserToBoardResponse>(boardTaskToPatch);
        }

        public async Task<IEnumerable<LinkedUserToBoardResponse>> GetUsersLinkedToBoardAsync(int boardId, CancellationToken cancellationToken)
        {
            IEnumerable<(BoardOnUser, ApplicationUser)> links = await _unitOfWork.BoardOnUserRepository.GetUsersLinkedToBoardAsync(boardId, cancellationToken);
            var linksDto = _mapper.Map<IEnumerable<LinkedUserToBoardResponse>>(links);

            return linksDto;
        }
    }
}
