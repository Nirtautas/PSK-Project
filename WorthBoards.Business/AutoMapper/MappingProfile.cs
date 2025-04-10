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

            //Notification
            CreateMap<Notification, NotificationResponse>();
            CreateMap<(Notification, string), NotificationResponse>()
                .ConvertUsing(tuple => new NotificationResponse() {
                    Description = tuple.Item1.Description,
                    Id = tuple.Item1.Id,
                    Title = tuple.Item1.Title,
                    SendDate = tuple.Item1.SendDate,
                    NotificationType = tuple.Item1.NotificationType,
                    SenderUsername = tuple.Item2
                });
        }
    }
}
