using FluentValidation;
using System.Diagnostics;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Common.Enums;

namespace WorthBoards.Business.Validators
{
    public class LinkUserToBoardRequestValidator : AbstractValidator<LinkUserToBoardRequest>
    {
        public LinkUserToBoardRequestValidator()
        {
            RuleFor(x => x.test)
                .LessThanOrEqualTo(1)
                .WithMessage("veikiuuuuuuu");

            //RuleFor(x => x.UserRole)
            //    .Must(x => Enum.IsDefined(typeof(UserRoleEnum), (UserRoleEnum) x))
            //    .WithMessage(":((((((((((");

            //Debug.WriteLine("ATEINU");
        }
    }
}
