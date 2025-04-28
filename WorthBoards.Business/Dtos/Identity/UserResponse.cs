namespace WorthBoards.Business.Dtos.Identity
{
    public record UserResponse(
        int Id,
        string UserName,
        string FirstName,
        string LastName,
        string Email,
        DateTime CreationDate,
        int? ImageURL
    );
}
