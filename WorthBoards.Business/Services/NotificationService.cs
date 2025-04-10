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
    public async Task<List<NotificationResponse>> GetNotificationsByUserId(int userId, CancellationToken cancellationToken)
    {
        var notifications = await _unitOfWork.NotificationRepository.GetNotificationsAndSenderUsernamesByUserIdAsync(userId, cancellationToken);

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
            Title = $"Task with id: {taskId} was deleted.",
            SendDate = DateTime.UtcNow,
            SenderId = responsibleUserId
        };
        await _unitOfWork.NotificationRepository.CreateAsync(notification, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        await _unitOfWork.NotificationOnUserRepository.AddNotificationToBoardUsers(notification.Id, boardId, cancellationToken);
    }

    public async Task NotifyTaskStatusChange(int boardId, int taskId, int responsibleUserId, TaskStatusEnum oldStatus, TaskStatusEnum newStatus, CancellationToken cancellationToken)
    {
        // TODO: replace with actual notification data from constants & stuff
        var notification = new Notification()
        {
            Description = "",
            NotificationType = NotificationTypeEnum.MESSAGE,
            Title = "Task status was changed.",
            SendDate = DateTime.UtcNow,
            SenderId = responsibleUserId
        };
        await _unitOfWork.NotificationRepository.CreateAsync(notification, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        await _unitOfWork.NotificationOnUserRepository.AddNotificationToBoardUsers(notification.Id, boardId, cancellationToken);
    }

    public async Task NotifyUserAdded(int boardId, int userId, int responsibleUserId, CancellationToken cancellationToken)
    {
        var notification = new Notification()
        {
            Description = $"User with id '{userId}' was added to board '{boardId}' by user '{responsibleUserId}'.",
            NotificationType = NotificationTypeEnum.MESSAGE,
            Title = "User added to board.",
            SendDate = DateTime.UtcNow,
            SenderId = responsibleUserId
        };
        await _unitOfWork.NotificationRepository.CreateAsync(notification, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        await _unitOfWork.NotificationOnUserRepository.AddNotificationToBoardUsers(notification.Id, boardId, cancellationToken);
    }

    public async Task NotifyUserRemoved(int boardId, int userId, int responsibleUserId, CancellationToken cancellationToken)
    {
        var notification = new Notification()
        {
            Description = $"User with id '{userId}' was removed from board '{boardId}' by user '{responsibleUserId}'.",
            NotificationType = NotificationTypeEnum.MESSAGE,
            Title = "User removed from board.",
            SendDate = DateTime.UtcNow,
            SenderId = responsibleUserId
        };
        await _unitOfWork.NotificationRepository.CreateAsync(notification, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        await _unitOfWork.NotificationOnUserRepository.AddNotificationToBoardUsers(notification.Id, boardId, cancellationToken);

        var notificationForSubject = new Notification()
        {
            Description = $"You were removed from board {boardId} by user {responsibleUserId}.",
            NotificationType = NotificationTypeEnum.MESSAGE,
            Title = "You were removed from a board.",
            SendDate = DateTime.UtcNow,
            SenderId = responsibleUserId
        };
    }

    // TODO: Create endpoint for creating invitations
    public async Task NotifyBoardInvitation(int boardId, int userId, int responsibleUserId, CancellationToken cancellationToken)
    {
        var notification = new Notification()
        {
            Description = $"You were invited to board {boardId} by user {responsibleUserId}.",
            NotificationType = NotificationTypeEnum.INVITATION,
            Title = "You were invited to join a board.",
            SendDate = DateTime.UtcNow,
            SenderId = responsibleUserId,
            NotificationsOnUsers = new List<NotificationOnUser>()
            {
                new NotificationOnUser()
                {
                    UserId = userId
                }
            }
        };
        await _unitOfWork.NotificationRepository.CreateAsync(notification, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
