using Microsoft.EntityFrameworkCore;
using azure_portal_api.Models;

namespace azure_portal_api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Tile> Tiles { get; set; }
        public DbSet<UserTile> UserTiles { get; set; }
        public DbSet<TenantConfig> TenantConfigs { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.UserId);
                entity.HasIndex(e => e.AzureAdObjectId).IsUnique();
                entity.Property(e => e.Email).IsRequired().HasMaxLength(256);
            });

            // Tile
            modelBuilder.Entity<Tile>(entity =>
            {
                entity.HasKey(e => e.TileId);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Url).IsRequired().HasMaxLength(1000);
                entity.Property(e => e.Type).IsRequired().HasMaxLength(50);
            });

            // UserTile
            modelBuilder.Entity<UserTile>(entity =>
            {
                entity.HasKey(e => e.UserTileId);
                entity.HasOne(e => e.User)
                    .WithMany(u => u.UserTiles)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.Tile)
                    .WithMany()
                    .HasForeignKey(e => e.TileId)
                    .OnDelete(DeleteBehavior.Restrict);
                entity.HasIndex(e => new { e.UserId, e.TileId }).IsUnique();
            });

            // TenantConfig
            modelBuilder.Entity<TenantConfig>(entity =>
            {
                entity.HasKey(e => e.TenantId);
            });

            // AuditLog
            modelBuilder.Entity<AuditLog>(entity =>
            {
                entity.HasKey(e => e.AuditLogId);
                entity.Property(e => e.Action).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Actor).IsRequired().HasMaxLength(256);
            });
        }
    }
}

