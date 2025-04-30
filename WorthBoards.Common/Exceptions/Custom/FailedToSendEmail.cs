using System.Net;

namespace WorthBoards.Common.Exceptions.Custom
{
    public class FailedToSendEmail : BaseException
    {
        public override int StatusCode => (int)HttpStatusCode.BadGateway;
        public override string Title => HttpStatusCode.BadGateway.ToString();
        public override string Details => Message;

        public FailedToSendEmail(string message) : base(message) { }

        public FailedToSendEmail(string message, Exception innerException) : base(message, innerException) { }
    }
}
