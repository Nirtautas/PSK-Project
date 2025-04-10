using WorthBoards.Common.Enums;

namespace WorthBoards.Business.Dtos.Requests
{
    public record LinkUserToBoardRequest
    {
        public UserRoleEnum UserRole { get; set; }
    }
}
