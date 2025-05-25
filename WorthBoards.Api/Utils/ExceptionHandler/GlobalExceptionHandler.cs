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
        private static JsonSerializerOptions jsonOptions = new JsonSerializerOptions
        {
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
        {
            ErrorDetails response;
            httpContext.Response.Headers.Append(HeaderNames.ContentType, MediaTypeNames.Application.Json);

            switch (exception)
            {
                case BaseException baseException:
                    httpContext.Response.StatusCode = baseException.StatusCode;
                    response = baseException.GetErrorDetails();
                    break;

                default:
                    httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    response = new ErrorDetails
                    {
                        StatusCode = (int)HttpStatusCode.InternalServerError,
                        Title = HttpStatusCode.InternalServerError.ToString(),
                        Details = exception.Message ?? "An unexpected error occurred."
                    };
                    break;
            }


            await httpContext.Response.WriteAsJsonAsync(response, jsonOptions, cancellationToken);
            return true;
        }
    }

}
