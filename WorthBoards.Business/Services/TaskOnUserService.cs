﻿using AutoMapper;
using Microsoft.AspNetCore.Identity;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Dtos.Responses;
using WorthBoards.Business.Services.Interfaces;
using WorthBoards.Common.Exceptions;
using WorthBoards.Common.Exceptions.Custom;
using WorthBoards.Data.Identity;
using WorthBoards.Data.Repositories.Interfaces;
using WorthBoards.Domain.Entities;

namespace WorthBoards.Business.Services
{
    public class TaskOnUserService(UserManager<ApplicationUser> _userManager, IUnitOfWork _unitOfWork, IMapper _mapper) : ITaskOnUserService
    {
        public async Task<IEnumerable<LinkUserToTaskResponse>> LinkUsersToTaskAsync(int boardId, int taskId, IEnumerable<LinkUserToTaskRequest> linkList, CancellationToken cancellationToken)
        {
            ICollection<TaskOnUser> addedLinks = [];

            var task = await _unitOfWork.BoardTaskRepository.GetByExpressionAsync(t => t.BoardId == boardId && t.Id == taskId, cancellationToken)
                ?? throw new NotFoundException(ExceptionFormatter.NotFound(nameof(BoardTask), [taskId]));

            foreach (var linkDto in linkList)
            {
                var link = _mapper.Map<TaskOnUser>(linkDto);
                link.BoardTaskId = task.Id;

                var user = await _userManager.FindByIdAsync(link.UserId.ToString());
                var existingLink = await _unitOfWork.TasksOnUserRepository.GetByExpressionAsync(
                    t => t.BoardTaskId == task.Id && t.UserId == link.UserId, cancellationToken);

                if (user != null && existingLink == null)
                {
                    await _unitOfWork.TasksOnUserRepository.CreateAsync(link, cancellationToken);
                    addedLinks.Add(link);
                }
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var addedLinksDto = _mapper.Map<IEnumerable<LinkUserToTaskResponse>>(addedLinks);
            return addedLinksDto;
        }

        public async Task<IEnumerable<LinkUserToTaskResponse>> UnlinkUsersFromTaskAsync(int boardId, int taskId, IEnumerable<LinkUserToTaskRequest> linkList, CancellationToken cancellationToken)
        {
            ICollection<LinkUserToTaskResponse> successUnlinks = [];

            var task = await _unitOfWork.BoardTaskRepository.GetByExpressionAsync(t => t.BoardId == boardId && t.Id == taskId, cancellationToken)
                ?? throw new NotFoundException(ExceptionFormatter.NotFound(nameof(BoardTask), [taskId]));

            foreach (var linkDto in linkList)
            {
                var link = _mapper.Map<TaskOnUser>(linkDto);
                link.BoardTaskId = task.Id;

                var taskOnUser = await _unitOfWork.TasksOnUserRepository.GetByExpressionAsync(t => t.BoardTaskId == taskId && t.UserId == link.UserId);

                if (taskOnUser != null)
                {
                    _unitOfWork.TasksOnUserRepository.Delete(taskOnUser);
                    successUnlinks.Add(_mapper.Map<LinkUserToTaskResponse>(taskOnUser));
                }
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return successUnlinks;
        }

        public async Task<IEnumerable<LinkedUserToTaskResponse>> GetUsersLinkedToTaskAsync(int boardId, int taskId, CancellationToken cancellationToken)
        {
            var task = await _unitOfWork.BoardTaskRepository.GetByExpressionAsync(t => t.BoardId == boardId && t.Id == taskId, cancellationToken)
                ?? throw new NotFoundException(ExceptionFormatter.NotFound(nameof(BoardTask), [taskId]));

            var users = await _unitOfWork.TasksOnUserRepository.GetUsersLinkedToTaskAsync(taskId, cancellationToken);
            var usersDtos = _mapper.Map<IEnumerable<LinkedUserToTaskResponse>>(users);

            return usersDtos;
        }
    }
}
