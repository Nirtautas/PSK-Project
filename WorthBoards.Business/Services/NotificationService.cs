using Microsoft.AspNetCore.Http;
using WorthBoards.Business.Dtos.Responses;
using WorthBoards.Business.Services.Interfaces;
using WorthBoards.Common.Enums;
using WorthBoards.Common.Exceptions;
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
            notification.Item1, notification.Item2, notification.Item3, notification.Item1.SubjectUserId == userId
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
        await _unitOfWork.NotificationOnUserRepository.AddNotificationToBoardUsers(notification, boardId, cancellationToken);
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
        await _unitOfWork.NotificationOnUserRepository.AddNotificationToBoardUsers(notification, boardId, cancellationToken);
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
        await _unitOfWork.NotificationOnUserRepository.AddNotificationToBoardUsers(notification, boardId, cancellationToken);
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
            await _unitOfWork.NotificationOnUserRepository.AddNotificationToBoardUsers(notification, boardId, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }
    }

    public async Task NotifyBoardInvitation(int boardId, int userId, int responsibleUserId, UserRoleEnum role, CancellationToken cancellationToken)
    {
        if (role == UserRoleEnum.OWNER)
        {
            throw new BadRequestException($"Cannot invite user as {role}.");
        }
        var boardOnSender = await _unitOfWork.BoardOnUserRepository.GetByExpressionAsync(bou => bou.UserId == responsibleUserId && bou.BoardId == boardId, cancellationToken);
        var boardOnInvitee = await _unitOfWork.BoardOnUserRepository.GetByExpressionAsync(bou => bou.UserId == userId && bou.BoardId == boardId, cancellationToken);
        var existingInvitation = await _unitOfWork.NotificationRepository.GetByExpressionAsync(notif => notif.NotificationType == NotificationEventTypeEnum.INVITATION && notif.SubjectUserId == userId);

        if (boardOnSender is not null && !boardOnSender.UserRole.CanSendInvitations())
        {
            throw new UnauthorizedException("You are unauthorized to send invitations to this board.");
        }
        if (boardOnInvitee is not null)
        {
            throw new BadRequestException("Cannot invite a user that has already joined this board.");
        }
        if (existingInvitation is not null)
        {
            throw new BadHttpRequestException("This user has already received an invitation to the board.");
        }
        var notification = new Notification()
        {
            NotificationType = NotificationEventTypeEnum.INVITATION,
            SubjectUserId = userId,
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
            throw new UnauthorizedException("You cannot accept an invitation that wasn't for you.");
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

        await NotifyUserAdded(
            (int)invitationNotification.BoardId,
            userId,
            invitationNotification.SenderId,
            cancellationToken
        );

        _unitOfWork.NotificationRepository.Delete(invitationNotification);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task NotifyUserRemoved(int boardId, int userId, int responsibleUserId, CancellationToken cancellationToken)
    {
        var boardUsers = await _unitOfWork.BoardOnUserRepository.GetAllByExpressionAsync(bou => bou.BoardId == boardId);
        var notification = new Notification()
        {
            NotificationType = responsibleUserId == userId
                ? NotificationEventTypeEnum.USER_LEFT_BOARD
                : NotificationEventTypeEnum.USER_REMOVED_FROM_BOARD,
            SenderId = responsibleUserId,
            SubjectUserId = userId,
            BoardId = boardId,
            NotificationsOnUsers = boardUsers
                .Where(bou => bou.UserId != userId && bou.UserId != responsibleUserId)
                .Select(bou => new NotificationOnUser(){ UserId = bou.UserId })
                .ToList()
        };
        await _unitOfWork.NotificationRepository.CreateAsync(notification, cancellationToken);
    }

    public async Task UnlinkNotification(int userId, int notificationId, CancellationToken cancellationToken)
    {
        var notificationOnUser = await _unitOfWork.NotificationOnUserRepository.GetByExpressionAsync(nou => nou.UserId == userId && nou.NotificationId == notificationId, cancellationToken);
        if (notificationOnUser is null)
        {
            throw new NotFoundException(ExceptionFormatter.NotFound(nameof (notificationOnUser), [notificationId]));
        }
        _unitOfWork.NotificationOnUserRepository.Delete(notificationOnUser);
        var notification = await _unitOfWork.NotificationRepository.GetByExpressionWithIncludesAsync(n => n.Id == notificationId, cancellationToken, n => n.NotificationsOnUsers);
        if (notification is not null && notification.NotificationsOnUsers.Count == 0)
        {
            _unitOfWork.NotificationRepository.Delete(notification);
        }
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
