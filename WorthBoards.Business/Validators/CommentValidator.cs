using FluentValidation;
using WorthBoards.Business.Dtos.Requests;

namespace WorthBoards.Business.Validators
{
    public class CommentValidator : AbstractValidator<CommentRequest>
    {
        public CommentValidator()
        {
            RuleFor(x => x.Content)
                .NotEmpty()
                .WithMessage(ValidationMessages.ContentRequired)
                .MaximumLength(ValidationConstants.ContentMaxLength)
                .WithMessage(ValidationMessages.ContentTooLong);
        }
    }
}
