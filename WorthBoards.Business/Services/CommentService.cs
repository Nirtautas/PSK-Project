using AutoMapper;
using Microsoft.AspNetCore.JsonPatch;
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
    public class CommentService(IUnitOfWork _unitOfWork, IMapper _mapper) : ICommentService
    {
        public async Task<CommentResponse> GetCommentById(int commentId, CancellationToken cancellationToken)
        {
            var comment = await _unitOfWork.CommentRepository.GetByIdAsync(commentId, cancellationToken)
                ?? throw new NotFoundException(ExceptionFormatter.NotFound(nameof(Comment), [commentId]));

            return _mapper.Map<CommentResponse>(comment);
        }

        public async Task<CommentResponse> CreateComment(CommentRequest commentDto, CancellationToken cancellationToken)
        {
            var comment = _mapper.Map<Comment>(commentDto);

            _ = await _unitOfWork.BoardRepository.GetByIdAsync(commentDto.UserId, cancellationToken)
                ?? throw new NotFoundException(ExceptionFormatter.NotFound(nameof(ApplicationUser), [commentDto.UserId]));

            _ = await _unitOfWork.BoardRepository.GetByIdAsync(commentDto.TaskId, cancellationToken) 
                ?? throw new NotFoundException(ExceptionFormatter.NotFound(nameof(Task), [commentDto.TaskId]));

            await _unitOfWork.CommentRepository.CreateAsync(comment, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return _mapper.Map<CommentResponse>(comment);
        }

        public async Task DeleteComment(int commentId, CancellationToken cancellationToken)
        {
            var commentToDelete = await _unitOfWork.CommentRepository.GetByIdAsync(commentId, cancellationToken)
                ?? throw new NotFoundException(ExceptionFormatter.NotFound(nameof(Comment), [commentId]));

            _unitOfWork.CommentRepository.Delete(commentToDelete); ;
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        public async Task<CommentResponse> UpdateComment(int commentToUpdateId, CommentUpdateRequest commentDto, CancellationToken cancellationToken)
        {
            var commentToUpdate = await _unitOfWork.CommentRepository.GetByIdAsync(commentToUpdateId, cancellationToken)
                ?? throw new NotFoundException(ExceptionFormatter.NotFound(nameof(Comment), [commentToUpdateId]));

            _mapper.Map(commentDto, commentToUpdate);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return _mapper.Map<CommentResponse>(commentToUpdate);
        }

        public async Task<CommentResponse> PatchComment(int commentToUpdateId, JsonPatchDocument<CommentUpdateRequest> commentPatchDoc, CancellationToken cancellationToken)
        {
            var commentToPatch = await _unitOfWork.CommentRepository.GetByIdAsync(commentToUpdateId, cancellationToken)
                ?? throw new NotFoundException(ExceptionFormatter.NotFound(nameof(Comment), [commentToUpdateId]));

            var commentToUpdateDto = _mapper.Map<CommentUpdateRequest>(commentToPatch);

            commentPatchDoc.ApplyTo(commentToUpdateDto);
            _mapper.Map(commentToUpdateDto, commentToPatch);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return _mapper.Map<CommentResponse>(commentToPatch);
        }
    }
}
