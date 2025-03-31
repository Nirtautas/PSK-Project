<<<<<<< HEAD
=======
using Microsoft.AspNetCore.Diagnostics;
>>>>>>> 7701e0234a41a543a59bf45afdff968aabcc1278
using WorthBoards.Api.Configurations;
using WorthBoards.Api.Utils.ExceptionHandler;

var builder = WebApplication.CreateBuilder(args);

builder
    .ConfigureSwagger()
    .ConfigureAuthentication()
    .ConfigureAuthorization()
    .ConfigureValidators();

// Add services to the container.
builder.Services.AddApiServices(builder.Configuration);
builder.Services.AddBusinessServices(builder.Configuration);
builder.Services.AddDataServices(builder.Configuration);

builder.Services.AddControllers().AddNewtonsoftJson();

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

// Configure the HTTP request pipeline.
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

app.MapControllers();

app.Run();
