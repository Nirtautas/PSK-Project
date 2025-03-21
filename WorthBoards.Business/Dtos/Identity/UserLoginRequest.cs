namespace WorthBoards.Business.Dtos.Identity
{
    public record UserLoginRequest(
        string UserName,
        string Password
    );
}
