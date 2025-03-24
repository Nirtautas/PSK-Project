using WorthBoards.Business.Dtos.Identity;

namespace WorthBoards.Business.Services.Interfaces
{
    public interface IAuthService
    {
        Task<UserResponse> RegisterUserAsync(UserRegisterRequest registerUser);
        Task<UserLoginResponse> LoginUserAsync(UserLoginRequest credentials);
    }
}
