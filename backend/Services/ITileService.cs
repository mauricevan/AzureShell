using azure_portal_api.Models;

namespace azure_portal_api.Services
{
    public interface ITileService
    {
        Task<IEnumerable<Tile>> GetCatalogAsync(string? userId = null);
        Task<IEnumerable<Tile>> GetUserTilesAsync(string userId);
        Task<UserTile> AddTileToUserAsync(string userId, string tileId);
        Task RemoveTileFromUserAsync(string userId, string tileId);
        Task UpdateTileOrderAsync(string userId, string tileId, int order);
        Task<Tile> CreateTileAsync(Tile tile);
        Task<Tile?> GetTileByIdAsync(string tileId);
    }
}

