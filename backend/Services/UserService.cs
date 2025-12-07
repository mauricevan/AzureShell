using Microsoft.EntityFrameworkCore;
using azure_portal_api.Data;
using azure_portal_api.Models;

namespace azure_portal_api.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<User> GetOrCreateUserAsync(string azureAdObjectId, string email, string displayName)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.AzureAdObjectId == azureAdObjectId);

            if (user == null)
            {
                user = new User
                {
                    AzureAdObjectId = azureAdObjectId,
                    Email = email,
                    DisplayName = displayName,
                    CreatedAt = DateTime.UtcNow
                };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }
            else
            {
                // Update display name if changed
                if (user.DisplayName != displayName || user.Email != email)
                {
                    user.DisplayName = displayName;
                    user.Email = email;
                    await _context.SaveChangesAsync();
                }
            }

            return user;
        }

        public async Task<User?> GetUserByAzureAdIdAsync(string azureAdObjectId)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.AzureAdObjectId == azureAdObjectId);
        }
    }
}

