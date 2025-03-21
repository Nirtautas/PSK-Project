using WorthBoards.Api.Configurations;

var builder = WebApplication.CreateBuilder(args);

builder.ConfigureSwagger();

// Add services to the container.
builder.Services.AddAuthentication();

builder.Services.AddApiServices(builder.Configuration);
builder.Services.AddBusinessServices(builder.Configuration);
builder.Services.AddDataServices(builder.Configuration);

builder.Services.AddControllers();

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

app.UseHttpsRedirection();
app.UseRouting();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
