using AutoMapper;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WorthBoards.Business.Dtos.Identity;
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
    public class UserService(IUnitOfWork _unitOfWork, IMapper _mapper) : IUserService
    {
        public async Task<UserResponse> GetUserById(int id, CancellationToken cancellationToken)
        {
            var user = await _unitOfWork.UserRepository.GetByIdAsync(id, cancellationToken)
                ?? throw new NotFoundException($"User with Id: {id} not found");

            var userDto = _mapper.Map<UserResponse>(user);

            return userDto;
        }

        public async Task<UserPatchResponse> PatchUser(int userId, JsonPatchDocument<UserPatchRequest> userPatchDoc, CancellationToken cancellationToken)
        {
            var oldUserToPatch = await _unitOfWork.UserRepository.GetByExpressionAsync(b => b.Id == userId, cancellationToken)
                ?? throw new BadRequestException(ExceptionFormatter.NotFound(nameof(ApplicationUser), [userId]));

            var userToPatchDto = _mapper.Map<UserPatchRequest>(oldUserToPatch);
            userPatchDoc.ApplyTo(userToPatchDto);

            _mapper.Map(userToPatchDto, oldUserToPatch);

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return _mapper.Map<UserPatchResponse>(oldUserToPatch);
        }
    }
}
