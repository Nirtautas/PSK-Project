using Microsoft.AspNetCore.Mvc.Filters;
using Serilog.Context;
using WorthBoards.Api.Utils;
using WorthBoards.Business.Services.Interfaces;
using WorthBoards.Common.Enums;

namespace WorthBoards.Api.Filters.ActionFilters
{
    public class ControllerLoggingActionFilter : IAsyncActionFilter
    {
        private readonly ILogger<ControllerLoggingActionFilter> _logger;
        private readonly IBoardService _boardService;

        public ControllerLoggingActionFilter(ILogger<ControllerLoggingActionFilter> logger, IBoardService boardService)
        {
            _logger = logger;
            _boardService = boardService;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            await OnActionExecuting(context);

            var resultContext = await next();

            OnActionExecuted(resultContext);
        }

        public async Task OnActionExecuting(ActionExecutingContext context)
        {
            var role = (await GetRoleAsync(context.HttpContext)).ToString();

            using (LogContext.PushProperty("LogType", "Controller"))
            {
                _logger.LogInformation("Executing action - {ActionName}, Controller: {ControllerName}, User: {UserName}, BoardRole: {BoardRole}",
                    GetActionName(context),
                    GetControllerName(context),
                    GetUsername(context.HttpContext),
                    role);
            }
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            using (LogContext.PushProperty("LogType", "Controller"))
            {
                _logger.LogInformation("Finished executing action - {ActionName}, Controller: {ControllerName}, User: {UserName}",
                    GetActionName(context),
                    GetControllerName(context),
                    GetUsername(context.HttpContext));
            }
        }

        private static string GetControllerName(FilterContext context)
        {
            return context.RouteData.Values["controller"]?.ToString() ?? "None";
        }

        private static string GetActionName(FilterContext context)
        {
            return context.RouteData.Values["action"]?.ToString() ?? "None";
        }

        private static string GetUsername(HttpContext context)
        {
            return context.User.Identity?.Name ?? "Anonymous";
        }

        private async Task<UserRoleEnum?> GetRoleAsync(HttpContext context)
        {
            var userId = UserHelper.GetUserId(context.User).Value;

            var boardIdString = context.Request.RouteValues
                .FirstOrDefault(rv => rv.Key.EndsWith("boardId"))
                .Value?.ToString();

            if (!int.TryParse(boardIdString, out var boardId))
                return null;

            var role = await _boardService.GetUserRoleByBoardIdAndUserIdAsync(boardId, userId);

            return role;
        }
    }
}
