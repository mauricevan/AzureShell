using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web;
using azure_portal_api.Services;

namespace azure_portal_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("me")]
        public async Task<ActionResult<object>> GetCurrentUser()
        {
            var azureAdObjectId = User.GetObjectId();
            var email = User.GetDisplayName();
            var name = User.Identity?.Name ?? email;

            var user = await _userService.GetOrCreateUserAsync(azureAdObjectId!, email ?? "", name ?? "");

            return Ok(new
            {
                id = user.UserId,
                email = user.Email,
                displayName = user.DisplayName,
                azureAdObjectId = user.AzureAdObjectId
            });
        }
    }
}

