using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using WorthBoards.Api.Utils;
using WorthBoards.Business.Dtos.Identity;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Services;
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

        [HttpPut("{userId}")]
        [Authorize]
        public async Task<IActionResult> PatchUserOnBoard(int userId, [FromBody] JsonPatchDocument<UserPatchRequest> userPatchDoc, CancellationToken cancellationToken)
        {
            var userResponse = await _userService.PatchUser(userId, userPatchDoc, cancellationToken);
            return Ok(userResponse);
        }
    }
}
