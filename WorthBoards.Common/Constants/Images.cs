namespace WorthBoards.Common.Constrants;

public class ImageFiles
{
    public static long IMAGE_MAX_SIZE = 10485760; // 10 MB
    public static string[] ACCEPTED_IMAGE_FORMATS = [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp"];
    public static string STATIC_IMAGE_DIR = Path.Combine(Directory.GetCurrentDirectory(), "..", "WorthBoards.Data", "StaticImages");
    public static string STATIC_IMAGE_REQUEST_PATH = "/images";
    public static string STATIC_IMAGE_DIRECTORY_PATH = "http://localhost:5000" + STATIC_IMAGE_REQUEST_PATH;
    public static string GetFormattedImageUrl(string imageName) => string.IsNullOrEmpty(imageName) ? "" : $"{STATIC_IMAGE_DIRECTORY_PATH}/{imageName}";
}