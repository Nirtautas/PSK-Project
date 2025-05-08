using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json.Linq;
using Serilog.Context;
using System.Text;

namespace WorthBoards.Api.Middlewares
{
    public class HttpLoggingMiddleware
    {
        private string[] sensitiveKeys = ["password", "token", "email", "resetcode"];
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
                _logger.LogInformation("HTTP Request - IP: {ipAddress}, User: {User}, Method: {Method}, Path: {Path}, QueryString: {QueryString},\nRequestBody: {requestBody}",
                    context.Connection.RemoteIpAddress?.ToString() ?? "Unknown",
                    GetUsername(context),
                    context.Request.Method,
                    context.Request.Path,
                    string.IsNullOrEmpty(context.Request.QueryString.Value) ? "None" : SanitizeQuery(context.Request.QueryString),
                    GetJSONRequestBody(context));
            }
        }

        private void LogResponse(HttpContext context)
        {
            using (LogContext.PushProperty("LogType", "Http"))
            {
                _logger.LogInformation("HTTP Response - IP: {ipAddress}, User: {User}, StatusCode: {StatusCode}",
                   context.Connection.RemoteIpAddress?.ToString() ?? "Unknown",
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
            try
            {
                var jsonBody = JObject.Parse(body);

                
                foreach (var prop in jsonBody.Properties().ToList())
                {
                    foreach (var keyword in sensitiveKeys)
                    {
                        if (prop.Name.Contains(keyword, StringComparison.OrdinalIgnoreCase))
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

        private string SanitizeQuery(QueryString queryString)
        {
            var queryCollection = QueryHelpers.ParseQuery(queryString.ToString());

            var sanitizedQuery = queryCollection.Select(qr => {
                foreach (var key in sensitiveKeys)
                {
                    if (qr.Key.Contains(key, StringComparison.OrdinalIgnoreCase))
                        return new KeyValuePair<string, StringValues>(qr.Key, "***REDACTED***");
                }

                return qr;
            });

            return string.Join("&", sanitizedQuery.Select(qr => $"{qr.Key}={qr.Value}"));
        }
    }
}
