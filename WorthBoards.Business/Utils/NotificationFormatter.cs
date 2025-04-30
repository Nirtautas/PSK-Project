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

public class NotificationFormatter
{
    public static NotificationResponse FormatNotification(
        Notification notification,
        string senderUsername,
        string? subjectUsername,
        bool isMe = false)
    {
        var (title, description) = GetNotificationResponseText(notification, senderUsername, subjectUsername, isMe);
        return new NotificationResponse()
        {
            Id = notification.Id,
            BoardId = notification.BoardId,
            SendDate = notification.SendDate,
            TaskId = notification.TaskId,
            Title = title,
            Description = description,
            Type = notification.NotificationType
        };
    }

    private static (string, string) GetNotificationResponseText(Notification notification,
        string senderUsername,
        string? subjectUsername,
        bool isSubjectReceiving)
    {
        if (subjectUsername is null && (notification.NotificationType == NotificationEventTypeEnum.TASK_ASSIGNED
            || notification.NotificationType == NotificationEventTypeEnum.USER_ADDED_TO_BOARD
            || notification.NotificationType == NotificationEventTypeEnum.USER_LEFT_BOARD)
        ) {
            throw new ArgumentNullException(nameof(subjectUsername));
        }

        return notification.NotificationType switch
        {
            NotificationEventTypeEnum.INVITATION => NotificationTextTemplates.Invitation(notification, senderUsername),
            NotificationEventTypeEnum.TASK_CREATED => NotificationTextTemplates.TaskCreated(notification, senderUsername),
            NotificationEventTypeEnum.TASK_STATUS_CHANGE => NotificationTextTemplates.TaskStatusChange(notification, senderUsername),
            NotificationEventTypeEnum.TASK_ASSIGNED => isSubjectReceiving
                ? NotificationTextTemplates.TaskAssignedToYou(notification, senderUsername)
                : NotificationTextTemplates.TaskAssignedTo(notification, senderUsername, subjectUsername),
            NotificationEventTypeEnum.USER_ADDED_TO_BOARD => NotificationTextTemplates.UserAddedToBoard(notification, subjectUsername),
            NotificationEventTypeEnum.USER_REMOVED_FROM_BOARD => isSubjectReceiving
                ? NotificationTextTemplates.YouWereRemovedFromBoard(notification, senderUsername)
                : NotificationTextTemplates.UserRemovedFromBoard(notification, senderUsername, subjectUsername),
            NotificationEventTypeEnum.USER_LEFT_BOARD => NotificationTextTemplates.UserLeftBoard(notification, subjectUsername),
            _ => throw new ArgumentOutOfRangeException(nameof(notification.NotificationType), $"Unexpected notification type: {notification.NotificationType}"),
        };
    }

    private static class NotificationTextTemplates
    {
        public static (string Title, string Message) Invitation(Notification notification, string senderUsername) =>
		("Board invitation", $"You were invited to join board \"{notification.Board.Title}\" by {senderUsername}.");

	public static (string Title, string Message) TaskCreated(Notification notification, string creatorUsername) =>
		("Task created", $"{creatorUsername} created a new task \"{notification.Task.Title}\" on board \"{notification.Board.Title}\".");

	public static (string Title, string Message) TaskStatusChange(Notification notification, string username) =>
		("Task status change", 
			notification.NewTaskStatus == TaskStatusEnum.ARCHIVED
				? $"Board: \"{notification.Board.Title}\" Task \"{notification.Task.Title}\" was archived by {username}."
				: $"Board: \"{notification.Board.Title}\" Task \"{notification.Task.Title}\" status was changed from \"{notification.OldTaskStatus}\" to \"{notification.NewTaskStatus}\" by {username}.");

	public static (string Title, string Message) TaskDeleted(Notification notification, string username) =>
		("Task deleted", $"Board: \"{notification.Board.Title}\" a task was deleted by {username}.");

	public static (string Title, string Message) TaskUpdated(Notification notification, string username) =>
		("Task updated", $"Board: \"{notification.Board.Title}\" task \"{notification.Task.Title}\" was updated by {username}.");

	public static (string Title, string Message) TaskAssignedTo(Notification notification, string userName, string subjectUsername) =>
		("Task assigned", $"Board: \"{notification.Board.Title}\" {subjectUsername} was assigned task \"{notification.Task.Title}\" by {userName}.");

	public static (string Title, string Message) TaskAssignedToYou(Notification notification, string username) =>
		("You were assigned a task", $"Board: \"{notification.Board.Title}\" you were assigned the task \"{notification.Task.Title}\" by {username}.");

	public static (string Title, string Message) UserAddedToBoard(Notification notification, string subjectUsername) =>
		("User joined board", $"Board: \"{notification.Board.Title}\" {subjectUsername} has joined the board.");

	public static (string Title, string Message) UserRemovedFromBoard(Notification notification, string username, string subjectUsername) =>
		("User removed from board", $"Board: \"{notification.Board.Title}\" {subjectUsername} was removed by {username}.");

	public static (string Title, string Message) YouWereRemovedFromBoard(Notification notification, string username) =>
		("You were removed from board", $"You were removed from board \"{notification.Board.Title}\" by {username}.");

	public static (string Title, string Message) UserLeftBoard(Notification notification, string username) =>
		("User left board", $"Board: \"{notification.Board.Title}\" {username} left the board.");
}
}
