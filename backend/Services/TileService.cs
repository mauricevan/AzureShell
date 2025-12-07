using Microsoft.EntityFrameworkCore;
using azure_portal_api.Data;
using azure_portal_api.Models;

namespace azure_portal_api.Services
{
    public class TileService : ITileService
    {
        private readonly ApplicationDbContext _context;

        public TileService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Tile>> GetCatalogAsync(string? userId = null)
        {
            var query = _context.Tiles.AsQueryable();

            // Filter by tenant scope and allowed groups if needed
            query = query.Where(t => t.TenantScoped);

            return await query.OrderBy(t => t.Name).ToListAsync();
        }

        public async Task<IEnumerable<Tile>> GetUserTilesAsync(string userId)
        {
            return await _context.UserTiles
                .Where(ut => ut.UserId == userId)
                .Include(ut => ut.Tile)
                .OrderBy(ut => ut.Order)
                .Select(ut => ut.Tile)
                .ToListAsync();
        }

        public async Task<UserTile> AddTileToUserAsync(string userId, string tileId)
        {
            var existing = await _context.UserTiles
                .FirstOrDefaultAsync(ut => ut.UserId == userId && ut.TileId == tileId);

            if (existing != null)
            {
                throw new InvalidOperationException("Tile already added to user");
            }

            var maxOrder = await _context.UserTiles
                .Where(ut => ut.UserId == userId)
                .Select(ut => ut.Order)
                .DefaultIfEmpty(0)
                .MaxAsync();

            var userTile = new UserTile
            {
                UserId = userId,
                TileId = tileId,
                Order = maxOrder + 1,
                Pinned = true
            };

            _context.UserTiles.Add(userTile);
            await _context.SaveChangesAsync();

            return userTile;
        }

        public async Task RemoveTileFromUserAsync(string userId, string tileId)
        {
            var userTile = await _context.UserTiles
                .FirstOrDefaultAsync(ut => ut.UserId == userId && ut.TileId == tileId);

            if (userTile != null)
            {
                _context.UserTiles.Remove(userTile);
                await _context.SaveChangesAsync();
            }
        }

        public async Task UpdateTileOrderAsync(string userId, string tileId, int order)
        {
            var userTile = await _context.UserTiles
                .FirstOrDefaultAsync(ut => ut.UserId == userId && ut.TileId == tileId);

            if (userTile != null)
            {
                userTile.Order = order;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<Tile> CreateTileAsync(Tile tile)
        {
            _context.Tiles.Add(tile);
            await _context.SaveChangesAsync();
            return tile;
        }

        public async Task<Tile?> GetTileByIdAsync(string tileId)
        {
            return await _context.Tiles.FindAsync(tileId);
        }
    }
}

