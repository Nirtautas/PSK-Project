using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;
using WorthBoards.Business.Dtos.Identity;
using WorthBoards.Common.Constrants;

namespace WorthBoards.Business.Services.Interfaces
{
    public interface IFileService
    {
        Task<string> UploadImage(IFormFile image);
    }
}
