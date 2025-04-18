﻿namespace WorthBoards.Common.Exceptions
{
    public static class ErrorMessageConstants
    {
        public const string NOT_FOUND_ERROR = "Resource not found.";
        public const string BAD_REQUEST = "Bad request.";
        public const string BAD_REQUEST_UNLINK_OWNER = "Cannot unlink owner from board.";
        public const string BAD_REQUEST_REMOVE_USER = "You do not have permission to remove this user from this board.";
    }
}
