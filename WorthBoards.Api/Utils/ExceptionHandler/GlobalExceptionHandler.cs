using Microsoft.AspNetCore.Diagnostics;
using Microsoft.Net.Http.Headers;
using System.Net.Mime;
using System.Text.Json.Serialization;
using System.Text.Json;
using WorthBoards.Common.Exceptions;
using System.Net;

namespace WorthBoards.Api.Utils.ExceptionHandler
{
    public class GlobalExceptionHandler : IExceptionHandler
    {
        public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
        {
            var exceptionDetails = exception is BaseException baseException
            ? baseException.GetErrorDetails()
            : new ErrorDetails
            {
                StatusCode = (int) HttpStatusCode.InternalServerError,
                Title = HttpStatusCode.InternalServerError.ToString(),
                Details = exception.Message
            };

            httpContext.Response.StatusCode = exceptionDetails.StatusCode;
            httpContext.Response.Headers.Append(HeaderNames.ContentType, MediaTypeNames.Application.Json);

            var jsonOptions = new JsonSerializerOptions
            {
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            await httpContext.Response.WriteAsJsonAsync(exceptionDetails, jsonOptions, cancellationToken);
            return true;
        }
    }
}
