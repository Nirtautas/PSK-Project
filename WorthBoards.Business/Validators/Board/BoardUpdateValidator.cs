﻿using FluentValidation;
using WorthBoards.Business.Dtos.Requests;

namespace WorthBoards.Business.Validators.Board
{
    public class BoardUpdateValidator : AbstractValidator<BoardUpdateRequest>
    {
        public BoardUpdateValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty()
                .WithMessage(ValidationMessages.TitleRequired)
                .MaximumLength(ValidationConstants.TitleMaxLength)
                .WithMessage(ValidationMessages.TitleTooLong);

            /*
            RuleFor(x => x.Description)
                .NotEmpty()
                .WithMessage(ValidationMessages.DescriptionRequired)
                .MaximumLength(ValidationConstants.DescriptionMaxLength)
                .WithMessage(ValidationMessages.DescriptionTooLong);
            */

            // RuleFor(x => x.ImageName)
            //     .NotEmpty()
            //     .WithMessage(ValidationMessages.ImageURLRequired)
            //     .Must(IsValidUrl)
            //     .WithMessage(ValidationMessages.ImageURLInvalid);

            static bool IsValidUrl(string url)
            {
                return Uri.TryCreate(url, UriKind.Absolute, out var uriResult)
                       && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
            }
        }
    }
}