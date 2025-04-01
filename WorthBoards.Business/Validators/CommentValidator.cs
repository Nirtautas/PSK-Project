using FluentValidation;
using WorthBoards.Business.Dtos.Requests;

namespace WorthBoards.Business.Validators
{
    public class CommentValidator : AbstractValidator<CommentRequest>
    {
        public CommentValidator()
        {
            RuleFor(x => x.TaskId)
                .GreaterThan(0)
                .WithMessage(ValidationMessages.TaskIdInvalid);

            RuleFor(x => x.UserId)
                .GreaterThan(0)
                .WithMessage(ValidationMessages.UserIdInvalid);

            RuleFor(x => x.Content)
                .NotEmpty()
                .WithMessage(ValidationMessages.ContentRequired)
                .MaximumLength(ValidationConstants.ContentMaxLength)
                .WithMessage(ValidationMessages.ContentTooLong);
        }
    }
}
