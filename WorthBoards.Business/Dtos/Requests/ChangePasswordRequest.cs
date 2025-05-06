namespace WorthBoards.Business.Dtos.Requests
{
    public record ChangePasswordRequest
    {
        public required string OldPassword { get; init; }
        public required string NewPassword { get; init; }
    }
}
