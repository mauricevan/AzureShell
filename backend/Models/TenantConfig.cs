namespace azure_portal_api.Models
{
    public class TenantConfig
    {
        public string TenantId { get; set; } = string.Empty;
        public string? Theme { get; set; }
        public string? DefaultTiles { get; set; } // JSON array of tile IDs
        public string? AllowedDomains { get; set; } // JSON array
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}

