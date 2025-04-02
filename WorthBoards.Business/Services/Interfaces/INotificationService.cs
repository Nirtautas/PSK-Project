

using WorthBoards.Business.Dtos.Responses;
using WorthBoards.Common.Enums;
using WorthBoards.Domain.Entities;

namespace WorthBoards.Business.Services.Interfaces;

public interface INotificationService {
    Task<List<NotificationResponse>> GetNotificationsByUserId(int userId);

    Task NotifyTaskStatusChange(int boardId, int taskId, int responsibleUserId, TaskStatusEnum oldStatus, TaskStatusEnum newStatus, CancellationToken cancellationToken);

    Task NotifyTaskDeleted(int boardId, int taskId, int responsibleUserId, CancellationToken cancellationToken);

    Task NotifyUserAdded(int boardId, int userId, int responsibleUserId);

    Task NotifyUserRemoved(int boardId, int userId, int responsibleUserId);
}