namespace WorthBoards.Common.Enums
{
    public enum UserRoleEnum
    {
        OWNER = 0,
        EDITOR,
        VIEWER
    }

    public static class UserRoleExtensions
    {
        public static bool CanSendInvitations(this UserRoleEnum role) => role == UserRoleEnum.OWNER;
        public static bool CanRemoveUsers(this UserRoleEnum role) => role == UserRoleEnum.OWNER; 
    }
}
