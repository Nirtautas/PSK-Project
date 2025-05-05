using Microsoft.AspNetCore.Identity.Data;
using WorthBoards.Business.Dtos.Identity;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Dtos.Responses;

namespace WorthBoards.Business.Services.Interfaces
{
    public interface IAuthService
    {
        Task<UserResponse> RegisterUserAsync(UserRegisterRequest registerUser, CancellationToken cancellationToken);
        Task<UserLoginResponse> LoginUserAsync(UserLoginRequest credentials, CancellationToken cancellationToken);
        Task<PasswordRecoveryResponse> ForgotPasswordAsync(ForgotPasswordRequest forgotPasswordRequest, CancellationToken cancellationToken);
        Task<PasswordRecoveryResponse> ResetPasswordAsync(ResetPasswordRequest resetPasswordRequest, CancellationToken cancellationToken);
        Task<ChangePasswordResponse> ChangePasswordAsync(ChangePasswordRequest passwordChangeRequest, string userEmail, CancellationToken cancellationToken);
    }
}
