using Microsoft.AspNetCore.JsonPatch;
using WorthBoards.Business.Dtos.Identity;

namespace WorthBoards.Business.Services.Interfaces
{
    public interface IUserService
    {
        Task<UserResponse> GetUserById(int id, CancellationToken cancellationToken);
        Task<UserUpdateResponse> UpdateUser(int userId, UserUpdateRequest userUpdateRequest, CancellationToken cancellationToken);
    }
}
