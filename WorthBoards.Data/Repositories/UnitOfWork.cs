using WorthBoards.Common.Exceptions.Custom;
using WorthBoards.Data.Database;
using WorthBoards.Data.Repositories.Interfaces;

namespace WorthBoards.Data.Repositories;

public class UnitOfWork(ApplicationDbContext dbContext,
                        IBoardRepository boardRepository,
                        IBoardTaskRepository boardTaskRepository,
                        ICommentRepository commentRepository,
                        INotificationRepository notificationRepository,
                        ITasksOnUserRepository tasksOnUserRepository,
                        IBoardOnUserRepository boardOnUserRepository,
                        INotificationOnUserRepository notificationOnUserRepository,
                        IUserRepository userRepository) : IUnitOfWork
{
    public IBoardRepository BoardRepository { get; } = boardRepository;
    public IBoardTaskRepository BoardTaskRepository { get; } = boardTaskRepository;
    public ICommentRepository CommentRepository { get; } = commentRepository;
    public INotificationRepository NotificationRepository { get; } = notificationRepository;
    public ITasksOnUserRepository TasksOnUserRepository { get; } = tasksOnUserRepository;
    public IBoardOnUserRepository BoardOnUserRepository { get; } = boardOnUserRepository;
    public INotificationOnUserRepository NotificationOnUserRepository { get; } = notificationOnUserRepository;
    public IUserRepository UserRepository { get; } = userRepository;

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await dbContext.SaveChangesAsync(cancellationToken);
    }

    public void EnsureConcurrencyTokenMatch(uint currentVersion, uint incomingVersion, string entityName)
    {
        if (currentVersion != incomingVersion)
        {
            throw new OptimisticLockException(entityName);
        }
    }
}