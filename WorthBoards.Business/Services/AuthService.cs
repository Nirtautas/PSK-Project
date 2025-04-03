using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WorthBoards.Business.Dtos.Identity;
using WorthBoards.Business.Services.Interfaces;
using WorthBoards.Business.Utils.Interfaces;
using WorthBoards.Data.Database;
using WorthBoards.Data.Identity;

namespace WorthBoards.Business.Services
{
    public class AuthService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IMapper mapper,
        ITokenGenerator tokenGenerator,
        ApplicationDbContext context
    ) : IAuthService
    {
        public async Task<UserLoginResponse> LoginUserAsync(UserLoginRequest credentials)
        {
            var user = await userManager.FindByNameAsync(credentials.UserName);

            // TODO: Add custom exception handle
            if (user is null)
                throw new UnauthorizedAccessException("Invalid Login credentials.");

            var result = await signInManager.CheckPasswordSignInAsync(user, credentials.Password, false);

            // TODO: Add custom exception handle
            if (!result.Succeeded)
                throw new UnauthorizedAccessException("Invalid Login credentials.");

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName ?? string.Empty),
                new Claim(ClaimTypes.Email, user.Email ?? string.Empty)
            };

            var jwtToken = tokenGenerator.GenerateJwtToken(claims);
            
            return new UserLoginResponse(user.Id, credentials.UserName, jwtToken);
        }

        public async Task<UserResponse> RegisterUserAsync(UserRegisterRequest registerUser)
        {
            var user = mapper.Map<ApplicationUser>(registerUser);

            user.CreationDate = DateTime.UtcNow;

            var response = await userManager.CreateAsync(user, registerUser.Password);

            // TODO: Add custom exception handle
            if (!response.Succeeded)
                throw new DbUpdateException("Failed to register user");

            return mapper.Map<UserResponse>(user);
        }
    }
}
