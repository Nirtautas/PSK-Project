namespace WorthBoards.Common.Exceptions
{
    public static class ErrorMessageConstants
    {
        public const string NOT_FOUND_ERROR = "Resource not found.";
        public const string BAD_REQUEST = "Bad request.";
        public const string BAD_REQUEST_UNLINK_OWNER = "Cannot unlink owner from board.";
        public const string BAD_REQUEST_REMOVE_USER = "You do not have permission to remove this user from this board.";
        public const string INVALID_PASS_RECOVERY_CREDS = "Invalid credentials for password recovery used.";
        public const string EMAIL_NOT_FOUND_IN_TOKEN = "Email was not found in the JWT token.";
    }
}
