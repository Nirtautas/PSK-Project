using FluentValidation;
using FluentValidation.AspNetCore;
using System.Reflection;
namespace WorthBoards.Api.Configurations;

public static class ValidatorConfiguration
{
    public static WebApplicationBuilder ConfigureValidators(this WebApplicationBuilder builder)
    {
        ArgumentNullException.ThrowIfNull(builder, nameof(builder));

        builder.Services
            .AddFluentValidationAutoValidation()
            .AddFluentValidationClientsideAdapters()
            .AddValidatorsFromAssembly(Assembly.Load("WorthBoards.Business"));

        return builder;
    }
}
