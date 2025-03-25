using WorthBoards.Data.Database;
using WorthBoards.Data.Repositories.Interfaces;

namespace WorthBoards.Data.Repositories;

public class UnitOfWork(ApplicationDbContext dbContext,
                        IBoardRepository boardRepository,
                        IBoardTaskRepository boardTaskRepository,
                        ICommentRepository commentRepository,
                        IInvitationDataRepository invitationDataRepository, 
                        INotificationRepository notificationRepository, 
                        ITasksOnUserRepository tasksOnUserRepository) : IUnitOfWork
{
    public IBoardRepository BoardRepository { get; } = boardRepository;
    public IBoardTaskRepository BoardTaskRepository { get; } = boardTaskRepository;
    public ICommentRepository CommentRepository { get; } = commentRepository;
    public IInvitationDataRepository InvitationDataRepository { get; } = invitationDataRepository;
    public INotificationRepository NotificationRepository { get; } = notificationRepository;
    public ITasksOnUserRepository TasksOnUserRepository { get; } = tasksOnUserRepository;
  
    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await dbContext.SaveChangesAsync(cancellationToken);
    }
}