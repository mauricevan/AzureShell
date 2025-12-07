using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using azure_portal_api.Data;
using azure_portal_api.Models;
using azure_portal_api.Services;

namespace azure_portal_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly ITileService _tileService;
        private readonly ApplicationDbContext _context;

        public AdminController(ITileService tileService, ApplicationDbContext context)
        {
            _tileService = tileService;
            _context = context;
        }

        [HttpGet("tiles")]
        public async Task<ActionResult<IEnumerable<Tile>>> GetAllTiles()
        {
            var tiles = await _context.Tiles.OrderBy(t => t.Name).ToListAsync();
            return Ok(tiles);
        }

        [HttpPost("tiles")]
        public async Task<ActionResult<Tile>> CreateTile([FromBody] Tile tile)
        {
            var newTile = await _tileService.CreateTileAsync(tile);
            return CreatedAtAction(nameof(GetAllTiles), new { id = newTile.TileId }, newTile);
        }

        [HttpPut("tiles/{tileId}")]
        public async Task<ActionResult> UpdateTile(string tileId, [FromBody] Tile tile)
        {
            var existingTile = await _tileService.GetTileByIdAsync(tileId);
            if (existingTile == null)
            {
                return NotFound();
            }

            existingTile.Name = tile.Name;
            existingTile.Url = tile.Url;
            existingTile.Type = tile.Type;
            existingTile.IconRef = tile.IconRef;
            existingTile.AllowedGroups = tile.AllowedGroups;

            await _context.SaveChangesAsync();
            return Ok(existingTile);
        }

        [HttpDelete("tiles/{tileId}")]
        public async Task<ActionResult> DeleteTile(string tileId)
        {
            var tile = await _tileService.GetTileByIdAsync(tileId);
            if (tile == null)
            {
                return NotFound();
            }

            _context.Tiles.Remove(tile);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}

