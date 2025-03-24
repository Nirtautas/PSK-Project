using WorthBoards.Common.Enums;

namespace WorthBoards.Business.Services.Interfaces
{
    public interface IBoardService
    {
        public Task<UserRoleEnum?> GetUserRoleByBoardIdAndUserIdAsync(int boardId, int userId);
    }
}
