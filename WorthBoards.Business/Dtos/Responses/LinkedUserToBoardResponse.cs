using WorthBoards.Common.Enums;

namespace WorthBoards.Business.Dtos.Responses
{
    public record LinkedUserToBoardResponse
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string? ImageURL { get; set; }
        public UserRoleEnum UserRole { get; set; }
        public DateTime AddedAt { get; set; }
    }
}
