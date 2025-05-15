using Microsoft.AspNetCore.Diagnostics;
using WorthBoards.Api.Configurations;
using WorthBoards.Api.Filters.ActionFilters;
using WorthBoards.Api.Middlewares;
using WorthBoards.Api.Utils.ExceptionHandler;
using WorthBoards.Business.Utils.EmailService;
using WorthBoards.Business.Utils.EmailService.Interfaces;

var builder = WebApplication.CreateBuilder(args);

builder
    .ConfigureLogger()
    .ConfigureSwagger()
    .ConfigureGmail()
    .ConfigureAuthentication()
    .ConfigureAuthorization()
    .ConfigureValidators();

builder.Services.AddApiServices(builder.Configuration);
builder.Services.AddBusinessServices(builder.Configuration);
builder.Services.AddDataServices(builder.Configuration);
builder.Services.AddScoped<IEmailService, EmailContextService>();

builder.Services.AddControllers(options =>
{
    var useControllerLoggingActionFilter = builder.Configuration.GetValue<bool>("Logger:UseControllerLoggingActionFilter");
    if (useControllerLoggingActionFilter)
        options.Filters.Add<ControllerLoggingActionFilter>();
}
).AddNewtonsoftJson();
builder.Services.AddScoped<ControllerLoggingActionFilter>();

var baseUrl = builder.Configuration.GetValue<string>("BaseUrl") ?? string.Empty;
builder.WebHost.UseUrls(baseUrl);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin();
        policy.AllowAnyHeader();
        policy.AllowAnyMethod();
    });
});

var app = builder.Build();

app.ConfigureStaticImages();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseExceptionHandler(new ExceptionHandlerOptions
{
    ExceptionHandler = async context =>
    {
        var exception = context.Features.Get<IExceptionHandlerFeature>()?.Error;

        if (exception != null)
        {
            var handler = context.RequestServices.GetRequiredService<GlobalExceptionHandler>();
            await handler.TryHandleAsync(context, exception, CancellationToken.None);
        }
    }
});

app.UseHttpsRedirection();
app.UseRouting();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

var useHttpLoggingMiddleware = builder.Configuration.GetValue<bool>("Logger:UseHttpLoggingMiddleware");
if (useHttpLoggingMiddleware)
    app.UseMiddleware<HttpLoggingMiddleware>();

app.MapControllers();

app.Run();