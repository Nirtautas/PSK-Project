using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WorthBoards.Business.Dtos.Identity;
using WorthBoards.Business.Services.Interfaces;
using WorthBoards.Business.Utils.Interfaces;
using WorthBoards.Data.Database;
using WorthBoards.Data.Identity;
using WorthBoards.Common.Exceptions.Custom;
using System.Diagnostics;

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
        public async Task<UserLoginResponse> LoginUserAsync(UserLoginRequest credentials, CancellationToken cancellationToken)
        {
            var user = await userManager.FindByNameAsync(credentials.UserName);

            if (user is null)
                throw new NotFoundException("User not found.");

            var result = await signInManager.CheckPasswordSignInAsync(user, credentials.Password, false);

            if (!result.Succeeded)
                throw new UnauthorizedException("Invalid Login credentials.");

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName ?? string.Empty),
                new Claim(ClaimTypes.Email, user.Email ?? string.Empty)
            };

            var jwtToken = tokenGenerator.GenerateJwtToken(claims);
            
            return new UserLoginResponse(user.Id, credentials.UserName, jwtToken);
        }

        public async Task<UserResponse> RegisterUserAsync(UserRegisterRequest registerUser, CancellationToken cancellationToken)
        {
            int maxNumOfCharsInName = 30;
            if (registerUser.FirstName.Length > maxNumOfCharsInName || registerUser.LastName.Length > maxNumOfCharsInName)
            {
                throw new BadRequestException($"First Name and Last Name must be at most {maxNumOfCharsInName} characters long.");
            }

            if (registerUser.UserName.Length > maxNumOfCharsInName)
            {
                throw new BadRequestException($"Username must be at most {maxNumOfCharsInName} characters long.");
            }

            var user = mapper.Map<ApplicationUser>(registerUser);

            user.CreationDate = DateTime.UtcNow;

            var response = await userManager.CreateAsync(user, registerUser.Password);

            if (!response.Succeeded)
            {
                var errors = response.Errors.Select(e => e.Description).ToList();
                throw new BadRequestException(string.Join("; ", errors));
            }

            ArgumentNullException.ThrowIfNull(response);

            return mapper.Map<UserResponse>(user);
        }
    }
}
