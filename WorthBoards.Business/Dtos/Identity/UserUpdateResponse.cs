namespace WorthBoards.Business.Dtos.Identity
{
    public record UserUpdateResponse
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string? ImageURL { get; set; }
    }
}