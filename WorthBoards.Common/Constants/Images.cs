namespace WorthBoards.Common.Constrants;

public class ImageFiles
{
    public static string STATIC_IMAGE_DIR = Path.Combine(Directory.GetCurrentDirectory(), "..", "WorthBoards.Data", "StaticImages");
    public static string STATIC_IMAGE_REQUEST_PATH = "/images";
    public static string STATIC_IMAGE_DIRECTORY_PATH = "http://localhost:5000" + STATIC_IMAGE_REQUEST_PATH;
    public static string GetFormattedImageUrl(string imageName) => $"{STATIC_IMAGE_DIRECTORY_PATH}/{imageName}";
}