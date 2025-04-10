using FluentValidation;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Common.Enums;

namespace WorthBoards.Business.Validators.BoardTask
{
    public class BoardTaskValidator : AbstractValidator<BoardTaskRequest>
    {
        public BoardTaskValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty()
                .WithMessage(ValidationMessages.TitleRequired)
                .MaximumLength(ValidationConstants.TitleMaxLength)
                .WithMessage(ValidationMessages.TitleTooLong);

            RuleFor(x => x.Description)
                .NotEmpty()
                .WithMessage(ValidationMessages.DescriptionRequired)
                .MaximumLength(ValidationConstants.DescriptionMaxLength)
                .WithMessage(ValidationMessages.DescriptionTooLong);

            RuleFor(x => x.DeadlineEnd)
                .GreaterThan(DateTime.UtcNow)
                .WithMessage(ValidationMessages.DeadlineInvalid);

            RuleFor(x => x.TaskStatus)
                .Must(status => Enum.IsDefined(typeof(TaskStatusEnum), status))
                .WithMessage(ValidationMessages.TaskStatusInvalid);
        }
    }
}