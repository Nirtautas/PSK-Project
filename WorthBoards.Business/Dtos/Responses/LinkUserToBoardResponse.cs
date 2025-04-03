using WorthBoards.Common.Enums;

namespace WorthBoards.Business.Dtos.Responses
{
    public record LinkUserToBoardResponse
    {
        public int BoardId { get; set; }
        public int UserId { get; set; }
        public DateTime AddedAt { get; set; }
        public UserRoleEnum UserRole { get; set; }
    }
}
