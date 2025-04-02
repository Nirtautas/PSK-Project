using AutoMapper;
using Microsoft.AspNetCore.JsonPatch;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Dtos.Responses;
using WorthBoards.Business.Services.Interfaces;
using WorthBoards.Common.Exceptions.Custom;
using WorthBoards.Data.Repositories.Interfaces;
using WorthBoards.Domain.Entities;

namespace WorthBoards.Business.Services
{
    public class CommentService(IUnitOfWork _unitOfWork, IMapper _mapper) : ICommentService
    {
        public async Task<(List<CommentResponse> Results, int TotalCount)> GetAllBoardTaskCommentsAsync(int taskId, CancellationToken cancellationToken, int pageNum, int pageSize)
        {
            var (boardTasksComments, totalCount) = await _unitOfWork.CommentRepository.GetAllByExpressionWithPaginationAsync(c => c.TaskId == taskId, pageSize, pageNum, cancellationToken);

            var commentResponses = _mapper.Map<List<CommentResponse>>(boardTasksComments);
            return (commentResponses, totalCount);
        }

        public async Task<CommentResponse> GetCommentByIdAsync(int taskId, int commentId, CancellationToken cancellationToken)
        {
            var comment = await _unitOfWork.CommentRepository.GetByIdAsync(commentId, cancellationToken)
                ?? throw new NotFoundException($"Comment [id {commentId}] doesn't exist.");

            return _mapper.Map<CommentResponse>(comment);
        }

        public async Task<CommentResponse> CreateCommentAsync(int userId, int taskId, CommentRequest commentDto, CancellationToken cancellationToken)
        {
            var comment = _mapper.Map<Comment>(commentDto);

            var boardTask = await _unitOfWork.BoardTaskRepository.GetByExpressionWithIncludesAsync(
                t => t.Id == taskId,
                cancellationToken,
                bt => bt.Board) ?? throw new NotFoundException($"Task [id {taskId}] does not exist.");
            
            if (boardTask.Board == null)
            {
                throw new NotFoundException($"Board [id {boardTask.BoardId}] does not exist.");
            }

            comment.UserId = userId;
            comment.TaskId = taskId;

            await _unitOfWork.CommentRepository.CreateAsync(comment, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return _mapper.Map<CommentResponse>(comment);
        }

        public async Task DeleteCommentAsync(int commentId, CancellationToken cancellationToken)
        {
            var commentToDelete = await _unitOfWork.CommentRepository.GetByIdAsync(commentId, cancellationToken)
                ?? throw new NotFoundException($"Comment [id {commentId}] doesn't exist.");

            _unitOfWork.CommentRepository.Delete(commentToDelete); ;
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        public async Task<CommentResponse> UpdateCommentAsync(int commentToUpdateId, CommentUpdateRequest commentDto, CancellationToken cancellationToken)
        {
            var commentToUpdate = await _unitOfWork.CommentRepository.GetByIdAsync(commentToUpdateId, cancellationToken)
                ?? throw new NotFoundException($"Comment [id {commentToUpdateId}] doesn't exist.");
            
            commentToUpdate.Edited = true;
            _mapper.Map(commentDto, commentToUpdate);

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return _mapper.Map<CommentResponse>(commentToUpdate);
        }

        public async Task<CommentResponse> PatchCommentAsync(int commentToUpdateId, JsonPatchDocument<CommentUpdateRequest> commentPatchDoc, CancellationToken cancellationToken)
        {
            var commentToPatch = await _unitOfWork.CommentRepository.GetByIdAsync(commentToUpdateId, cancellationToken)
                ?? throw new NotFoundException($"Comment [id {commentToUpdateId}] doesn't exist.");

            var commentToUpdateDto = _mapper.Map<CommentUpdateRequest>(commentToPatch);
            commentToPatch.Edited = true;

            commentPatchDoc.ApplyTo(commentToUpdateDto);
            _mapper.Map(commentToUpdateDto, commentToPatch);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return _mapper.Map<CommentResponse>(commentToPatch);
        }
    }
}
