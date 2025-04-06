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
            CreateMap<ApplicationUser, LinkedUserToTaskResponse>();

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

            //LinkedUserToBoardResponse
            CreateMap<(BoardOnUser, ApplicationUser), LinkedUserToBoardResponse>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Item2.Id))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Item2.UserName))
                .ForMember(dest => dest.ImageURL, opt => opt.MapFrom(src => src.Item2.ImageURL))
                .ForMember(dest => dest.UserRole, opt => opt.MapFrom(src => src.Item1.UserRole))
                .ForMember(dest => dest.AddedAt, opt => opt.MapFrom(src => src.Item1.AddedAt));
        }
    }
}
