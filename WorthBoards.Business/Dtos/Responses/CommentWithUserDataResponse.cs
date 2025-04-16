namespace WorthBoards.Business.Dtos.Responses
{
	public record CommentWithUserDataResponse
	{
		public int Id { get; set; }
		public int TaskId { get; set; }
		public int UserId { get; set; }
		public string Content { get; set; }
		public DateTime CreationDate { get; set; }
		public bool Edited { get; set; }
		public string UserName { get; set; }
		public string? ImageURL { get; set; }
	}
}
