using Microsoft.AspNetCore.Identity;
using WorthBoards.Business.Dtos.Identity;
using WorthBoards.Business.Services.Interfaces;
using WorthBoards.Data.Identity;

namespace WorthBoards.Business.Services
{
    public class AuthService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        RoleManager<ApplicationRole> roleManager
    ) : IAuthService
    {
        public Task<UserLoginResponse> LoginUserAsync(UserLoginRequest credentials)
        {
            throw new NotImplementedException();
        }

        public Task<UserResponse> RegisterUserAsync(UserRegisterRequest registerUser)
        {
            throw new NotImplementedException();
        }
    }
}
