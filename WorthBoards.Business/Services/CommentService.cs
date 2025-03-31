using AutoMapper;
using Microsoft.AspNetCore.JsonPatch;
using System.ComponentModel.Design;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Dtos.Responses;
using WorthBoards.Business.Services.Interfaces;
using WorthBoards.Data.Repositories.Interfaces;
using WorthBoards.Domain.Entities;

namespace WorthBoards.Business.Services
{
    public class CommentService(IUnitOfWork _unitOfWork, IMapper _mapper) : ICommentService
    {
        public async Task<CommentResponse> GetCommentById(int commentId, CancellationToken cancellationToken)
        {
            var comment = await _unitOfWork.CommentRepository.GetByIdAsync(commentId, cancellationToken)
                ?? throw new Exception($"Comment [id {commentId}] doesn't exist.");

            return _mapper.Map<CommentResponse>(comment);
        }

        public async Task<CommentResponse> CreateComment(CommentRequest commentDto, CancellationToken cancellationToken)
        {
            var comment = _mapper.Map<Comment>(commentDto);

            _ = await _unitOfWork.BoardRepository.GetByIdAsync(commentDto.UserId, cancellationToken)
                ?? throw new Exception($"User [id {commentDto.UserId}] doesn't exist.");

            _ = await _unitOfWork.BoardRepository.GetByIdAsync(commentDto.TaskId, cancellationToken) 
                ?? throw new Exception($"Task [id {commentDto.TaskId}] doesn't exist.");

            await _unitOfWork.CommentRepository.CreateAsync(comment, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return _mapper.Map<CommentResponse>(comment);
        }

        public async Task DeleteComment(int commentId, CancellationToken cancellationToken)
        {
            var commentToDelete = await _unitOfWork.CommentRepository.GetByIdAsync(commentId, cancellationToken)
                ?? throw new Exception($"Comment [id {commentId}] doesn't exist.");

            _unitOfWork.CommentRepository.Delete(commentToDelete); ;
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        public async Task<CommentResponse> UpdateComment(int commentToUpdateId, CommentUpdateRequest commentDto, CancellationToken cancellationToken)
        {
            var commentToUpdate = await _unitOfWork.CommentRepository.GetByIdAsync(commentToUpdateId, cancellationToken)
                ?? throw new Exception($"Comment [id {commentToUpdateId}] doesn't exist.");

            _mapper.Map(commentDto, commentToUpdate);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return _mapper.Map<CommentResponse>(commentToUpdate);
        }

        public async Task<CommentResponse> PatchComment(int commentToUpdateId, JsonPatchDocument<CommentUpdateRequest> commentPatchDoc, CancellationToken cancellationToken)
        {
            var commentToPatch = await _unitOfWork.CommentRepository.GetByIdAsync(commentToUpdateId, cancellationToken)
                ?? throw new Exception($"Comment [id {commentToUpdateId}] doesn't exist.");

            var commentToUpdateDto = _mapper.Map<CommentUpdateRequest>(commentToPatch);

            commentPatchDoc.ApplyTo(commentToUpdateDto);
            _mapper.Map(commentToUpdateDto, commentToPatch);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return _mapper.Map<CommentResponse>(commentToPatch);
        }
    }
}
