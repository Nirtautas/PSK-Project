using Microsoft.AspNetCore.Http;
using WorthBoards.Business.Services.Interfaces;
using WorthBoards.Business.Validators;
using WorthBoards.Common.Constrants;

namespace WorthBoards.Business.Services;

public class FileService : IFileService
{
    public async Task<string> UploadImage(IFormFile image)
    {
        FileUploadValidator.ValidateImage(image);

        var fileExtension = Path.GetExtension(image.FileName);
        var filename = Guid.NewGuid().ToString() + fileExtension;
        var imagePath = Path.Combine(ImageFiles.STATIC_IMAGE_DIR, filename);
        using (FileStream fileStream = File.OpenWrite(imagePath))
        {
            await image.CopyToAsync(fileStream);
        }
        return filename;
    }
}
