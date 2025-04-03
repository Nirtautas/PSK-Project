using FluentValidation;
using FluentValidation.AspNetCore;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Validators;
namespace WorthBoards.Api.Configurations;

public static class ValidatorConfiguration
{
    public static WebApplicationBuilder ConfigureValidators(this WebApplicationBuilder builder)
    {
        ArgumentNullException.ThrowIfNull(builder, nameof(builder));

        builder.Services
            .AddFluentValidationAutoValidation()
        .AddFluentValidationClientsideAdapters()
            .AddValidatorsFromAssemblyContaining<BoardRequest>()
            .AddValidatorsFromAssemblyContaining<BoardUpdateRequest>()
            .AddValidatorsFromAssemblyContaining<BoardTaskRequest>()
            .AddValidatorsFromAssemblyContaining<BoardTaskUpdateRequest>()
            .AddValidatorsFromAssemblyContaining<CommentRequest>()
            .AddValidatorsFromAssemblyContaining<CommentUpdateRequest>();

        return builder;
    }
}
