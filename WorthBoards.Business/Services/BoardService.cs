using AutoMapper;
using WorthBoards.Business.Services.Interfaces;
using WorthBoards.Common.Enums;
using WorthBoards.Data.Repositories.Interfaces;

namespace WorthBoards.Business.Services
{
    public class BoardService(IUnitOfWork _unitOfWork, IMapper _mapper) : IBoardService
    {
        public async Task<UserRoleEnum?> GetUserRoleByBoardIdAndUserIdAsync(int boardId, int userId)
        {
            var board = await _unitOfWork.BoardOnUserRepository.GetByExpressionAsync(
                b => b.UserId == userId && b.BoardId == boardId);

            return board?.UserRole;
        }
    }
}
