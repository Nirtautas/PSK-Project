using WorthBoards.Common.Enums;

namespace WorthBoards.Business.Dtos.Requests
{
    public record InvitationRequest
    {
        public required int BoardId { get; set; }
        public required int UserId { get; set; }
        public required UserRoleEnum Role { get; set; } = UserRoleEnum.VIEWER;
    }
}
