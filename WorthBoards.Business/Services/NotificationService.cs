using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;
using System.ComponentModel.Design;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Dtos.Responses;
using WorthBoards.Business.Services.Interfaces;
using WorthBoards.Common.Enums;
using WorthBoards.Common.Exceptions.Custom;
using WorthBoards.Data.Repositories.Interfaces;
using WorthBoards.Domain.Entities;

namespace WorthBoards.Business.Services;

public class NotificationService(IUnitOfWork _unitOfWork) : INotificationService
{
    public async Task<List<NotificationResponse>> GetNotificationsByUserId(int userId, CancellationToken cancellationToken)
    {
        var notifications = await _unitOfWork.NotificationRepository.GetNotificationsWithSenderAndSubjectUsernamesByUserIdAsync(userId, cancellationToken);

        var notificationsMapped = notifications.Select(notification => NotificationFormatter.FormatNotification(
            notification.Item1, notification.Item2, notification.Item3, userId 
        )).ToList();

        if (notificationsMapped is null)
        {
            return new List<NotificationResponse>();
        }

        return notificationsMapped;
    }

    public async Task NotifyTaskCreated(int boardId, int taskId, int responsibleUserId, CancellationToken cancellationToken)
    {
        var notification = new Notification()
        {
            BoardId = boardId,
            TaskId = taskId,
            NotificationType = NotificationEventTypeEnum.TASK_CREATED,
            SendDate = DateTime.UtcNow,
            SenderId = responsibleUserId
        };
        await _unitOfWork.NotificationRepository.CreateAsync(notification, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    
        await _unitOfWork.NotificationOnUserRepository.AddNotificationToBoardUsers(notification.Id, boardId, cancellationToken);
    }

    public async Task NotifyTaskDeleted(int boardId, int taskId, int responsibleUserId, CancellationToken cancellationToken)
    {
        if ((await _unitOfWork.BoardRepository.GetByIdAsync(boardId, cancellationToken)) is null)
        {
            throw new NotFoundException($"Board with id: '{boardId}' does not exist.");
        }
        if ((await _unitOfWork.BoardTaskRepository.GetByIdAsync(taskId, cancellationToken)) is null) {
            throw new NotFoundException($"Task with id: '{taskId}' does not exist.");
        }

        var notification = new Notification()
        {
            BoardId = boardId,
            TaskId = taskId,
            NotificationType = NotificationEventTypeEnum.TASK_DELETED,
            SendDate = DateTime.UtcNow,
            SenderId = responsibleUserId
        };
        await _unitOfWork.NotificationRepository.CreateAsync(notification, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    
        await _unitOfWork.NotificationOnUserRepository.AddNotificationToBoardUsers(notification.Id, boardId, cancellationToken);
    }

    public async Task NotifyTaskStatusChange(int boardId, int taskId, int responsibleUserId, TaskStatusEnum oldStatus, TaskStatusEnum newStatus, CancellationToken cancellationToken)
    {
        var notification = new Notification()
        {
            NotificationType = NotificationEventTypeEnum.TASK_STATUS_CHANGE,
            SendDate = DateTime.UtcNow,
            SenderId = responsibleUserId,
            OldTaskStatus = oldStatus,
            NewTaskStatus = newStatus,
            BoardId = boardId,
            TaskId = taskId,
        };
        await _unitOfWork.NotificationRepository.CreateAsync(notification, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        await _unitOfWork.NotificationOnUserRepository.AddNotificationToBoardUsers(notification.Id, boardId, cancellationToken);
    }

    public async Task NotifyUserAdded(int boardId, int userId, int responsibleUserId, CancellationToken cancellationToken)
    {
        var notification = new Notification()
        {
            NotificationType = NotificationEventTypeEnum.USER_ADDED_TO_BOARD,
            SendDate = DateTime.UtcNow,
            SenderId = responsibleUserId,
            SubjectUserId = userId,
            BoardId = boardId,
        };
        await _unitOfWork.NotificationRepository.CreateAsync(notification, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        await _unitOfWork.NotificationOnUserRepository.AddNotificationToBoardUsers(notification.Id, boardId, cancellationToken);
    }

    public async Task NotifyUserRemoved(int boardId, int userId, int responsibleUserId, CancellationToken cancellationToken)
    {
        var notification = new Notification()
        {
            NotificationType = NotificationEventTypeEnum.USER_REMOVED_FROM_BOARD,
            SendDate = DateTime.UtcNow,
            SenderId = responsibleUserId,
            SubjectUserId = userId,
            BoardId = boardId,
        };
        await _unitOfWork.NotificationRepository.CreateAsync(notification, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        await _unitOfWork.NotificationOnUserRepository.AddNotificationToBoardUsers(notification.Id, boardId, cancellationToken);
    }

    public async Task NotifyBoardInvitation(int boardId, int userId, int responsibleUserId, UserRoleEnum role, CancellationToken cancellationToken)
    {
        if (role == UserRoleEnum.OWNER)
        {
            throw new BadHttpRequestException($"Cannot invite user as {UserRoleEnum.OWNER}.");
        }
        var notification = new Notification()
        {
            NotificationType = NotificationEventTypeEnum.INVITATION,
            SendDate = DateTime.UtcNow,
            SenderId = responsibleUserId,
            BoardId = boardId,
            InvitationRole = role,
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

    public async Task AcceptInvitation(int notificationId, int userId, CancellationToken cancellationToken)
    {
        var invitationNotification = await _unitOfWork.NotificationRepository.GetByIdAsync(notificationId, cancellationToken);
        if (invitationNotification is null)
        {
            throw new ArgumentNullException(nameof (invitationNotification));
        }
        if (invitationNotification.BoardId is null)
        {
            throw new ArgumentNullException(nameof (invitationNotification.BoardId));
        }
        if (invitationNotification.NotificationsOnUsers.Where(nou => nou.UserId == userId).First() is null)
        {
            throw new UnauthorizedAccessException("You cannot accept an invitation that wasn't for you.");
        }

        await _unitOfWork.BoardOnUserRepository.CreateAsync(
            new BoardOnUser()
            {
                AddedAt = DateTime.UtcNow,
                UserRole = UserRoleEnum.VIEWER,
                BoardId = (int)invitationNotification.BoardId,
                UserId = userId,
            },
            cancellationToken
        );
        await _unitOfWork.SaveChangesAsync();
    }
}
