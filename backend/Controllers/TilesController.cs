using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web;
using azure_portal_api.Services;
using azure_portal_api.Models;

namespace azure_portal_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TilesController : ControllerBase
    {
        private readonly ITileService _tileService;
        private readonly IUserService _userService;

        public TilesController(ITileService tileService, IUserService userService)
        {
            _tileService = tileService;
            _userService = userService;
        }

        [HttpGet("catalog")]
        public async Task<ActionResult<IEnumerable<object>>> GetCatalog()
        {
            var azureAdObjectId = User.GetObjectId();
            var user = await _userService.GetUserByAzureAdIdAsync(azureAdObjectId!);
            var catalog = await _tileService.GetCatalogAsync(user?.UserId);

            var result = catalog.Select(t => new
            {
                id = t.TileId,
                name = t.Name,
                url = t.Url,
                icon = t.IconRef,
                type = t.Type
            });

            return Ok(result);
        }

        [HttpGet("users/{userId}/tiles")]
        public async Task<ActionResult<IEnumerable<object>>> GetUserTiles(string userId)
        {
            var azureAdObjectId = User.GetObjectId();
            var user = await _userService.GetUserByAzureAdIdAsync(azureAdObjectId!);

            if (user == null || user.UserId != userId)
            {
                return Forbid();
            }

            var tiles = await _tileService.GetUserTilesAsync(userId);

            var result = tiles.Select((t, index) => new
            {
                id = t.TileId,
                name = t.Name,
                url = t.Url,
                icon = t.IconRef,
                type = t.Type,
                order = index,
                pinned = true
            });

            return Ok(result);
        }

        [HttpPost("users/{userId}/tiles")]
        public async Task<ActionResult> AddTile(string userId, [FromBody] AddTileRequest request)
        {
            var azureAdObjectId = User.GetObjectId();
            var user = await _userService.GetUserByAzureAdIdAsync(azureAdObjectId!);

            if (user == null || user.UserId != userId)
            {
                return Forbid();
            }

            try
            {
                await _tileService.AddTileToUserAsync(userId, request.TileId);
                return Ok();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("users/{userId}/tiles/{tileId}")]
        public async Task<ActionResult> RemoveTile(string userId, string tileId)
        {
            var azureAdObjectId = User.GetObjectId();
            var user = await _userService.GetUserByAzureAdIdAsync(azureAdObjectId!);

            if (user == null || user.UserId != userId)
            {
                return Forbid();
            }

            await _tileService.RemoveTileFromUserAsync(userId, tileId);
            return NoContent();
        }

        [HttpPut("users/{userId}/tiles/{tileId}")]
        public async Task<ActionResult> UpdateTile(string userId, string tileId, [FromBody] UpdateTileRequest request)
        {
            var azureAdObjectId = User.GetObjectId();
            var user = await _userService.GetUserByAzureAdIdAsync(azureAdObjectId!);

            if (user == null || user.UserId != userId)
            {
                return Forbid();
            }

            if (request.Order.HasValue)
            {
                await _tileService.UpdateTileOrderAsync(userId, tileId, request.Order.Value);
            }

            return Ok();
        }
    }

    public class AddTileRequest
    {
        public string TileId { get; set; } = string.Empty;
    }

    public class UpdateTileRequest
    {
        public int? Order { get; set; }
        public bool? Pinned { get; set; }
    }
}

