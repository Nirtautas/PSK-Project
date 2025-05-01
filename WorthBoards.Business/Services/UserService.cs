using AutoMapper;
using System.Threading.Tasks;
using WorthBoards.Business.Dtos.Identity;
using WorthBoards.Business.Services.Interfaces;
using WorthBoards.Common.Exceptions.Custom;
using WorthBoards.Data.Identity;
using WorthBoards.Data.Repositories.Interfaces;

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
    }
}
