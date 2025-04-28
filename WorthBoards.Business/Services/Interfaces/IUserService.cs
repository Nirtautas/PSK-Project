using WorthBoards.Business.Dtos.Identity;

namespace WorthBoards.Business.Services.Interfaces
{
    public interface IUserService
    {
        public Task<UserResponse> GetUserById(int id, CancellationToken cancellationToken);
    }
}
