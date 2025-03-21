using System.Security.Claims;

namespace WorthBoards.Business.Utils.Interfaces
{
    public interface ITokenGenerator
    {
        public string GenerateJwtToken(List<Claim> claims);
    }
}
