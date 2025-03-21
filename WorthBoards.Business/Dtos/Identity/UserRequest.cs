namespace WorthBoards.Business.Dtos.Identity
{
    public record UserRequest(
        string FirstName,
        string LastName,
        string UserName,
        string Email
    );
}
