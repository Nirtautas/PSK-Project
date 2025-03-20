using AutoMapper;
using WorthBoards.Business.Dtos.Identity;
using WorthBoards.Data.Identity;

namespace WorthBoards.Business.AutoMapper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // User
            CreateMap<ApplicationUser, UserResponse>();
            CreateMap<UserRequest, ApplicationUser>();
        }
    }
}
