using System.Linq;
using Microsoft.AspNetCore.Http;
using WorthBoards.Common.Constrants;
using WorthBoards.Common.Exceptions.Custom;

namespace WorthBoards.Business.Validators;

class FileUploadValidator
{
    public static void ValidateImage(IFormFile file)
    {
        if (file.Length > ImageFiles.IMAGE_MAX_SIZE)
        {
            throw new BadRequestException($"Images cannot exceed {ImageFiles.IMAGE_MAX_SIZE / 10} megabytes");
        }

        if (!ImageFiles.ACCEPTED_IMAGE_FORMATS
            .Any(format => format.Equals(Path.GetExtension(file.FileName), StringComparison.OrdinalIgnoreCase)))
        {
            throw new BadRequestException($"Unsupported image format. Supported image formats include: {String.Join(", ", ImageFiles.ACCEPTED_IMAGE_FORMATS)}");
        }
    }
}