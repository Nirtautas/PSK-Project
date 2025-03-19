using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace WorthBoards.Data.Identity
{
    public class ApplicationUser : IdentityUser<int>
    {
        [MaxLength(30)]
        public required string FirstName { get; set; }
        [MaxLength(30)]
        public required string LastName { get; set; }
        public required DateTime CreationDate { get; set; }
        public required string ImageURL { get; set; }
    }
}
