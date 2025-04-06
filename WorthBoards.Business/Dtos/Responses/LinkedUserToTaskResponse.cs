namespace WorthBoards.Business.Dtos.Responses
{
    public record LinkedUserToTaskResponse
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string? ImageURL { get; set; }
    }
}
