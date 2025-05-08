namespace WorthBoards.Business.Dtos.Identity
{
    public class UserPatchRequest
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string ImageURL { get; set; }
    }
}