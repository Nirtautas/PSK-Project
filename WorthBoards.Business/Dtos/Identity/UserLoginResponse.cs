namespace WorthBoards.Business.Dtos.Identity
{
    public record UserLoginResponse(
        int Id,
        string UserName,
        string JwtToken
    );
}
