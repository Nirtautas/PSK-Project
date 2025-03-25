namespace WorthBoards.Common.Exceptions
{
    public abstract class BaseException : Exception
    {
        public abstract int StatusCode { get; }
        public abstract string Title { get; }
        public abstract string Details { get; }

        protected BaseException(string message) : base(message) { }

        protected BaseException(string message, Exception innerException) : base(message, innerException) { }

        public virtual ErrorDetails GetErrorDetails() => new()
        {
            StatusCode = StatusCode,
            Title = Title,
            Details = Details,
        };
    }
}
