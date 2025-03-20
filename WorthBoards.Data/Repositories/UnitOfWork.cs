using WorthBoards.Data.Database;
using WorthBoards.Data.Repositories.Interfaces;

namespace WorthBoards.Data.Repositories;

public class UnitOfWork(ApplicationDbContext dbContext,
                        IBoardRepository boardRepository,
                        ICommentRepository commentRepository,
                        IInvitationDataRepository invitationDataRepository, 
                        INotificationRepository notificationRepository, 
                        ITaskRepository taskRepository) : IUnitOfWork
{
    public IBoardRepository BoardRepository { get; } = boardRepository;
    public ICommentRepository CommentRepository { get; } = commentRepository;
    public IInvitationDataRepository InvitationDataRepository { get; } = invitationDataRepository;
    public INotificationRepository NotificationRepository { get; } = notificationRepository;
    public ITaskRepository TaskRepository { get; } = taskRepository;
  
    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await dbContext.SaveChangesAsync(cancellationToken);
    }
}