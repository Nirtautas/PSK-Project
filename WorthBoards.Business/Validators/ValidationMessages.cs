using WorthBoards.Common.Enums;

namespace WorthBoards.Business.Validators
{
    public static class ValidationMessages
    {
        public const string TitleRequired = "Title is required.";
        public static readonly string TitleTooLong = $"Title cannot exceed {ValidationConstants.TitleMaxLength} characters.";
        public const string DescriptionRequired = "Description is required.";
        public static readonly string DescriptionTooLong = $"Description cannot exceed {ValidationConstants.DescriptionMaxLength} characters.";
        public const string ImageURLRequired = "Image URL is required.";
        public const string ImageURLInvalid = "Image URL must be a valid URL.";
        public const string BoardIdInvalid = "Board ID must be greater than zero.";
        public const string DeadlineInvalid = "Deadline must be a future date.";
        public const string TaskStatusInvalid = "Invalid task status.";
        public const string ContentRequired = "Comment content is required.";
        public static readonly string ContentTooLong = $"Content cannot exceed {ValidationConstants.ContentMaxLength} characters.";
        public const string FirstNameRequired = "First name is required.";
        public const string LastNameRequired = "Last name is required.";
        public const string UserNameRequired = "Username is required.";
        public static readonly string FirstNameTooLong = $"Firstname cannot exceed {ValidationConstants.FirstNameMaxLength} characters.";
        public static readonly string LastNameTooLong = $"Lastname cannot exceed {ValidationConstants.LastNameMaxLength} characters.";
        public static readonly string UserNameTooLong = $"Username cannot exceed {ValidationConstants.UserNameMaxLength} characters.";
        public const string EmailRequired = "Email is required.";
        public const string EmailInvalid = "Invalid email format.";
        public const string PasswordRequired = "Password is required.";
        public static readonly string PasswordTooShort = $"Password must be at least {ValidationConstants.PasswordMinLength} characters long.";
        public const string UserRoleValueNotInEnum = "Provided UserRole value is not within enum bounds.";
        public static readonly string UserRoleOwnerConflict = $"Provided UserTole value must not be equal to owner.";
    }
}
