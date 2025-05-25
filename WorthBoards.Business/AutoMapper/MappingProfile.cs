using AutoMapper;
using WorthBoards.Business.Dtos.Identity;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Dtos.Responses;
using WorthBoards.Common.Constrants;
using WorthBoards.Data.Identity;
using WorthBoards.Domain.Entities;

namespace WorthBoards.Business.AutoMapper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // User
            CreateMap<ApplicationUser, UserResponse>()
                .ForMember(dest => dest.ImageURL, opt => opt.MapFrom(src => ImageFiles.GetFormattedImageUrl(src.ImageURL)));
            CreateMap<UserRequest, ApplicationUser>();
            CreateMap<UserRegisterRequest, ApplicationUser>();
            CreateMap<ApplicationUser, LinkedUserToTaskResponse>();
            CreateMap<ApplicationUser, UserUpdateRequest>();
            CreateMap<UserUpdateRequest, ApplicationUser>();
            CreateMap<ApplicationUser, UserUpdateResponse>();

            //BoardTask
            CreateMap<BoardTask, BoardTaskResponse>();
            CreateMap<BoardTaskRequest, BoardTask>();

            CreateMap<BoardTask, BoardTaskUpdateRequest>();
            CreateMap<BoardTaskUpdateRequest, BoardTask>();

            //Board
            CreateMap<Board, BoardResponse>()
                .ForMember(dest => dest.ImageURL, opt => opt.MapFrom(src => ImageFiles.GetFormattedImageUrl(src.ImageName)));
            CreateMap<BoardRequest, Board>();

            CreateMap<Board, BoardUpdateRequest>();
            CreateMap<BoardUpdateRequest, Board>();

            //Comment
            CreateMap<Comment, CommentResponse>()
                .ForMember(dest => dest.TaskId, opt => opt.MapFrom(src => src.BoardTaskId));
            CreateMap<CommentRequest, Comment>();

            CreateMap<Comment, CommentUpdateRequest>();
            CreateMap<CommentUpdateRequest, Comment>();

            //Notification
            CreateMap<Notification, NotificationResponse>();
            // CreateMap<(Notification, string), NotificationResponse>()
            //     .ConvertUsing(tuple => new NotificationResponse() {
            //         Id = tuple.Item1.Id,
            //         SendDate = tuple.Item1.SendDate,
            //         NotificationType = tuple.Item1.NotificationType,
            //         SenderUsername = tuple.Item2
            //     });

            CreateMap<LinkUserToBoardResponse, BoardOnUser>();
            CreateMap<BoardOnUser, LinkUserToBoardRequest>();

            //TaskOnUser
            CreateMap<LinkUserToTaskRequest, TaskOnUser>();
            CreateMap<TaskOnUser, LinkUserToTaskResponse>();

            //LinkedUserToTaskResponse
            CreateMap<Tuple<TaskOnUser, ApplicationUser>, LinkedUserToTaskResponse>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Item2.Id))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Item2.UserName))
                .ForMember(dest => dest.ImageURL, opt => opt.MapFrom(src => src.Item2.ImageURL))
                .ForMember(dest => dest.AssignedAt, opt => opt.MapFrom(src => src.Item1.AssignedAt));

            //BoardOnUser
            CreateMap<BoardOnUser, LinkUserToBoardResponse>();
            CreateMap<LinkUserToBoardRequest, BoardOnUser>();

            //LinkedUserToBoardResponse
            CreateMap<Tuple<BoardOnUser, ApplicationUser>, LinkedUserToBoardResponse>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Item2.Id))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Item2.UserName))
                .ForMember(dest => dest.ImageURL, opt => opt.MapFrom(src => src.Item2.ImageURL))
                .ForMember(dest => dest.UserRole, opt => opt.MapFrom(src => src.Item1.UserRole))
                .ForMember(dest => dest.AddedAt, opt => opt.MapFrom(src => src.Item1.AddedAt));
        }
    }
}
