using WorthBoards.Business.Dtos.Identity;

namespace WorthBoards.Business.Services.Interfaces
{
    public interface IAuthService
    {
        Task<UserResponse> RegisterUserAsync(UserRegisterRequest registerUser, CancellationToken cancellationToken);
        Task<UserLoginResponse> LoginUserAsync(UserLoginRequest credentials, CancellationToken cancellationToken);
    }
}
