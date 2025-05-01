using System.Net;

namespace WorthBoards.Common.Exceptions.Custom
{
    public class OptimisticLockException : BaseException
    {
        public override int StatusCode => (int) HttpStatusCode.Conflict;
        public override string Title => HttpStatusCode.Conflict.ToString();
        public override string Details => Message;

        public OptimisticLockException(string resourceName) : base($"This {resourceName} was modified by another user.") {}
    }
}
