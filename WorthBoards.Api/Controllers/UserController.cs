using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WorthBoards.Api.Utils;
using WorthBoards.Business.Services.Interfaces;

namespace WorthBoards.Api.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController(IUserService _userService) : ControllerBase
    {
        [HttpGet("{userId}")]
        [Authorize]
        public async Task<IActionResult> GetUserById(int? userId, CancellationToken cancellationToken)
        {
            if (userId == null)
            {
                var userID = UserHelper.GetUserId(User);
                if (userID.Result is UnauthorizedObjectResult unauthorizedResult)
                    return unauthorizedResult;

                userId = userID.Value;
            }

            var userResponse = await _userService.GetUserById(userId.Value, cancellationToken);
            return Ok(userResponse);
        }
    }
}
