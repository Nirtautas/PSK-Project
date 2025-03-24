using Microsoft.AspNetCore.Authorization;

namespace WorthBoards.Api.Utils
{
    public class PermissionHandler : AuthorizationHandler<PermissionRequirement>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
        {
            var httpContext = (context.Resource as DefaultHttpContext)?.HttpContext;
            var routeValues = httpContext?.Request.RouteValues;

            if (routeValues == null)
            {
                return Task.CompletedTask;
            }

            var boardIdObj = routeValues.FirstOrDefault(kv => kv.Key.EndsWith("Id")).Value;
            var boardId = boardIdObj?.ToString();
            if (string.IsNullOrEmpty(boardId))
            {
                return Task.CompletedTask;
            }

            var hasPermission = context.User.Claims
                .Where(c => c.Type == "BoardPermission")
                .Any(c => c.Value == $"{boardId}:{requirement.Role}");

            if (hasPermission)
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }
}
