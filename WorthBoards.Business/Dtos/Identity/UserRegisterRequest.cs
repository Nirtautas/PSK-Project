namespace WorthBoards.Business.Dtos.Identity
{
    public record UserRegisterRequest(
        string FirstName,
        string LastName,
        string UserName,
        string Email,
        string Password
    );
}
