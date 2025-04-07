using FluentValidation;
using WorthBoards.Business.Dtos.Requests;

namespace WorthBoards.Business.Validators
{
    public class CommentUpdateValidator : AbstractValidator<CommentUpdateRequest>
    {
        public CommentUpdateValidator()
        {
            RuleFor(x => x.Content)
                .NotEmpty()
                .WithMessage(ValidationMessages.ContentRequired)
                .MaximumLength(ValidationConstants.ContentMaxLength)
                .WithMessage(ValidationMessages.ContentTooLong);
        }
    }
}
