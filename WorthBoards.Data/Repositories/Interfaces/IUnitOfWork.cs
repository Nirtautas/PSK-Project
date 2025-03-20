namespace WorthBoards.Data.Repositories.Interfaces;

public interface IUnitOfWork
{
    IBoardRepository BoardRepository { get; }
    ICommentRepository CommentRepository { get; }
    IInvitationDataRepository InvitationDataRepository { get; }
    INotificationRepository NotificationRepository { get; }
    ITaskRepository TaskRepository { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
