using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorthBoards.Api.Utils;
using WorthBoards.Business.Services.Interfaces;

namespace WorthBoards.Api.Controllers;

[ApiController]
[Route("api/upload")]
public class UploadController(IFileService _fileService) : ControllerBase
{
    [HttpPost("image")]
    [Authorize]
    public async Task<IActionResult> UploadImage(IFormFile image, CancellationToken cancellationToken)
    {
        int userId = UserHelper.GetUserId(User).Value;
        Console.WriteLine($"{userId}, Uploaded image: {image.FileName}");
        var filename = await _fileService.UploadImage(image);

        return Ok(filename);
    }
}

