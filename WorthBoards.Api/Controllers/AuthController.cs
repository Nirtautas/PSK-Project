using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WorthBoards.Business.Dtos.Identity;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Services.Interfaces;
using WorthBoards.Common.Exceptions;
using WorthBoards.Common.Exceptions.Custom;

namespace WorthBoards.Api.Controllers
{
    [Route("/")]
    [ApiController]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        [AllowAnonymous]
        [HttpPost("/register")]
        public async Task<IActionResult> RegisterUserAsync([FromBody] UserRegisterRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var response = await authService.RegisterUserAsync(request, cancellationToken);
                return Ok(response);
            }
            catch (BadRequestException ex)
            {
                return BadRequest(new { Error = ex.Message.Split("; ") });
            }
            catch (Exception)
            {
                return Problem();
            }
        }

        [AllowAnonymous]
        [HttpPost("/login")]
        public async Task<IActionResult> LoginUserAsync([FromBody] UserLoginRequest credentials, CancellationToken cancellationToken)
        {
            try
            {
                var response = await authService.LoginUserAsync(credentials, cancellationToken);
                return Ok(response);
            }
            catch (UnauthorizedException)
            {
                return Unauthorized();
            }
            catch (NotFoundException)
            {
                return Unauthorized();
            }
            catch (Exception)
            {
                return Problem();
            }
        }

        [AllowAnonymous]
        [HttpPost("/forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest forgotPasswordRequest, CancellationToken cancellationToken)
        {
            var response = await authService.ForgotPasswordAsync(forgotPasswordRequest, cancellationToken);

            return Ok(response);
        }

        [AllowAnonymous]
        [HttpPost("/reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest resetPasswordRequest, CancellationToken cancellationToken)
        {
            var response = await authService.ResetPasswordAsync(resetPasswordRequest, cancellationToken);

            return Ok(response);
        }

        [Authorize]
        [HttpPost("/change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest changePasswordRequest, CancellationToken cancellationToken)
        {
            var email = User.FindFirstValue(ClaimTypes.Email)
                ?? throw new UnauthorizedAccessException(ErrorMessageConstants.EMAIL_NOT_FOUND_IN_TOKEN);

            var response = await authService.ChangePasswordAsync(changePasswordRequest, email, cancellationToken);

            return Ok(response);
        }
    }
}
