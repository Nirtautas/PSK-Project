using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using WorthBoards.Business.Services.Interfaces;
using WorthBoards.Common.Enums;

namespace WorthBoards.Api.Utils
{
    public class PermissionHandler(IBoardService boardService) : AuthorizationHandler<PermissionRequirement>
    {
        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
        {
            var httpContext = (context.Resource as DefaultHttpContext)?.HttpContext;
            var routeValues = httpContext?.Request.RouteValues;

            if (routeValues is null)
            {
                return;
            }

            var boardIdObj = routeValues.FirstOrDefault(kv => kv.Key.ToLower().EndsWith("id")).Value;
            var boardId = boardIdObj?.ToString();
            if (string.IsNullOrEmpty(boardId))
            {
                return;
            }

            var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId is null)
            {
                return;
            }

            var userRole = await boardService.GetUserRoleByBoardIdAndUserIdAsync(int.Parse(boardId), int.Parse(userId));

            if (userRole <= Enum.Parse<UserRoleEnum>(requirement.Role))
                context.Succeed(requirement);
        }
    }
}
