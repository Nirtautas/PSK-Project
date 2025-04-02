using AutoMapper;
using Microsoft.AspNetCore.JsonPatch;
using System.ComponentModel.Design;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Dtos.Responses;
using WorthBoards.Business.Services.Interfaces;
using WorthBoards.Common.Enums;
using WorthBoards.Data.Repositories.Interfaces;
using WorthBoards.Domain.Entities;

namespace WorthBoards.Business.Services;

public class NotificationService(IUnitOfWork _unitOfWork, IMapper _mapper) : INotificationService
{
    public async Task<List<NotificationResponse>> GetNotificationsByUserId(int userId)
    {
        var notifications = await _unitOfWork.NotificationRepository.GetNotificationsAndSenderUsernamesByUserIdAsync(userId);

        var notificationsMapped = _mapper.Map<List<(Notification, string)>, List<NotificationResponse>>(notifications);
        if (notificationsMapped is null)
        {
            return new List<NotificationResponse>();
        }

        return notificationsMapped;
    }

    public async Task NotifyTaskDeleted(int boardId, int taskId, int responsibleUserId, CancellationToken cancellationToken)
    {
        // TODO: replace with actual notification data from constants & stuff
        var notification = new Notification()
        {
            Description = "",
            NotificationType = NotificationTypeEnum.MESSAGE,
            InvitationData = null,
            Title = $"Task with id: {taskId} was deleted.",
            SendDate = DateTime.UtcNow,
            SenderId = responsibleUserId
        };
        await _unitOfWork.NotificationRepository.CreateAsync(notification);
        await _unitOfWork.SaveChangesAsync();

        await _unitOfWork.NotificationOnUserRepository.AddNotificationToBoardUsers(notification.Id, boardId, cancellationToken);
    }

    public async Task NotifyTaskStatusChange(int boardId, int taskId, int responsibleUserId, TaskStatusEnum oldStatus, TaskStatusEnum newStatus, CancellationToken cancellationToken)
    {
        // TODO: replace with actual notification data from constants & stuff
        var notification = new Notification()
        {
            Description = "Task status was changed.",
            NotificationType = NotificationTypeEnum.MESSAGE,
            InvitationData = null,
            Title = "",
            SendDate = DateTime.UtcNow,
            SenderId = responsibleUserId
        };
        await _unitOfWork.NotificationRepository.CreateAsync(notification);
        await _unitOfWork.SaveChangesAsync();

        await _unitOfWork.NotificationOnUserRepository.AddNotificationToBoardUsers(notification.Id, boardId, cancellationToken);
    }

    public Task NotifyUserAdded(int boardId, int userId, int responsibleUserId)
    {
        throw new NotImplementedException();
    }

    public Task NotifyUserRemoved(int boardId, int userId, int responsibleUserId)
    {
        throw new NotImplementedException();
    }
}
