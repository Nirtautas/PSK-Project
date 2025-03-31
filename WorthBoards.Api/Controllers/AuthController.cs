using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorthBoards.Business.Dtos.Identity;
using WorthBoards.Business.Services.Interfaces;

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
            var response = await authService.RegisterUserAsync(request);
            return Ok(response);
        }

        [AllowAnonymous]
        [HttpPost("/login")]
        public async Task<IActionResult> LoginUserAsync([FromBody] UserLoginRequest credentials)
        {
            var response = await authService.LoginUserAsync(credentials);
            return Ok(response);
        }
    }
}
