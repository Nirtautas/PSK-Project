using AutoMapper;
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
        public async Task<IEnumerable<LinkUserToTaskResponse>> LinkUsersToTaskAsync(int taskId, IEnumerable<LinkUserToTaskRequest> linkList, CancellationToken cancellationToken)
        {
            ICollection<LinkUserToTaskResponse> successLinks = [];

            var task = await _unitOfWork.BoardTaskRepository.GetByIdAsync(taskId, cancellationToken)
                ?? throw new NotFoundException(ExceptionFormatter.NotFound(nameof(BoardTask), [taskId]));

            foreach (var linkDto in linkList)
            {
                var link = _mapper.Map<TaskOnUser>(linkDto);
                link.BoardTaskId = task.Id;

                var user = await _userManager.FindByIdAsync(link.UserId.ToString());

                //Is user in board?
                //Link already exists?

                if (user != null)
                {
                    await _unitOfWork.TasksOnUserRepository.CreateAsync(link, cancellationToken);
                    successLinks.Add(_mapper.Map<LinkUserToTaskResponse>(link));
                }
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return successLinks;
        }

        public async Task<IEnumerable<LinkUserToTaskResponse>> UnlinkUsersFromTaskAsync(int taskId, IEnumerable<int> userIds, CancellationToken cancellationToken)
        {
            ICollection<LinkUserToTaskResponse> successUnlinks = [];

            var task = await _unitOfWork.BoardTaskRepository.GetByIdAsync(taskId, cancellationToken)
                ?? throw new NotFoundException(ExceptionFormatter.NotFound(nameof(BoardTask), [taskId]));

            foreach (var userId in userIds)
            {
                var taskOnUser = await _unitOfWork.TasksOnUserRepository.GetByExpressionAsync(t => t.BoardTaskId == taskId && t.UserId == userId);

                if (taskOnUser != null)
                {
                    _unitOfWork.TasksOnUserRepository.Delete(taskOnUser);
                    successUnlinks.Add(_mapper.Map<LinkUserToTaskResponse>(taskOnUser));
                }
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return successUnlinks;
        }
    }
}
