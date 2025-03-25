using System.Net;

namespace WorthBoards.Common.Exceptions.Custom
{
    public class NotFoundException : BaseException
    {
        public override int StatusCode => (int) HttpStatusCode.NotFound;
        public override string Title => HttpStatusCode.NotFound.ToString();
        public override string Details => Message;

        public NotFoundException(string message) : base(message) { }

        public NotFoundException(string message, Exception innerException) : base(message, innerException) { }
    }
}
