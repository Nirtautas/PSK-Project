using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorthBoards.Api.Utils;
using WorthBoards.Business.Dtos.Identity;
using WorthBoards.Business.Dtos.Requests;
using WorthBoards.Business.Dtos.Responses;
using WorthBoards.Business.Services.Interfaces;
using WorthBoards.Common.Enums;
using WorthBoards.Data.Repositories.Interfaces;

namespace WorthBoards.Api.Controllers;

[Route("api/invitations")]
[ApiController]
public class InvitationController(INotificationService _notificationService) : ControllerBase
{
    
}
