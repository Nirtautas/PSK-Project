namespace WorthBoards.Data.Repositories.Interfaces;

public interface IUnitOfWork
{
    IBoardRepository BoardRepository { get; }
    IBoardTaskRepository BoardTaskRepository { get; }
    ICommentRepository CommentRepository { get; }
    INotificationRepository NotificationRepository { get; }
    ITasksOnUserRepository TasksOnUserRepository { get; }
    IBoardOnUserRepository BoardOnUserRepository { get; }   
    INotificationOnUserRepository NotificationOnUserRepository { get; }
    IUserRepository UserRepository { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
