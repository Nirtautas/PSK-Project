using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorthBoards.Business.Dtos.Identity;
using WorthBoards.Business.Services.Interfaces;
using WorthBoards.Common.Exceptions.Custom;

namespace WorthBoards.Api.Controllers
{
    [Route("/")]
    [ApiController]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        [AllowAnonymous]
        [HttpPost("/register")]
        public async Task<IActionResult> RegisterUserAsync([FromBody] UserRegisterRequest request)
        {
            try
            {
                var response = await authService.RegisterUserAsync(request);
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
        public async Task<IActionResult> LoginUserAsync([FromBody] UserLoginRequest credentials)
        {
            try
            {
                var response = await authService.LoginUserAsync(credentials);
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
    }
}
