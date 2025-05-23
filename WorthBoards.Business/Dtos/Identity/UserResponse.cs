namespace WorthBoards.Business.Dtos.Identity
{
    public record UserResponse
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public DateTime CreationDate { get; set; }
        public string? ImageURL { get; set; }
    }
}
