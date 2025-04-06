using AutoMapper;
using WorthBoards.Business.Dtos.Identity;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Dtos.Responses;
using WorthBoards.Data.Identity;
using WorthBoards.Domain.Entities;

namespace WorthBoards.Business.AutoMapper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // User
            CreateMap<ApplicationUser, UserResponse>();
            CreateMap<UserRequest, ApplicationUser>();
            CreateMap<UserRegisterRequest, ApplicationUser>();

            //BoardTask
            CreateMap<BoardTask, BoardTaskResponse>();
            CreateMap<BoardTaskRequest, BoardTask>();

            CreateMap<BoardTask, BoardTaskUpdateRequest>();
            CreateMap<BoardTaskUpdateRequest, BoardTask>();

            //Board
            CreateMap<Board, BoardResponse>();
            CreateMap<BoardRequest, Board>();

            CreateMap<Board, BoardUpdateRequest>();
            CreateMap<BoardUpdateRequest, Board>();

            //Comment
            CreateMap<Comment, CommentResponse>();
            CreateMap<CommentRequest, Comment>();

            CreateMap<Comment, CommentUpdateRequest>();
            CreateMap<CommentUpdateRequest, Comment>();

            //BoardOnUser
            CreateMap<BoardOnUser, LinkUserToBoardResponse>();
            CreateMap<LinkUserToBoardRequest, BoardOnUser>();

            CreateMap<LinkUserToBoardResponse, BoardOnUser>();
            CreateMap<BoardOnUser, LinkUserToBoardRequest>();

            //TaskOnUser
            CreateMap<LinkUserToTaskRequest, TaskOnUser>();
            CreateMap<TaskOnUser, LinkUserToTaskResponse>();
        }
    }
}
