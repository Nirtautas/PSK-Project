namespace WorthBoards.Common.Exceptions
{
    public static class ExceptionFormatter
    {
        public static string NotFound(string entityName, int[] entityId)
        {
            string keys = string.Join(", ", entityId);
            return $"{ErrorMessageConstants.NOT_FOUND_ERROR} Of type {entityName} with key(s) {keys}.";
        }
        public static string NotFound() => ErrorMessageConstants.NOT_FOUND_ERROR;
        public static string BadRequestOwnerDuplicate() => ErrorMessageConstants.BAD_REQUEST_OWNER_DUPLICATE;
        public static string BadRequestUnlinkOwner() => ErrorMessageConstants.BAD_REQUEST_UNLINK_OWNER;
    }
}
