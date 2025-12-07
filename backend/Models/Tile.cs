namespace azure_portal_api.Models
{
    public class Tile
    {
        public string TileId { get; set; } = Guid.NewGuid().ToString();
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = "link"; // link, sharepoint, app
        public string Url { get; set; } = string.Empty;
        public string? IconRef { get; set; }
        public string? AllowedGroups { get; set; } // JSON array or comma-separated
        public bool TenantScoped { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

