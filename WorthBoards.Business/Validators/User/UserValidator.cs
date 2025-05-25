using FluentValidation;
using WorthBoards.Business.Dtos.Identity;

namespace WorthBoards.Business.Validators.User
{
    public class UserValidator : AbstractValidator<UserRegisterRequest>
    {
        public UserValidator()
        {
            RuleFor(x => x.FirstName)
                .NotEmpty()
                .WithMessage(ValidationMessages.FirstNameRequired)
                .MaximumLength(ValidationConstants.FirstNameMaxLength)
                .WithMessage(ValidationMessages.FirstNameTooLong);

            RuleFor(x => x.LastName)
                .NotEmpty()
                .WithMessage(ValidationMessages.LastNameRequired)
                .MaximumLength(ValidationConstants.LastNameMaxLength)
                .WithMessage(ValidationMessages.LastNameTooLong);

            RuleFor(x => x.UserName)
                .NotEmpty()
                .WithMessage(ValidationMessages.UserNameRequired)
                .MaximumLength(ValidationConstants.UserNameMaxLength)
                .WithMessage(ValidationMessages.UserNameTooLong);
        }
    }
}