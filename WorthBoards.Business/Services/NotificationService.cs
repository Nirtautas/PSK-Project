using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
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
            SenderId = responsibleUserId
        };
        await _unitOfWork.NotificationRepository.CreateAsync(notification, cancellationToken);
        await _unitOfWork.NotificationOnUserRepository.AddNotificationToBoardUsers(notification.Id, boardId, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task NotifyTaskStatusChange(int boardId, int taskId, int responsibleUserId, TaskStatusEnum oldStatus, TaskStatusEnum newStatus, CancellationToken cancellationToken)
    {
        var notification = new Notification()
        {
            NotificationType = NotificationEventTypeEnum.TASK_STATUS_CHANGE,
            SenderId = responsibleUserId,
            OldTaskStatus = oldStatus,
            NewTaskStatus = newStatus,
            BoardId = boardId,
            TaskId = taskId,
        };
        await _unitOfWork.NotificationRepository.CreateAsync(notification, cancellationToken);
        await _unitOfWork.NotificationOnUserRepository.AddNotificationToBoardUsers(notification.Id, boardId, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task NotifyUserAdded(int boardId, int userId, int responsibleUserId, CancellationToken cancellationToken)
    {
        var notification = new Notification()
        {
            NotificationType = NotificationEventTypeEnum.USER_ADDED_TO_BOARD,
            SenderId = responsibleUserId,
            SubjectUserId = userId,
            BoardId = boardId,
        };
        await _unitOfWork.NotificationRepository.CreateAsync(notification, cancellationToken);
        await _unitOfWork.NotificationOnUserRepository.AddNotificationToBoardUsers(notification.Id, boardId, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task NotifyTaskAssigned(int boardId, int taskId, int userId, int responsibleUserId, CancellationToken cancellationToken)
    {
        {
            var notification = new Notification()
            {
                NotificationType = NotificationEventTypeEnum.TASK_ASSIGNED,
                SenderId = responsibleUserId,
                SubjectUserId = userId,
                TaskId = taskId,
                BoardId = boardId,
            };
            await _unitOfWork.NotificationRepository.CreateAsync(notification, cancellationToken);
            await _unitOfWork.NotificationOnUserRepository.AddNotificationToBoardUsers(notification.Id, boardId, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }
    }

    public async Task NotifyBoardInvitation(int boardId, int userId, int responsibleUserId, UserRoleEnum role, CancellationToken cancellationToken)
    {
        if (role == UserRoleEnum.OWNER)
        {
            throw new BadHttpRequestException($"Cannot invite user as {role}.");
        }
        var boardOnSender = await _unitOfWork.BoardOnUserRepository.GetByExpressionAsync(bou => bou.UserId == responsibleUserId, cancellationToken);
        var boardOnInvitee = await _unitOfWork.BoardOnUserRepository.GetByExpressionAsync(bou => bou.UserId == responsibleUserId, cancellationToken);
        if (boardOnSender is not null && !boardOnSender.UserRole.CanSendInvitations())
        {
            throw new UnauthorizedAccessException("You are unauthorized to send invitations to this board.");
        }
        if (boardOnInvitee is not null)
        {
            throw new BadHttpRequestException("Cannot invite a user that has already joined this board.");
        }
        var notification = new Notification()
        {
            NotificationType = NotificationEventTypeEnum.INVITATION,
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
        if (invitationNotification is null || invitationNotification.NotificationType != NotificationEventTypeEnum.INVITATION)
        {
            throw new NotFoundException($"Cannot find invitation notification with id: '{notificationId}'.");
        }
        if ((await _unitOfWork.NotificationOnUserRepository.GetByExpressionWithIncludesAsync(
            nou => nou.UserId == userId,
            cancellationToken
        )) is null)
        {
            throw new UnauthorizedAccessException("You cannot accept an invitation that wasn't for you.");
        }

        await _unitOfWork.BoardOnUserRepository.CreateAsync(
            new BoardOnUser()
            {
                AddedAt = DateTime.UtcNow,
                UserRole = UserRoleEnum.VIEWER,
                BoardId = (int) invitationNotification.BoardId,
                UserId = userId,
            },
            cancellationToken
        );

        _unitOfWork.NotificationRepository.Delete(invitationNotification);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task NotifyUserRemoved(int boardId, int userId, int responsibleUserId, UserRoleEnum role, CancellationToken cancellationToken)
    {
        // TODO: fix this method later
        if (role != UserRoleEnum.OWNER)
        {
            throw new BadHttpRequestException($"Cannot remove user as {role}.");
        }
        var boardOnUser = await _unitOfWork.BoardOnUserRepository.GetByExpressionAsync(bou => bou.UserId == responsibleUserId, cancellationToken);
        if (boardOnUser is null) throw new NotFoundException($"User with id: '{userId}' is not part of board: '{boardId}.");
        if (!boardOnUser.UserRole.CanRemoveUsers()
            && userId != responsibleUserId)
        {
            throw new UnauthorizedAccessException("You are unauthorized to remove users from this board.");
        }
        var notification = new Notification()
        {
            NotificationType = NotificationEventTypeEnum.USER_REMOVED_FROM_BOARD,
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
}
