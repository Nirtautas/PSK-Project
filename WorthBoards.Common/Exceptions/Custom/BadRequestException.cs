using System.Net;

namespace WorthBoards.Common.Exceptions.Custom
{
    public class BadRequestException : BaseException
    {
        public override int StatusCode => (int) HttpStatusCode.BadRequest;
        public override string Title => HttpStatusCode.BadRequest.ToString();
        public override string Details => Message;

        public BadRequestException(string message): base(message) { }

        public BadRequestException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
