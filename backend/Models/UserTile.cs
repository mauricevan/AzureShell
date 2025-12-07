namespace azure_portal_api.Models
{
    public class UserTile
    {
        public string UserTileId { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; } = string.Empty;
        public string TileId { get; set; } = string.Empty;
        public int Order { get; set; } = 0;
        public bool Pinned { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public virtual User User { get; set; } = null!;
        public virtual Tile Tile { get; set; } = null!;
    }
}

