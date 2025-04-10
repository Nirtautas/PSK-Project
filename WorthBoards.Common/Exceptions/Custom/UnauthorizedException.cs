using System.Net;

namespace WorthBoards.Common.Exceptions.Custom
{
    public class UnauthorizedException : BaseException
    {
        public override int StatusCode => (int) HttpStatusCode.Unauthorized;
        public override string Title => HttpStatusCode.NotFound.ToString();
        public override string Details => Message;

        public UnauthorizedException(string message) : base(message) { }

        public UnauthorizedException(string message, Exception innerException) : base(message, innerException) { }
    }
}
