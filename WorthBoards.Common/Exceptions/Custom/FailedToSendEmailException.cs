using System.Net;

namespace WorthBoards.Common.Exceptions.Custom
{
    public class FailedToSendEmailException : BaseException
    {
        public override int StatusCode => (int)HttpStatusCode.BadGateway;
        public override string Title => HttpStatusCode.BadGateway.ToString();
        public override string Details => Message;

        public FailedToSendEmailException(string message) : base(message) { }

        public FailedToSendEmailException(string message, Exception innerException) : base(message, innerException) { }
    }
}
