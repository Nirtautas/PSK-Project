using Newtonsoft.Json.Linq;
using Serilog.Context;
using System.Text;

namespace WorthBoards.Api.Middlewares
{
    public class HttpLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<HttpLoggingMiddleware> _logger;

        public HttpLoggingMiddleware(RequestDelegate next, ILogger<HttpLoggingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            LogRequest(context);

            await _next(context);

            LogResponse(context);
        }

        private void LogRequest(HttpContext context)
        {
            using (LogContext.PushProperty("LogType", "Http"))
            {
                _logger.LogInformation("HTTP Request - User: {User}, Method: {Method}, Path: {Path}, QueryString: {QueryString}, \n RequestBody: {requestBody}",
                    GetUsername(context),
                    context.Request.Method,
                    context.Request.Path,
                    context.Request.QueryString,
                    GetJSONRequestBody(context));
            }
        }

        private void LogResponse(HttpContext context)
        {
            using (LogContext.PushProperty("LogType", "Http"))
            {
                _logger.LogInformation("HTTP Response - User: {User}, StatusCode: {StatusCode}",
                   GetUsername(context),
                   context.Response.StatusCode);
            }
        }

        private string GetUsername(HttpContext context)
        {
            return context.User.Identity?.Name ?? "Anonymous";
        }

        private string GetJSONRequestBody(HttpContext context)
        {
            if (!context.Request.ContentType?.Contains("application/json") ?? true)
                return "No JSON body.";

            context.Request.EnableBuffering();
            using (var reader = new StreamReader(
                context.Request.Body,
                encoding: Encoding.UTF8,
                detectEncodingFromByteOrderMarks: false,
                leaveOpen: true))
            {
                var requestBodyString = reader.ReadToEndAsync().Result;

                context.Request.Body.Position = 0;

                return SanitizeBody(requestBodyString);
            }
        }

        private string SanitizeBody(string body)
        {
            string[] sensitiveKeys = ["password", "token"];

            try
            {
                var jsonBody = JObject.Parse(body);

                
                foreach (var prop in jsonBody.Properties().ToList())
                {
                    foreach (var keyword in sensitiveKeys)
                    {
                        if (prop.Name.IndexOf(keyword, StringComparison.OrdinalIgnoreCase) >= 0)
                            prop.Value = "***REDACTED***";
                    }
                }

                return jsonBody.ToString();
            }
            catch
            {
                return "Sanitation failure! JSON body redacted for security.";
            }
        }
    }
}
