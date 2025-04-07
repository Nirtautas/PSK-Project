using FluentValidation;
using System.Diagnostics;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Common.Enums;

namespace WorthBoards.Business.Validators.UserToBoard
{
    public class LinkUserToBoardRequestValidator : AbstractValidator<LinkUserToBoardRequest>
    {
        public LinkUserToBoardRequestValidator()
        {
            RuleFor(x => x.UserRole)
                .IsInEnum()
                .WithMessage(ValidationMessages.UserRoleValueNotInEnum)
                .NotEqual(UserRoleEnum.OWNER)
                .WithMessage(ValidationMessages.UserRoleOwnerConflict);
        }
    }
}
