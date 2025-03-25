namespace WorthBoards.Data.Repositories.Interfaces;

public interface IUnitOfWork
{
    IBoardRepository BoardRepository { get; }
    IBoardTaskRepository BoardTaskRepository { get; }
    ICommentRepository CommentRepository { get; }
    IInvitationDataRepository InvitationDataRepository { get; }
    INotificationRepository NotificationRepository { get; }
    ITasksOnUserRepository TasksOnUserRepository { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
