

using WorthBoards.Business.Dtos.Responses;
using WorthBoards.Common.Enums;
using WorthBoards.Domain.Entities;

namespace WorthBoards.Business.Services.Interfaces;

public interface INotificationService {
    Task<List<NotificationResponse>> GetNotificationsByUserId(int userId, CancellationToken cancellationToken);

    Task NotifyBoardInvitation(int boardId, int userId, int responsibleUserId, UserRoleEnum role, CancellationToken cancellationToken);
    Task AcceptInvitation(int notificationId, int userId, CancellationToken cancellationToken);

    Task NotifyTaskCreated(int boardId, int taskId, int responsibleUserId, CancellationToken cancellationToken);

    Task NotifyTaskAssigned(int boardId, int taskId, int userId, int responsibleUserId, CancellationToken cancellationToken);

    Task NotifyTaskStatusChange(int boardId, int taskId, int responsibleUserId, TaskStatusEnum oldStatus, TaskStatusEnum newStatus, CancellationToken cancellationToken);

    Task NotifyUserAdded(int boardId, int userId, int responsibleUserId, CancellationToken cancellationToken);

    // Call this before removing the user so that the user gets the notification that they have been removed
    Task NotifyUserRemoved(int boardId, int userId, int responsibleUserId, UserRoleEnum role, CancellationToken cancellationToken);
}