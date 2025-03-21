using Microsoft.AspNetCore.Mvc;
using WorthBoards.Api.Utils;
using WorthBoards.Business.Dtos.Identity;
using WorthBoards.Business.Services.Interfaces;
using WorthBoards.Common.Enums;

namespace WorthBoards.Api.Controllers
{
    [Route("/")]
    [ApiController]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        [HttpPost("/register")]
        public async Task<IActionResult> RegisterUserAsync(int Id, [FromBody] UserRegisterRequest request)
        {
            var response = await authService.RegisterUserAsync(request);
            return Ok(response);
        }

        [HttpPost("/login")]
        public async Task<IActionResult> LoginUserAsync([FromBody] UserLoginRequest credentials)
        {
            var response = await authService.LoginUserAsync(credentials);
            return Ok(response);
        }
    }
}
