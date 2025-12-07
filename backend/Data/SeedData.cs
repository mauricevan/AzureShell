using azure_portal_api.Models;

namespace azure_portal_api.Data
{
    public static class SeedData
    {
        public static void Seed(ApplicationDbContext context)
        {
            if (context.Tiles.Any())
            {
                return; // Database already seeded
            }

            var defaultTiles = new List<Tile>
            {
                new Tile
                {
                    TileId = Guid.NewGuid().ToString(),
                    Name = "SharePoint",
                    Type = "sharepoint",
                    Url = "https://yourtenant.sharepoint.com",
                    IconRef = null,
                    TenantScoped = true
                },
                new Tile
                {
                    TileId = Guid.NewGuid().ToString(),
                    Name = "Microsoft Teams",
                    Type = "app",
                    Url = "https://teams.microsoft.com",
                    IconRef = null,
                    TenantScoped = true
                },
                new Tile
                {
                    TileId = Guid.NewGuid().ToString(),
                    Name = "Outlook",
                    Type = "app",
                    Url = "https://outlook.office.com",
                    IconRef = null,
                    TenantScoped = true
                },
                new Tile
                {
                    TileId = Guid.NewGuid().ToString(),
                    Name = "OneDrive",
                    Type = "app",
                    Url = "https://onedrive.live.com",
                    IconRef = null,
                    TenantScoped = true
                }
            };

            context.Tiles.AddRange(defaultTiles);
            context.SaveChanges();
        }
    }
}

