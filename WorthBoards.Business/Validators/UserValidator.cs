using FluentValidation;
using WorthBoards.Business.Dtos.Identity;

namespace WorthBoards.Business.Validators
{
    public class UserValidator : AbstractValidator<UserRegisterRequest>
    {
        public UserValidator()
        {
            RuleFor(x => x.FirstName)
                .NotEmpty()
                .WithMessage(ValidationMessages.FirstNameRequired)
                .MaximumLength(ValidationConstants.NameMaxLength)
                .WithMessage(ValidationMessages.NameTooLong);

            RuleFor(x => x.LastName)
                .NotEmpty()
                .WithMessage(ValidationMessages.LastNameRequired)
                .MaximumLength(ValidationConstants.NameMaxLength)
                .WithMessage(ValidationMessages.NameTooLong);

            RuleFor(x => x.UserName)
                .NotEmpty()
                .WithMessage(ValidationMessages.UserNameRequired)
                .MaximumLength(ValidationConstants.NameMaxLength)
                .WithMessage(ValidationMessages.NameTooLong);
        }
    }
}