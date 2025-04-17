namespace WorthBoards.Business.Dtos.Requests;

public class RemoveUserFromBoardRequest
{
    public required int UserId { get; set; }

    public required int BoardId { get; set; }
}