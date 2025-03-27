﻿namespace WorthBoards.Data.Repositories.Interfaces;

public interface IUnitOfWork
{
    IBoardRepository BoardRepository { get; }
    ICommentRepository CommentRepository { get; }
    IInvitationDataRepository InvitationDataRepository { get; }
    INotificationRepository NotificationRepository { get; }
    ITasksOnUserRepository TasksOnUserRepository { get; }
    IBoardOnUserRepository BoardOnUserRepository { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
