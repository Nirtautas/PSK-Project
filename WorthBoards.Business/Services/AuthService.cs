using AutoMapper;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using WorthBoards.Business.Dtos.Identity;
using WorthBoards.Business.Services.Interfaces;
using WorthBoards.Business.Utils.Interfaces;
using WorthBoards.Data.Database;
using WorthBoards.Data.Identity;
using WorthBoards.Common.Exceptions.Custom;
using Microsoft.AspNetCore.Identity.Data;
using WorthBoards.Business.Utils.EmailService;
using WorthBoards.Common.Constrants;
using WorthBoards.Business.Utils.EmailService.Interfaces;
using Microsoft.Extensions.Configuration;
using WorthBoards.Common.Exceptions;
using Newtonsoft.Json;
using WorthBoards.Business.Dtos.Responses;
using WorthBoards.Business.Dtos.Requests;
using Microsoft.EntityFrameworkCore;

namespace WorthBoards.Business.Services
{
    public class AuthService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IMapper mapper,
        ITokenGenerator tokenGenerator,
        ApplicationDbContext context,
        IEmailService emailService,
        IConfiguration configuration
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
            bool emailAlreadyExists = await userManager.Users.AnyAsync(u => u.Email == registerUser.Email);
            if (emailAlreadyExists)
                throw new BadRequestException($"There is already an account registered to {registerUser.Email}. Please log in!");

            var user = mapper.Map<ApplicationUser>(registerUser);
            user.CreationDate = DateTime.UtcNow;
            var response = await userManager.CreateAsync(user, registerUser.Password);

            ArgumentNullException.ThrowIfNull(response);

            await emailService.SendEmailAsync(new SendEmailRequest
            {
                RecipientName = user.UserName,
                RecipientEmail = user.Email,
                Subject = EmailMessages.TOPIC_WELCOME,
                Body = EmailMessages.BODY_REGISTER_WELCOME
            }, cancellationToken);

            return mapper.Map<UserResponse>(user);
        }

        public async Task<PasswordRecoveryResponse> ForgotPasswordAsync(ForgotPasswordRequest forgotPasswordRequest, CancellationToken cancellationToken)
        {
            var user = await userManager.FindByEmailAsync(forgotPasswordRequest.Email);


            if (user is not null)
            {
                var frontendBaseUrl = configuration["FrontendBaseUrl"];
                var token = await userManager.GeneratePasswordResetTokenAsync(user);
                var resetLink = $"{frontendBaseUrl}/reset-password?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(user.Email)}";

                await emailService.SendEmailAsync(new SendEmailRequest
                {
                    RecipientName = user.UserName,
                    RecipientEmail = user.Email,
                    Subject = EmailMessages.TOPIC_PASSWORD_RESET,
                    Body = $"{EmailMessages.BODY_PASSWORD_RESET}<br/><a href=\"{resetLink}\">Click here to reset your password</a>"
                }, cancellationToken);
            }

            return new PasswordRecoveryResponse(ApplicationMessages.MESSAGE_PASSWORD_FORGET);
        }

        public async Task<PasswordRecoveryResponse> ResetPasswordAsync(ResetPasswordRequest resetPasswordRequest, CancellationToken cancellationToken)
        {
            var user = await userManager.FindByEmailAsync(resetPasswordRequest.Email)
                ?? throw new BadRequestException(ErrorMessageConstants.INVALID_PASS_RECOVERY_CREDS);

            var response = await userManager.ResetPasswordAsync(user, resetPasswordRequest.ResetCode, resetPasswordRequest.NewPassword);

            if (!response.Succeeded)
                throw new BadRequestException(JsonConvert.SerializeObject(response.Errors));

            return new PasswordRecoveryResponse(ApplicationMessages.MESSAGE_PASSWORD_RESET_SUCCESSFULL);
        }

        public async Task<ChangePasswordResponse> ChangePasswordAsync(ChangePasswordRequest passwordChangeRequest, string userEmail, CancellationToken cancellationToken)
        {
            var user = await userManager.FindByEmailAsync(userEmail)
                ?? throw new NotFoundException(ErrorMessageConstants.NOT_FOUND_ERROR);

            var response = await userManager.ChangePasswordAsync(user, passwordChangeRequest.OldPassword, passwordChangeRequest.NewPassword);

            if (!response.Succeeded)
                throw new BadRequestException(JsonConvert.SerializeObject(response.Errors));

            return new ChangePasswordResponse(ApplicationMessages.MESSAGE_PASSWORD_CHANGE_SUCCESSFULL);
        }
    }
}
